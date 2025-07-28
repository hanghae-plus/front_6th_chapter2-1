/**
 * 할인 정책 상수 정의
 * 모든 할인 관련 정책을 중앙집중적으로 관리합니다.
 */

import { getProductById } from './Products.js';

/**
 * @typedef {Object} SpecialDiscount
 * @property {number} rate - 할인율 (0.1 = 10%)
 * @property {number} [threshold] - 적용 임계값
 * @property {string} [description] - 할인 설명
 */

/**
 * 특별 할인 정책 상수
 */
export const SPECIAL_DISCOUNTS = {
  BULK_PURCHASE: {
    threshold: 30,
    rate: 0.25,
    description: '대량구매 할인 (30개 이상)',
  },
  TUESDAY_SPECIAL: {
    rate: 0.1,
    description: '화요일 추가 할인',
  },
  FLASH_SALE: {
    rate: 0.2,
    description: '번개세일',
  },
  RECOMMENDATION: {
    rate: 0.05,
    description: '추천할인',
  },
};

/**
 * 할인 적용 규칙 상수
 */
export const DISCOUNT_RULES = {
  BULK_OVERRIDES_INDIVIDUAL: true, // 대량구매 할인이 개별 할인을 덮어씀
  MIN_QUANTITY_FOR_INDIVIDUAL_DISCOUNT: 10, // 개별 상품 할인 최소 수량
  TUESDAY_APPLIES_AFTER_OTHER_DISCOUNTS: true, // 화요일 할인은 다른 할인 후에 적용
};

/**
 * 개별 상품의 할인율을 가져옵니다
 * @param {string} productId - 상품 ID
 * @returns {number} 할인율 (0.1 = 10%)
 */
export function getProductDiscountRate(productId) {
  const product = getProductById(productId);
  return product ? product.discountRate : 0;
}

/**
 * 수량에 따른 개별 상품 할인율을 계산합니다
 * @param {string} productId - 상품 ID
 * @param {number} quantity - 구매 수량
 * @returns {number} 적용 가능한 할인율
 */
export function calculateIndividualDiscount(productId, quantity) {
  if (quantity < DISCOUNT_RULES.MIN_QUANTITY_FOR_INDIVIDUAL_DISCOUNT) {
    return 0;
  }
  return getProductDiscountRate(productId);
}

/**
 * 전체 수량에 따른 대량구매 할인율을 계산합니다
 * @param {number} totalQuantity - 전체 구매 수량
 * @returns {number} 대량구매 할인율
 */
export function calculateBulkDiscount(totalQuantity) {
  if (totalQuantity >= SPECIAL_DISCOUNTS.BULK_PURCHASE.threshold) {
    return SPECIAL_DISCOUNTS.BULK_PURCHASE.rate;
  }
  return 0;
}

/**
 * 화요일 특별 할인율을 반환합니다
 * @param {Date} [date] - 확인할 날짜 (기본값: 현재 날짜)
 * @returns {number} 화요일 할인율
 */
export function calculateTuesdayDiscount(date = new Date()) {
  const isTuesday = date.getDay() === 2;
  return isTuesday ? SPECIAL_DISCOUNTS.TUESDAY_SPECIAL.rate : 0;
}

/**
 * 최종 할인율을 계산합니다 (할인 규칙 적용)
 * @param {Object} params - 할인 계산 파라미터
 * @param {string} params.productId - 상품 ID
 * @param {number} params.quantity - 개별 상품 수량
 * @param {number} params.totalQuantity - 전체 구매 수량
 * @param {Date} [params.date] - 확인할 날짜
 * @returns {Object} 할인 정보 { rate: number, type: string, description: string }
 */
export function calculateFinalDiscount({ productId, quantity, totalQuantity, date = new Date() }) {
  const bulkDiscount = calculateBulkDiscount(totalQuantity);
  const individualDiscount = calculateIndividualDiscount(productId, quantity);
  const tuesdayDiscount = calculateTuesdayDiscount(date);

  // 대량구매 할인이 개별 할인을 덮어씀
  let baseDiscount;
  let discountType;
  let description;

  if (bulkDiscount > 0 && DISCOUNT_RULES.BULK_OVERRIDES_INDIVIDUAL) {
    baseDiscount = bulkDiscount;
    discountType = 'bulk';
    description = SPECIAL_DISCOUNTS.BULK_PURCHASE.description;
  } else if (individualDiscount > 0) {
    baseDiscount = individualDiscount;
    discountType = 'individual';
    const product = getProductById(productId);
    description = `${product?.name} 개별 할인`;
  } else {
    baseDiscount = 0;
    discountType = 'none';
    description = '';
  }

  // 화요일 할인은 다른 할인 후에 적용
  let finalRate = baseDiscount;
  let finalDescription = description;

  if (tuesdayDiscount > 0 && DISCOUNT_RULES.TUESDAY_APPLIES_AFTER_OTHER_DISCOUNTS) {
    if (baseDiscount > 0) {
      // 기존 할인이 있으면 화요일 할인은 할인된 가격에 추가 적용
      finalRate = baseDiscount + (1 - baseDiscount) * tuesdayDiscount;
      finalDescription = `${description} + ${SPECIAL_DISCOUNTS.TUESDAY_SPECIAL.description}`;
    } else {
      // 기존 할인이 없으면 화요일 할인만 적용
      finalRate = tuesdayDiscount;
      finalDescription = SPECIAL_DISCOUNTS.TUESDAY_SPECIAL.description;
    }
    discountType = baseDiscount > 0 ? `${discountType}+tuesday` : 'tuesday';
  }

  return {
    rate: finalRate,
    type: discountType,
    description: finalDescription,
    baseDiscount,
    tuesdayDiscount,
    isBulkOverride: bulkDiscount > 0 && individualDiscount > 0,
  };
}

/**
 * 할인 정보를 UI 표시용 객체로 변환합니다
 * @param {Object} discountInfo - calculateFinalDiscount의 반환값
 * @returns {Object} UI 표시용 할인 정보
 */
export function formatDiscountForUI(discountInfo) {
  return {
    percentage: Math.round(discountInfo.rate * 100),
    displayText: discountInfo.description,
    type: discountInfo.type,
    isSpecial: discountInfo.tuesdayDiscount > 0,
  };
}
