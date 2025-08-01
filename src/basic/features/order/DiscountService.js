import {
  QUANTITY_THRESHOLDS,
  DISCOUNT_RATES,
  TUESDAY,
  KEYBOARD_ID,
  MOUSE_ID,
  MONITOR_ID,
  HEADPHONE_ID,
  SPEAKER_ID,
} from '../../shared/constants/index.js';

// ==================== 할인 규칙 ====================

/**
 * 개별 상품 할인율 조회
 * @param {string} productId - 상품 ID
 * @param {number} quantity - 수량
 * @returns {number} 할인율 (0~1)
 */
export function getProductDiscount(productId, quantity) {
  if (quantity < QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT) {
    return 0;
  }

  const discountRates = {
    [KEYBOARD_ID]: DISCOUNT_RATES.PRODUCT.KEYBOARD,
    [MOUSE_ID]: DISCOUNT_RATES.PRODUCT.MOUSE,
    [MONITOR_ID]: DISCOUNT_RATES.PRODUCT.MONITOR_ARM,
    [HEADPHONE_ID]: DISCOUNT_RATES.PRODUCT.LAPTOP_POUCH,
    [SPEAKER_ID]: DISCOUNT_RATES.PRODUCT.SPEAKER,
  };

  return discountRates[productId] || 0;
}

/**
 * 대량구매 & 화요일 할인
 * @param {number} subtotal - 개별 할인 적용 전 소계
 * @param {number} discountedTotal - 개별 할인 적용 후 금액
 * @param {number} totalQuantity - 총 수량
 * @returns {Object} { finalAmount, totalDiscountRate, isTuesdayToday }
 */
export function applyBulkDiscounts(subtotal, discountedTotal, totalQuantity) {
  let finalAmount;
  let additionalDiscountRate = 0;

  // 대량구매 할인 (30개 이상) - 개별 할인 무시하고 25% 적용
  if (totalQuantity >= QUANTITY_THRESHOLDS.BONUS_LARGE) {
    additionalDiscountRate = DISCOUNT_RATES.BULK;
    finalAmount = subtotal * (1 - additionalDiscountRate); // 원본 금액에서 할인
  } else {
    finalAmount = discountedTotal; // 개별 할인 적용된 금액 사용
  }

  // 화요일 추가 할인
  const today = new Date();
  const isTuesdayToday = today.getDay() === TUESDAY;
  if (isTuesdayToday) {
    const tuesdayDiscountRate = DISCOUNT_RATES.TUESDAY;
    finalAmount = finalAmount * (1 - tuesdayDiscountRate);
    additionalDiscountRate += tuesdayDiscountRate;
  }

  // 전체 할인율 계산
  const totalDiscountRate =
    subtotal > 0 ? (subtotal - finalAmount) / subtotal : 0;

  return {
    finalAmount,
    totalDiscountRate,
    isTuesdayToday,
  };
}

/**
 * 특정 상품의 할인 적용된 가격 계산
 * @param {Object} product - 상품 객체
 * @param {number} quantity - 수량
 * @returns {number} 할인 적용된 가격
 */
export function calculateDiscountedPrice(product, quantity) {
  const discountRate = getProductDiscount(product.id, quantity);
  return product.price * (1 - discountRate);
}

/**
 * 전체 할인 정보 요약
 * @param {number} originalAmount - 원래 금액
 * @param {number} finalAmount - 최종 금액
 * @returns {Object} 할인 요약 정보
 */
export function getDiscountSummary(originalAmount, finalAmount) {
  const discountAmount = originalAmount - finalAmount;
  const discountRate = originalAmount > 0 ? discountAmount / originalAmount : 0;

  return {
    originalAmount,
    finalAmount,
    discountAmount,
    discountRate,
    discountPercent: discountRate * 100,
  };
}
