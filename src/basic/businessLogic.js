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
  // 포인트 계산 및 업데이트
  AppState.cart.bonusPoints = calculateAllPoints(
    cartState.totalAmount,
    cartState.cartItems,
    cartState.itemCount,
  ).finalPoints;
};

// 장바구니 아이템 계산 (개선된 버전)
const calculateCartItems = (cartItems, products) => {
  return cartItems.reduce(
    (acc, cartItem) => {
      const currentProduct = findProductById(products, cartItem.productId);
      const { quantity } = cartItem;
      const itemTotal = currentProduct.value * quantity;
      const discount = calculateIndividualDiscount(currentProduct.id, quantity);

      acc.itemCount += quantity;
      acc.subtotal += itemTotal;

      if (discount > 0) {
        acc.itemDiscounts.push({
          name: currentProduct.name,
          discount: discount * 100,
        });
        acc.totalAmount += itemTotal * (1 - discount);
      } else {
        acc.totalAmount += itemTotal;
      }

      return acc;
    },
    { subtotal: 0, itemCount: 0, totalAmount: 0, itemDiscounts: [] },
  );
};

// 할인율 계산 통합 함수
const calculateDiscountRate = (originalAmount, discountedAmount) => {
  if (originalAmount === 0) return 0;
  return (originalAmount - discountedAmount) / originalAmount;
};

// 할인 적용하여 최종 금액 계산 (개선된 버전)
const calculateTotalWithDiscounts = (
  subtotal,
  itemCount,
  itemDiscounts,
  individualDiscountedTotal,
) => {
  // 1. 대량구매 할인 적용
  let totalAmount =
    itemCount >= QUANTITY_THRESHOLDS.BULK_PURCHASE
      ? individualDiscountedTotal * (1 - DISCOUNT_RATES.BULK_PURCHASE)
      : individualDiscountedTotal;

  let discountRate =
    itemCount >= QUANTITY_THRESHOLDS.BULK_PURCHASE
      ? DISCOUNT_RATES.BULK_PURCHASE
      : calculateDiscountRate(subtotal, totalAmount);

  // 2. 화요일 할인 적용
  const tuesdayDiscount = calculateTuesdayDiscount(totalAmount);
  if (tuesdayDiscount > 0) {
    totalAmount -= tuesdayDiscount;
    discountRate = calculateDiscountRate(subtotal, totalAmount);
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

// 화요일 관련 로직 통합
const isTuesdayDay = () => isTuesday();

// 화요일 할인 계산
const calculateTuesdayDiscount = (totalAmount) =>
  isTuesdayDay() ? totalAmount * DISCOUNT_RATES.TUESDAY : 0;

// 화요일 보너스 계산
const calculateTuesdayBonus = (basePoints) => {
  if (!isTuesdayDay() || basePoints <= 0) return { points: 0, detail: '' };
  return {
    points: basePoints * POINTS_CONFIG.TUESDAY_MULTIPLIER,
    detail: '화요일 2배',
  };
};

// 포인트 계산 통합 함수 (최종 개선 버전)
export const calculateAllPoints = (totalAmount, cartItems, itemCount) => {
  const basePoints = calculateBasePoints(totalAmount);
  const tuesdayBonus = calculateTuesdayBonus(basePoints);
  const setBonus = calculateSetBonus(checkProductSet(cartItems));
  const quantityBonus = calculateQuantityBonus(itemCount);

  return {
    finalPoints: basePoints + tuesdayBonus.points + setBonus.bonus + quantityBonus.bonus,
    pointsDetail: [
      ...(basePoints > 0 ? [`기본: ${basePoints}p`] : []),
      ...(tuesdayBonus.points > 0 ? [tuesdayBonus.detail] : []),
      ...setBonus.details,
      ...(quantityBonus.bonus > 0 ? [quantityBonus.detail] : []),
    ],
  };
};

// 기본 포인트 계산
const calculateBasePoints = (totalAmount) => Math.floor(totalAmount / POINTS_CONFIG.POINTS_DIVISOR);

// 상품 세트 확인
const checkProductSet = (cartItems) => {
  const productIds = cartItems.map((item) => item.productId);

  return {
    hasKeyboard: productIds.includes(PRODUCT_IDS.KEYBOARD),
    hasMouse: productIds.includes(PRODUCT_IDS.MOUSE),
    hasMonitorArm: productIds.includes(PRODUCT_IDS.MONITOR_ARM),
  };
};

// 세트 보너스 계산 (개선된 버전)
const calculateSetBonus = (productSet) => {
  const bonuses = [];
  let totalBonus = 0;

  if (productSet.hasKeyboard && productSet.hasMouse) {
    totalBonus += POINTS_CONFIG.KEYBOARD_MOUSE_BONUS;
    bonuses.push(`키보드+마우스 세트 +${POINTS_CONFIG.KEYBOARD_MOUSE_BONUS}p`);
  }

  if (productSet.hasKeyboard && productSet.hasMouse && productSet.hasMonitorArm) {
    totalBonus += POINTS_CONFIG.FULL_SET_BONUS;
    bonuses.push(`풀세트 구매 +${POINTS_CONFIG.FULL_SET_BONUS}p`);
  }

  return { bonus: totalBonus, details: bonuses };
};

// 수량 보너스 계산 (개선된 버전)
const calculateQuantityBonus = (itemCount) => {
  const bonusTiers = [
    {
      threshold: QUANTITY_THRESHOLDS.BULK_PURCHASE,
      bonus: POINTS_CONFIG.BONUS_30_ITEMS,
      label: '30개+',
    },
    {
      threshold: QUANTITY_THRESHOLDS.POINTS_BONUS_20,
      bonus: POINTS_CONFIG.BONUS_20_ITEMS,
      label: '20개+',
    },
    {
      threshold: QUANTITY_THRESHOLDS.POINTS_BONUS_10,
      bonus: POINTS_CONFIG.BONUS_10_ITEMS,
      label: '10개+',
    },
  ];

  for (const tier of bonusTiers) {
    if (itemCount >= tier.threshold) {
      return {
        bonus: tier.bonus,
        detail: `대량구매(${tier.label}) +${tier.bonus}p`,
      };
    }
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
