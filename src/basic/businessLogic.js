// ============================================
// BUSINESS LOGIC - 계산 및 상태 관리
// ============================================

import { PRODUCT_IDS, DISCOUNT_RATES, QUANTITY_THRESHOLDS, POINTS_CONFIG } from './constants.js';
import { isTuesday, findProductById } from './utils.js';

// 장바구니 상태 계산 함수 (원본 로직과 동일)
export const calculateCartState = (cartItems, products) => {
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
    cartItems,
    subtotal,
    itemCount,
    itemDiscounts,
    totalAmount,
    discountRate,
  };
};

// AppState 업데이트 함수
export const updateAppState = (cartState, AppState) => {
  AppState.cart.totalAmount = cartState.totalAmount;
  AppState.cart.itemCount = cartState.itemCount;
};

// 장바구니 아이템 계산 (원본 로직과 동일)
const calculateCartItems = (cartItems, products) => {
  let subtotal = 0;
  let itemCount = 0;
  let totalAmount = 0; // 개별 할인이 적용된 총액
  const itemDiscounts = [];

  cartItems.forEach((cartItem) => {
    const currentProduct = findProductById(products, cartItem.productId);
    const { quantity } = cartItem;
    const itemTotal = currentProduct.value * quantity;

    itemCount += quantity;
    subtotal += itemTotal;

    // 개별 할인 계산 및 적용 (원본과 동일)
    const discount = calculateIndividualDiscount(currentProduct.id, quantity);
    if (discount > 0) {
      const { name } = currentProduct;
      itemDiscounts.push({
        name,
        discount: discount * 100,
      });
      totalAmount += itemTotal * (1 - discount); // 개별 할인 적용
    } else {
      totalAmount += itemTotal; // 할인 없음
    }
  });

  return { subtotal, itemCount, itemDiscounts, totalAmount };
};

// 할인 적용하여 최종 금액 계산 (원본 로직과 동일)
const calculateTotalWithDiscounts = (
  subtotal,
  itemCount,
  itemDiscounts,
  individualDiscountedTotal,
) => {
  let totalAmount = individualDiscountedTotal; // 개별 할인이 이미 적용된 금액
  let discountRate = 0;
  const originalTotal = subtotal;

  // 1. 대량구매 할인 적용 (30개 이상이면 전체 소계에 25% 할인)
  if (itemCount >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
    totalAmount = subtotal * (1 - DISCOUNT_RATES.BULK_PURCHASE);
    discountRate = DISCOUNT_RATES.BULK_PURCHASE;
  } else {
    // 개별 할인만 적용된 경우 할인율 계산
    discountRate = (subtotal - totalAmount) / subtotal;
  }

  // 2. 화요일 할인 적용 (최종 금액에 10% 추가 할인)
  const tuesdayDiscount = calculateTuesdayDiscount(totalAmount);
  if (tuesdayDiscount > 0) {
    totalAmount -= tuesdayDiscount;
    discountRate = 1 - totalAmount / originalTotal;
  }

  return { totalAmount, discountRate, tuesdayDiscount };
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
  isTuesday() ? totalAmount * DISCOUNT_RATES.TUESDAY : 0;

// 포인트 계산 통합 함수
export const calculateAllPoints = (totalAmount, cartItems, itemCount) => {
  const basePoints = calculateBasePoints(totalAmount);
  const tuesdayBonus = calculateTuesdayBonus(basePoints);
  const productSet = checkProductSet(cartItems);
  const setBonus = calculateSetBonus(productSet);
  const quantityBonus = calculateQuantityBonus(itemCount);

  let finalPoints = basePoints;
  const pointsDetail = [];

  if (basePoints > 0) {
    pointsDetail.push(`기본: ${basePoints}p`);
  }

  if (tuesdayBonus.points > 0) {
    finalPoints = tuesdayBonus.points;
    pointsDetail.push(tuesdayBonus.detail);
  }

  finalPoints += setBonus.bonus;
  pointsDetail.push(...setBonus.details);

  if (quantityBonus.bonus > 0) {
    finalPoints += quantityBonus.bonus;
    pointsDetail.push(quantityBonus.detail);
  }

  return { finalPoints, pointsDetail };
};

// 기본 포인트 계산
const calculateBasePoints = (totalAmount) => Math.floor(totalAmount / POINTS_CONFIG.POINTS_DIVISOR);

// 화요일 보너스 계산
const calculateTuesdayBonus = (basePoints) => {
  if (!isTuesday() || basePoints <= 0) return { points: 0, detail: '' };
  return {
    points: basePoints * POINTS_CONFIG.TUESDAY_MULTIPLIER,
    detail: '화요일 2배',
  };
};

// 상품 세트 확인
const checkProductSet = (cartItems) => {
  const productIds = cartItems.map((item) => item.productId);
  const hasKeyboard = productIds.includes(PRODUCT_IDS.KEYBOARD);
  const hasMouse = productIds.includes(PRODUCT_IDS.MOUSE);
  const hasMonitorArm = productIds.includes(PRODUCT_IDS.MONITOR_ARM);

  return { hasKeyboard, hasMouse, hasMonitorArm };
};

// 세트 보너스 계산
const calculateSetBonus = (productSet) => {
  let bonus = 0;
  const details = [];

  if (productSet.hasKeyboard && productSet.hasMouse) {
    bonus += POINTS_CONFIG.KEYBOARD_MOUSE_BONUS;
    details.push(`키보드+마우스 세트 +${POINTS_CONFIG.KEYBOARD_MOUSE_BONUS}p`);
  }

  if (productSet.hasKeyboard && productSet.hasMouse && productSet.hasMonitorArm) {
    bonus += POINTS_CONFIG.FULL_SET_BONUS;
    details.push(`풀세트 구매 +${POINTS_CONFIG.FULL_SET_BONUS}p`);
  }

  return { bonus, details };
};

// 수량 보너스 계산
const calculateQuantityBonus = (itemCount) => {
  if (itemCount >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
    return {
      bonus: POINTS_CONFIG.BONUS_30_ITEMS,
      detail: `대량구매(${QUANTITY_THRESHOLDS.BULK_PURCHASE}개+) +${POINTS_CONFIG.BONUS_30_ITEMS}p`,
    };
  }
  if (itemCount >= QUANTITY_THRESHOLDS.POINTS_BONUS_20) {
    return {
      bonus: POINTS_CONFIG.BONUS_20_ITEMS,
      detail: `대량구매(${QUANTITY_THRESHOLDS.POINTS_BONUS_20}개+) +${POINTS_CONFIG.BONUS_20_ITEMS}p`,
    };
  }
  if (itemCount >= QUANTITY_THRESHOLDS.POINTS_BONUS_10) {
    return {
      bonus: POINTS_CONFIG.BONUS_10_ITEMS,
      detail: `대량구매(${QUANTITY_THRESHOLDS.POINTS_BONUS_10}개+) +${POINTS_CONFIG.BONUS_10_ITEMS}p`,
    };
  }
  return { bonus: 0, detail: '' };
};

// 재고 상태 메시지 생성
export const getStockStatusMessage = (products) =>
  products
    .filter((product) => product.stock < QUANTITY_THRESHOLDS.LOW_STOCK)
    .map((product) => {
      if (product.stock > 0) {
        return `${product.name}: 재고 부족 (${product.stock}개 남음)`;
      }
      return `${product.name}: 품절`;
    })
    .join('\n');
