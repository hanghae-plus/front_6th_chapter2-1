// ==========================================
// 할인 계산 서비스 💰
// ==========================================

import {
  PRODUCT_ONE,
  PRODUCT_TWO,
  PRODUCT_THREE,
  PRODUCT_FOUR,
  PRODUCT_FIVE,
  PRODUCT_LIST,
} from '../constants/products.js';

import {
  DISCOUNT_RATES,
  QUANTITY_THRESHOLDS,
  PRICE_CONFIG,
  WEEKDAYS,
} from '../constants/config.js';

// ==========================================
// 할인 계산 상수 및 헬퍼 함수들
// ==========================================

// 할인 계산
const PRODUCT_BULK_DISCOUNT_MAP = {
  [PRODUCT_ONE]: DISCOUNT_RATES.PRODUCT_BULK_DISCOUNTS.KEYBOARD,
  [PRODUCT_TWO]: DISCOUNT_RATES.PRODUCT_BULK_DISCOUNTS.MOUSE,
  [PRODUCT_THREE]: DISCOUNT_RATES.PRODUCT_BULK_DISCOUNTS.MONITOR_ARM,
  [PRODUCT_FOUR]: DISCOUNT_RATES.PRODUCT_BULK_DISCOUNTS.LAPTOP_POUCH,
  [PRODUCT_FIVE]: DISCOUNT_RATES.PRODUCT_BULK_DISCOUNTS.SPEAKER,
};

/**
 * 상품 정보 찾기
 * @param {string} productId - 상품 ID
 * @returns {Object|undefined} - 상품 정보 객체
 */
export function findProductById(productId) {
  return PRODUCT_LIST.find((product) => product.id === productId);
}

/**
 * 개별 상품 할인 계산 (10개 이상)
 * @param {Object} item - 장바구니 아이템 {product, quantity}
 * @returns {number} - 할인율 (0.0 ~ 1.0)
 */
export function calculateItemDiscount(item) {
  if (item.quantity < QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT_MINIMUM) {
    return 0;
  }

  return PRODUCT_BULK_DISCOUNT_MAP[item.product.id] || 0;
}

/**
 * 장바구니에 담은 아이템 데이터 파싱
 * @param {HTMLElement} cartDisplay - 장바구니 컨테이너
 * @returns {Array} - 파싱된 장바구니 아이템 배열
 */
export function parseCartItems(cartDisplay) {
  const cartItems = Array.from(cartDisplay.children);

  return cartItems.map((cartItem) => {
    const product = findProductById(cartItem.id);
    const quantityElement = cartItem.querySelector('.quantity-number');
    const quantity = parseInt(quantityElement.textContent);

    return {
      cartElement: cartItem,
      product,
      quantity,
      subtotal: product.price * quantity,
    };
  });
}

/**
 * 대량 구매 시 UI 강조
 * @param {HTMLElement} cartItem - 장바구니 아이템 요소
 * @param {number} quantity - 수량
 */
export function updateBulkPurchaseUI(cartItem, quantity) {
  const priceElements = cartItem.querySelectorAll('.text-lg, .text-xs');
  const isBulkPurchase =
    quantity >= QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT_MINIMUM;

  priceElements.forEach((element) => {
    if (element.classList.contains('text-lg')) {
      element.style.fontWeight = isBulkPurchase ? 'bold' : 'normal';
    }
  });
}

// ==========================================
// 할인 계산 메인 함수들
// ==========================================

/**
 * 장바구니 아이템별 계산
 * @param {HTMLElement} cartDisplay - 장바구니 컨테이너
 * @returns {Object} - 계산 결과 {items, totalAmount, itemCount, subtotal, itemDiscounts}
 */
export function calculateCartTotals(cartDisplay) {
  const items = parseCartItems(cartDisplay);
  let totalAmount = 0; // 할인
  let itemCount = 0; // 개수
  let subtotal = 0; // 총계
  const itemDiscounts = [];

  items.forEach((item) => {
    const discount = calculateItemDiscount(item);
    const discountedTotal = item.subtotal * (1 - discount);

    updateBulkPurchaseUI(item.cartElement, item.quantity);

    if (discount > 0) {
      itemDiscounts.push({
        name: item.product.name,
        discount: discount * 100,
      });
    }

    totalAmount += discountedTotal;
    itemCount += item.quantity;
    subtotal += item.subtotal;
  });

  return {
    items,
    totalAmount,
    itemCount,
    subtotal,
    itemDiscounts,
  };
}

/**
 * 대량 구매 할인 적용 (30개 이상)
 * @param {Object} cartTotals - 장바구니 총계 정보
 * @returns {Object} - 할인 적용 결과 {finalAmount, discountRate, originalTotal}
 */
export function applyBulkDiscount(cartTotals) {
  if (cartTotals.itemCount < QUANTITY_THRESHOLDS.BULK_DISCOUNT_MINIMUM) {
    return {
      finalAmount: cartTotals.totalAmount,
      discountRate:
        (cartTotals.subtotal - cartTotals.totalAmount) / cartTotals.subtotal,
      originalTotal: cartTotals.subtotal,
    };
  }

  const bulkDiscountedAmount =
    cartTotals.subtotal * PRICE_CONFIG.BULK_DISCOUNT_MULTIPLIER;

  return {
    finalAmount: bulkDiscountedAmount,
    discountRate: DISCOUNT_RATES.BULK_DISCOUNT_30_PLUS,
    originalTotal: cartTotals.subtotal,
  };
}

/**
 * 화요일 특별 할인 적용
 * @param {number} amount - 할인 전 금액
 * @param {number} originalTotal - 원래 총액
 * @returns {Object} - 할인 적용 결과 {finalAmount, discountRate, originalTotal}
 */
export function applyTuesdayDiscount(amount, originalTotal) {
  const today = new Date();
  const isTuesday = today.getDay() === WEEKDAYS.TUESDAY;
  const tuesdaySpecial = document.getElementById('tuesday-special');

  if (isTuesday) {
    if (amount > 0) {
      const finalAmount = amount * PRICE_CONFIG.TUESDAY_MULTIPLIER;
      const discountRate = 1 - finalAmount / originalTotal;
      tuesdaySpecial?.classList.remove('hidden');

      return {
        finalAmount,
        discountRate,
        originalTotal,
      };
    } else {
      tuesdaySpecial?.classList.add('hidden');
    }
  } else {
    tuesdaySpecial?.classList.add('hidden');
  }

  return {
    finalAmount: amount,
    discountRate: 1 - amount / originalTotal,
    originalTotal,
  };
}
