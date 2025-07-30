import { DISCOUNT_THRESHOLDS, DISCOUNT_RATES, UI_CONSTANTS } from '../../constants/index.js';

/**
 * 할인 관련 비즈니스 로직을 담당하는 함수들
 */

/**
 * 화요일 여부 확인
 */
export function checkIsTuesday() {
  return new Date().getDay() === UI_CONSTANTS.TUESDAY;
}

/**
 * 개별 상품 할인 계산
 */
export function calculateItemDiscount(productId, quantity, calculateItemDiscountFn) {
  return calculateItemDiscountFn(productId, quantity);
}

/**
 * 대량구매 할인 계산
 */
export function calculateBulkDiscount(itemCount) {
  if (itemCount >= DISCOUNT_THRESHOLDS.BULK_PURCHASE) {
    return DISCOUNT_RATES.BULK_PURCHASE;
  }
  return 0;
}

/**
 * 화요일 할인 계산
 */
export function calculateTuesdayDiscount() {
  if (checkIsTuesday()) {
    return DISCOUNT_RATES.TUESDAY;
  }
  return 0;
}

/**
 * 총 할인율 계산
 */
export function calculateTotalDiscountRate(itemCount, subtotal, currentAmount) {
  let finalAmount = currentAmount;
  let discountRate = 0;

  // 대량구매 할인 적용
  const bulkDiscount = calculateBulkDiscount(itemCount);
  if (bulkDiscount > 0) {
    finalAmount = subtotal * (1 - bulkDiscount);
    discountRate = bulkDiscount;
  } else {
    discountRate = (subtotal - finalAmount) / subtotal;
  }

  // 화요일 할인 적용
  const tuesdayDiscount = calculateTuesdayDiscount();
  if (tuesdayDiscount > 0 && finalAmount > 0) {
    finalAmount = finalAmount * (1 - tuesdayDiscount);
    discountRate = 1 - finalAmount / subtotal;
  }

  return {
    finalAmount,
    discountRate,
    isTuesday: checkIsTuesday(),
  };
}

/**
 * 할인 정보 생성
 */
export function createDiscountInfo(itemDiscounts, itemCount) {
  const discountInfo = [];

  // 대량구매 할인 정보
  if (itemCount >= DISCOUNT_THRESHOLDS.BULK_PURCHASE) {
    discountInfo.push({
      type: 'bulk',
      name: '대량구매 할인 (30개 이상)',
      rate: DISCOUNT_RATES.BULK_PURCHASE * 100,
    });
  } else if (itemDiscounts.length > 0) {
    // 개별 상품 할인 정보
    itemDiscounts.forEach((item) => {
      discountInfo.push({
        type: 'individual',
        name: `${item.name} (10개↑)`,
        rate: item.discount,
      });
    });
  }

  // 화요일 할인 정보
  if (checkIsTuesday()) {
    discountInfo.push({
      type: 'tuesday',
      name: '화요일 추가 할인',
      rate: DISCOUNT_RATES.TUESDAY * 100,
    });
  }

  return discountInfo;
}

/**
 * 할인된 금액 계산
 */
export function calculateDiscountedAmount(originalAmount, discountRate) {
  return originalAmount * (1 - discountRate);
}

/**
 * 절약된 금액 계산
 */
export function calculateSavedAmount(originalAmount, finalAmount) {
  return originalAmount - finalAmount;
}

/**
 * 할인율 적용
 */
export function applyDiscountRate(amount, discountRate) {
  return amount * (1 - discountRate);
}

/**
 * 복합 할인율 계산
 */
export function calculateCompoundDiscountRate(discountRates) {
  if (discountRates.length === 0) return 0;

  // 복합 할인율 = 1 - (1 - 할인율1) * (1 - 할인율2) * ...
  const compoundRate = discountRates.reduce((rate, discount) => {
    return rate * (1 - discount);
  }, 1);

  return 1 - compoundRate;
}

/**
 * 할인 가능 여부 확인
 */
export function canApplyDiscount(productId, quantity) {
  if (quantity < DISCOUNT_THRESHOLDS.INDIVIDUAL_ITEM) {
    return false;
  }

  // 상품별 할인 가능 여부 확인
  const discountableProducts = [
    'p1', // 키보드
    'p2', // 마우스
    'p3', // 모니터암
    'p4', // 노트북 파우치
    'p5', // 스피커
  ];

  return discountableProducts.includes(productId);
}

/**
 * 최대 할인율 계산
 */
export function calculateMaxDiscountRate(productId, quantity, itemCount) {
  let maxDiscount = 0;

  // 개별 상품 할인
  if (quantity >= DISCOUNT_THRESHOLDS.INDIVIDUAL_ITEM) {
    const itemDiscount = calculateItemDiscount(productId, quantity, () => 0);
    maxDiscount = Math.max(maxDiscount, itemDiscount);
  }

  // 대량구매 할인
  if (itemCount >= DISCOUNT_THRESHOLDS.BULK_PURCHASE) {
    maxDiscount = Math.max(maxDiscount, DISCOUNT_RATES.BULK_PURCHASE);
  }

  return maxDiscount;
}
