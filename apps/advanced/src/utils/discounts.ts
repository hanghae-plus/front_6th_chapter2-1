/**
 * 할인 관련 계산 유틸리티 함수 - 선언형 접근
 */

import {
  DISCOUNT_RULES,
  SPECIAL_DISCOUNTS,
} from "../constants/discountPolicies";
import { getProductById } from "../constants/products";
import {
  DiscountInfo,
  DiscountPolicy,
  DiscountUIInfo,
} from "../types/promotion.types";

/**
 * 개별 상품의 할인율을 가져옵니다
 * @param productId - 상품 ID
 * @returns 할인율 (0.1 = 10%)
 */
export const getProductDiscountRate = (productId: string): number =>
  getProductById(productId)?.discountRate || 0;

/**
 * 수량에 따른 개별 상품 할인율을 계산합니다
 * @param productId - 상품 ID
 * @param quantity - 구매 수량
 * @returns 적용 가능한 할인율
 */
export const calculateIndividualDiscount = (
  productId: string,
  quantity: number,
): number =>
  quantity < DISCOUNT_RULES.minQuantityForIndividualDiscount
    ? 0
    : getProductDiscountRate(productId);

/**
 * 전체 수량에 따른 대량구매 할인율을 계산합니다
 * @param totalQuantity - 전체 구매 수량
 * @returns 대량구매 할인율
 */
export const calculateBulkDiscount = (totalQuantity: number): number =>
  totalQuantity >= (SPECIAL_DISCOUNTS.BULK_PURCHASE.threshold || 0)
    ? SPECIAL_DISCOUNTS.BULK_PURCHASE.rate
    : 0;

/**
 * 화요일 특별 할인율을 반환합니다
 * @param date - 확인할 날짜 (기본값: 현재 날짜)
 * @returns 화요일 할인율
 */
export const calculateTuesdayDiscount = (date: Date = new Date()): number =>
  date.getDay() === 2 ? SPECIAL_DISCOUNTS.TUESDAY_SPECIAL.rate : 0;

/**
 * 할인 타입과 설명을 결정합니다 - 선언형 접근
 */
const determineDiscountType = (
  bulkDiscount: number,
  individualDiscount: number,
  productId: string,
) => {
  if (bulkDiscount > 0 && DISCOUNT_RULES.bulkOverridesIndividual) {
    return {
      baseDiscount: bulkDiscount,
      type: "bulk",
      description: SPECIAL_DISCOUNTS.BULK_PURCHASE.description,
    };
  }

  if (individualDiscount > 0) {
    const product = getProductById(productId);
    return {
      baseDiscount: individualDiscount,
      type: "individual",
      description: `${product?.name} 개별 할인`,
    };
  }

  return {
    baseDiscount: 0,
    type: "none",
    description: "",
  };
};

/**
 * 화요일 할인을 적용합니다 - 선언형 접근
 */
const applyTuesdayDiscount = (
  baseDiscount: number,
  tuesdayDiscount: number,
  description: string,
  discountType: string,
) => {
  if (
    tuesdayDiscount <= 0 ||
    !DISCOUNT_RULES.tuesdayAppliesAfterOtherDiscounts
  ) {
    return {
      finalRate: baseDiscount,
      finalDescription: description,
      discountType,
    };
  }

  if (baseDiscount > 0) {
    return {
      finalRate: baseDiscount + (1 - baseDiscount) * tuesdayDiscount,
      finalDescription: `${description} + ${SPECIAL_DISCOUNTS.TUESDAY_SPECIAL.description}`,
      discountType: `${discountType}+tuesday`,
    };
  }

  return {
    finalRate: tuesdayDiscount,
    finalDescription: SPECIAL_DISCOUNTS.TUESDAY_SPECIAL.description,
    discountType: "tuesday",
  };
};

/**
 * 최종 할인율을 계산합니다 (할인 규칙 적용) - 선언형 접근
 * @param params - 할인 계산 파라미터
 * @returns 할인 정보
 */
export const calculateFinalDiscount = ({
  productId,
  quantity,
  totalQuantity,
  date = new Date(),
}: {
  productId: string;
  quantity: number;
  totalQuantity: number;
  date?: Date;
}): DiscountInfo => {
  const bulkDiscount = calculateBulkDiscount(totalQuantity);
  const individualDiscount = calculateIndividualDiscount(productId, quantity);
  const tuesdayDiscount = calculateTuesdayDiscount(date);

  const {
    baseDiscount,
    type: discountType,
    description,
  } = determineDiscountType(bulkDiscount, individualDiscount, productId);

  const {
    finalRate,
    finalDescription,
    discountType: finalType,
  } = applyTuesdayDiscount(
    baseDiscount,
    tuesdayDiscount,
    description,
    discountType,
  );

  return {
    rate: finalRate,
    type: finalType,
    description: finalDescription,
    baseDiscount,
    tuesdayDiscount,
    isBulkOverride: bulkDiscount > 0 && individualDiscount > 0,
    isSpecial: tuesdayDiscount > 0,
  };
};

/**
 * 할인 정보를 UI 표시용 객체로 변환합니다 - 선언형 접근
 * @param discountInfo - calculateFinalDiscount의 반환값
 * @returns UI 표시용 할인 정보
 */
export const formatDiscountForUI = (
  discountInfo: DiscountInfo,
): DiscountUIInfo => ({
  percentage: Math.round(discountInfo.rate * 100),
  displayText: discountInfo.description,
  type: discountInfo.type,
  isSpecial: discountInfo.tuesdayDiscount > 0,
});

/**
 * 정책별 할인을 계산합니다 - 선언형 접근
 */
const calculatePolicyDiscount = (
  totalAmount: number,
  policy: DiscountPolicy,
): number => {
  if (totalAmount < (policy.minAmount || 0)) return 0;

  const discount =
    policy.type === "percentage"
      ? totalAmount * (policy.value / 100)
      : policy.value;

  return policy.maxDiscount ? Math.min(discount, policy.maxDiscount) : discount;
};

/**
 * 총 할인 금액을 계산합니다 - 선언형 접근
 * @param totalAmount - 총 구매 금액
 * @param policies - 할인 정책 배열
 * @returns 총 할인 금액
 */
export const calculateTotalDiscount = (
  totalAmount: number,
  policies: DiscountPolicy[],
): number =>
  policies.reduce(
    (total, policy) => total + calculatePolicyDiscount(totalAmount, policy),
    0,
  );
