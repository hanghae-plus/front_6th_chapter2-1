// ============================================
// BUSINESS LOGIC - 계산 및 상태 관리
// ============================================

import { PRODUCT_IDS, DISCOUNT_RATES, QUANTITY_THRESHOLDS, POINTS_CONFIG } from './constants.js';
import { isTuesdayDay, findProductById } from './utils.js';

// 캐싱을 위한 Map
const discountCache = new Map();

// 안전한 계산을 위한 헬퍼 함수들
const safeCalculate = (fn, fallback = 0) => {
  try {
    return fn();
  } catch (error) {
    console.error('Calculation error:', error);
    return fallback;
  }
};

const safeFindProduct = (products, productId) => {
  const product = findProductById(products, productId);
  if (!product) {
    console.warn(`Product not found: ${productId}`);
    return null;
  }
  return product;
};

// 캐시된 할인 계산
const getCachedDiscount = (productId, quantity) => {
  const cacheKey = `${productId}-${quantity}`;

  if (discountCache.has(cacheKey)) {
    return discountCache.get(cacheKey);
  }

  const discount = calculateIndividualDiscount(productId, quantity);
  discountCache.set(cacheKey, discount);

  return discount;
};

// 장바구니 상태 계산 함수 (원본 로직과 동일)
export const calculateCartState = (cartItems, products) =>
  safeCalculate(
    () => {
      // 1. 장바구니 아이템 계산 (개별 할인 포함)
      const {
        subtotal,
        itemCount,
        itemDiscounts,
        totalAmount: individualDiscountedTotal,
      } = calculateCartItems(cartItems, products);

      // 2. 대량구매 할인 및 화요일 할인 적용
      const { totalAmount, discountRate } = calculateTotalWithDiscounts(
        subtotal,
        itemCount,
        itemDiscounts,
        individualDiscountedTotal,
      );

      return {
        subtotal,
        itemCount,
        itemDiscounts,
        totalAmount,
        discountRate,
      };
    },
    { subtotal: 0, itemCount: 0, itemDiscounts: [], totalAmount: 0, discountRate: 0 },
  );

// AppState 업데이트 함수
export const updateAppState = (cartState, AppState) => {
  AppState.cart.totalAmount = cartState.totalAmount;
  AppState.cart.itemCount = cartState.itemCount;
  // 포인트 계산 및 업데이트
  AppState.cart.bonusPoints = calculateAllPoints(
    cartState.totalAmount,
    cartState.cartItems,
    cartState.itemCount,
  ).finalPoints;
};

// 장바구니 아이템 계산 (개선된 버전)
const calculateCartItems = (cartItems, products) =>
  cartItems.reduce(
    (acc, cartItem) => {
      const currentProduct = safeFindProduct(products, cartItem.productId);

      // 상품을 찾을 수 없는 경우 건너뛰기
      if (!currentProduct) {
        return acc;
      }

      const { quantity } = cartItem;

      // 개별 함수로 분리
      const itemTotal = calculateItemTotal(currentProduct, quantity);
      const discount = getCachedDiscount(cartItem.productId, quantity);

      return updateCartAccumulator(acc, { product: currentProduct, quantity, itemTotal, discount });
    },
    { subtotal: 0, itemCount: 0, itemDiscounts: [], totalAmount: 0 },
  );

// 아이템 총액 계산
const calculateItemTotal = (product, quantity) => product.value * quantity;

// 장바구니 누적기 업데이트
const updateCartAccumulator = (acc, { product, quantity, itemTotal, discount }) => {
  const discountedTotal = itemTotal * (1 - discount);
  const discountRate = calculateDiscountRate(itemTotal, discountedTotal);

  return {
    subtotal: acc.subtotal + itemTotal,
    itemCount: acc.itemCount + quantity,
    itemDiscounts:
      discount > 0
        ? [...acc.itemDiscounts, { name: product.name, discount: discountRate }]
        : acc.itemDiscounts,
    totalAmount: acc.totalAmount + discountedTotal,
  };
};

// 할인율 계산
const calculateDiscountRate = (originalAmount, discountedAmount) =>
  originalAmount > 0 ? ((originalAmount - discountedAmount) / originalAmount) * 100 : 0;

// 총 할인 적용
const calculateTotalWithDiscounts = (
  subtotal,
  itemCount,
  itemDiscounts,
  individualDiscountedTotal,
) => {
  let totalAmount = individualDiscountedTotal;
  let discountRate = 0;

  // 대량구매 할인 적용 (개별 할인 무시하고 전체에 25% 할인)
  if (itemCount >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
    totalAmount = subtotal * (1 - DISCOUNT_RATES.BULK_PURCHASE);
    discountRate = DISCOUNT_RATES.BULK_PURCHASE;
  } else {
    // 개별 할인이 적용된 경우 할인율 계산
    if (individualDiscountedTotal < subtotal) {
      discountRate = (subtotal - individualDiscountedTotal) / subtotal;
    }
  }

  // 화요일 할인 적용
  const tuesdayDiscount = calculateTuesdayDiscount(totalAmount);
  if (tuesdayDiscount > 0) {
    totalAmount -= tuesdayDiscount;
    // 화요일 할인율을 기존 할인율에 추가
    const tuesdayDiscountRate = tuesdayDiscount / subtotal;
    discountRate += tuesdayDiscountRate;
  }

  return { totalAmount, discountRate };
};

// 개별 상품 할인 계산
const calculateIndividualDiscount = (productId, quantity) => {
  if (quantity < QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT) {
    return 0;
  }

  const discountRates = {
    [PRODUCT_IDS.KEYBOARD]: DISCOUNT_RATES.KEYBOARD,
    [PRODUCT_IDS.MOUSE]: DISCOUNT_RATES.MOUSE,
    [PRODUCT_IDS.MONITOR_ARM]: DISCOUNT_RATES.MONITOR_ARM,
    [PRODUCT_IDS.LAPTOP_POUCH]: DISCOUNT_RATES.LAPTOP_POUCH,
    [PRODUCT_IDS.SPEAKER]: DISCOUNT_RATES.SPEAKER,
  };

  return discountRates[productId] || 0;
};

// 화요일 할인 계산
const calculateTuesdayDiscount = (totalAmount) =>
  isTuesdayDay() ? totalAmount * DISCOUNT_RATES.TUESDAY : 0;

// 화요일 보너스 포인트 계산
const calculateTuesdayBonus = (basePoints) => {
  if (isTuesdayDay() && basePoints > 0) {
    return basePoints * 2;
  }
  return basePoints;
};

// 모든 포인트 계산
export const calculateAllPoints = (totalAmount, cartItems, itemCount) => {
  let finalPoints = calculateBasePoints(totalAmount);
  const pointsDetail = [];

  if (finalPoints > 0) {
    pointsDetail.push(`기본: ${finalPoints}p`);
  }

  // 화요일 보너스
  const tuesdayPoints = calculateTuesdayBonus(finalPoints);
  if (tuesdayPoints !== finalPoints) {
    finalPoints = tuesdayPoints;
    pointsDetail.push('화요일 2배');
  }

  // 세트 보너스
  const productSet = checkProductSet(cartItems);
  const setBonus = calculateSetBonus(productSet);
  if (setBonus > 0) {
    finalPoints += setBonus;
    if (productSet.type === 'full') {
      pointsDetail.push('키보드+마우스 세트 +50p');
      pointsDetail.push('풀세트 구매 +100p');
    } else {
      pointsDetail.push('키보드+마우스 세트 +50p');
    }
  }

  // 수량 보너스
  const quantityBonus = calculateQuantityBonus(itemCount);
  if (quantityBonus > 0) {
    finalPoints += quantityBonus;
    pointsDetail.push(`대량구매(${itemCount}개+) +${quantityBonus}p`);
  }

  return { finalPoints, pointsDetail };
};

// 기본 포인트 계산
const calculateBasePoints = (totalAmount) => Math.floor(totalAmount / POINTS_CONFIG.POINTS_DIVISOR);

// 상품 세트 확인
const checkProductSet = (cartItems) => {
  // cartItems는 이미 배열 형태로 전달됨 (uiUpdates.js에서 변환)
  const hasKeyboard = cartItems.some((item) => item.productId === PRODUCT_IDS.KEYBOARD);
  const hasMouse = cartItems.some((item) => item.productId === PRODUCT_IDS.MOUSE);
  const hasMonitorArm = cartItems.some((item) => item.productId === PRODUCT_IDS.MONITOR_ARM);

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    return { type: 'full', bonus: POINTS_CONFIG.FULL_SET_BONUS };
  }
  if (hasKeyboard && hasMouse) {
    return { type: 'keyboardMouse', bonus: POINTS_CONFIG.KEYBOARD_MOUSE_BONUS };
  }

  return { type: 'none', bonus: 0 };
};

// 세트 보너스 계산
const calculateSetBonus = (productSet) => {
  switch (productSet.type) {
    case 'full':
      return POINTS_CONFIG.FULL_SET_BONUS + POINTS_CONFIG.KEYBOARD_MOUSE_BONUS;
    case 'keyboardMouse':
      return POINTS_CONFIG.KEYBOARD_MOUSE_BONUS;
    default:
      return 0;
  }
};

// 수량 보너스 계산
const calculateQuantityBonus = (itemCount) => {
  if (itemCount >= QUANTITY_THRESHOLDS.BONUS_30) {
    return POINTS_CONFIG.BONUS_30;
  }
  if (itemCount >= QUANTITY_THRESHOLDS.BONUS_20) {
    return POINTS_CONFIG.BONUS_20;
  }
  if (itemCount >= QUANTITY_THRESHOLDS.BONUS_10) {
    return POINTS_CONFIG.BONUS_10;
  }
  return 0;
};

// 재고 상태 메시지 생성
export const getStockStatusMessage = (products) =>
  products
    .filter((product) => product.quantity < QUANTITY_THRESHOLDS.LOW_STOCK)
    .map((product) => {
      if (product.quantity > 0) {
        return `${product.name}: 재고 부족 (${product.quantity}개 남음)`;
      }
      return `${product.name}: 품절`;
    })
    .join('\n');
