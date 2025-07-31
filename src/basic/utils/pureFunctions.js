// ==========================================
// 순수 함수들 (비즈니스 로직)
// ==========================================

import { THRESHOLDS, DISCOUNT_RATES } from '../constant/index.js';
import {
  getDiscountedProductName,
  getDiscountedPriceHTML,
} from '../main.basic.js';

/**
 * 장바구니 소계 계산 (순수 함수)
 *
 * @param {Array} cartItems - 장바구니 아이템들
 * @param {Array} products - 상품 목록
 * @returns {number} 소계 금액
 */
export const calculateCartSubtotal = (cartItems, products) => {
  const productMap = new Map(products.map(product => [product.id, product]));

  return Array.from(cartItems).reduce((subtotal, cartItem) => {
    const product = productMap.get(cartItem.id);
    if (!product) {
      return subtotal;
    }

    const quantity = parseInt(
      cartItem.querySelector('.quantity-number')?.textContent || '0',
    );
    return subtotal + product.val * quantity;
  }, 0);
};

/**
 * 최종 할인 계산 (순수 함수)
 *
 * @param {number} subtotal - 소계 금액
 * @param {number} itemCount - 아이템 수량
 * @param {Array} itemDiscounts - 개별 할인 정보
 * @param {boolean} isTuesdayApplied - 화요일 할인 적용 여부
 * @returns {Object} 할인 정보
 */
export const calculateFinalDiscounts = (
  subtotal,
  itemCount,
  itemDiscounts = [],
  isTuesdayApplied = false,
) => {
  let finalDiscount = 0;
  const discountDetails = [];

  // 대량구매 할인 (30개 이상)
  if (itemCount >= THRESHOLDS.BULK_DISCOUNT_MIN) {
    finalDiscount = subtotal * DISCOUNT_RATES.BULK_DISCOUNT;
    discountDetails.push({
      type: 'bulk',
      name: `대량구매 할인 (${THRESHOLDS.BULK_DISCOUNT_MIN}개 이상)`,
      rate: DISCOUNT_RATES.BULK_DISCOUNT * 100,
    });
  } else if (itemDiscounts.length > 0) {
    // 개별 상품 할인
    itemDiscounts.forEach(item => {
      const itemDiscount = subtotal * (item.discount / 100);
      finalDiscount += itemDiscount;
      discountDetails.push({
        type: 'individual',
        name: `${item.name} (${THRESHOLDS.ITEM_DISCOUNT_MIN}개↑)`,
        rate: item.discount,
      });
    });
  }

  // 화요일 할인
  if (isTuesdayApplied) {
    const tuesdayDiscount = subtotal * DISCOUNT_RATES.TUESDAY_DISCOUNT;
    finalDiscount += tuesdayDiscount;
    discountDetails.push({
      type: 'tuesday',
      name: '화요일 추가 할인',
      rate: DISCOUNT_RATES.TUESDAY_DISCOUNT * 100,
    });
  }

  return {
    finalDiscount,
    discountDetails,
    finalAmount: subtotal - finalDiscount,
  };
};

/**
 * 포인트 계산 (순수 함수)
 *
 * @param {number} finalAmount - 최종 결제 금액
 * @param {Array} cartItems - 장바구니 아이템들
 * @param {Array} products - 상품 목록
 * @param {boolean} isTuesdayApplied - 화요일 할인 적용 여부
 * @returns {Object} 포인트 정보
 */
export const calculatePoints = (
  finalAmount,
  cartItems,
  products,
  isTuesdayApplied = false,
) => {
  // 기본 포인트
  const basePoints = Math.floor(finalAmount / THRESHOLDS.POINTS_PER_WON);

  // 화요일 보너스
  const tuesdayBonus = isTuesdayApplied ? basePoints : 0;

  // 세트 보너스 계산
  // const productMap = new Map(products.map(product => [product.id, product]));
  const cartProductIds = Array.from(cartItems).map(item => item.id);

  const hasKeyboard = cartProductIds.includes('p1');
  const hasMouse = cartProductIds.includes('p2');
  const hasMonitorArm = cartProductIds.includes('p3');

  let setBonus = 0;
  const setDetails = [];

  // 키보드+마우스 세트
  if (hasKeyboard && hasMouse) {
    setBonus += 50;
    setDetails.push('키보드+마우스 세트 +50p');
  }

  // 풀세트 (키보드+마우스+모니터암)
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    setBonus += 100;
    setDetails.push('풀세트 구매 +100p');
  }

  // 수량별 보너스
  const totalQuantity = Array.from(cartItems).reduce((total, item) => {
    const quantity = parseInt(
      item.querySelector('.quantity-number')?.textContent || '0',
    );
    return total + quantity;
  }, 0);

  let quantityBonus = 0;
  if (totalQuantity >= THRESHOLDS.BULK_DISCOUNT_MIN) {
    quantityBonus = 100;
    setDetails.push(`대량구매(${THRESHOLDS.BULK_DISCOUNT_MIN}개+) +100p`);
  } else if (totalQuantity >= THRESHOLDS.BULK_20_MIN) {
    quantityBonus = 50;
    setDetails.push(`대량구매(${THRESHOLDS.BULK_20_MIN}개+) +50p`);
  } else if (totalQuantity >= THRESHOLDS.ITEM_DISCOUNT_MIN) {
    quantityBonus = 20;
    setDetails.push(`대량구매(${THRESHOLDS.ITEM_DISCOUNT_MIN}개+) +20p`);
  }

  const totalPoints = basePoints + tuesdayBonus + setBonus + quantityBonus;

  return {
    basePoints,
    tuesdayBonus,
    setBonus,
    quantityBonus,
    totalPoints,
    setDetails,
  };
};

/**
 * 상품 유효성 검사 (순수 함수)
 *
 * @param {Object} product - 상품 정보
 * @param {number} quantity - 수량
 * @returns {Object} 검사 결과
 */
export const validateProduct = (product, quantity) => {
  if (!product) {
    return { isValid: false, error: '상품을 찾을 수 없습니다.' };
  }

  if (product.quantity <= 0) {
    return { isValid: false, error: '품절된 상품입니다.' };
  }

  if (quantity > product.quantity) {
    return { isValid: false, error: '재고가 부족합니다.' };
  }

  return { isValid: true, error: null };
};

/**
 * 장바구니 아이템 HTML 생성 (순수 함수)
 *
 * @param {Object} item - 상품 정보
 * @returns {string} HTML 문자열
 */
export const createCartItemHTML = item => {
  return `
    <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
      <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
    </div>
    <div>
      <h3 class="text-base font-normal mb-1 tracking-tight">${getDiscountedProductName(item)}</h3>
      <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
      <p class="text-xs text-black mb-3">${getDiscountedPriceHTML(item)}</p>
      <div class="flex items-center gap-4">
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${item.id}" data-change="-1">−</button>
        <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${item.id}" data-change="1">+</button>
      </div>
    </div>
    <div class="text-right">
      <div class="text-lg mb-2 tracking-tight tabular-nums">${getDiscountedPriceHTML(item)}</div>
      <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${item.id}">Remove</a>
    </div>
  `;
};

/**
 * 새로운 장바구니 아이템 DOM 요소 생성 (순수 함수)
 *
 * @param {Object} item - 상품 정보
 * @returns {HTMLElement} DOM 요소
 */
export const createCartItemElement = item => {
  const newItem = document.createElement('div');
  newItem.id = item.id;
  newItem.className =
    'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';
  newItem.innerHTML = createCartItemHTML(item);
  return newItem;
};
