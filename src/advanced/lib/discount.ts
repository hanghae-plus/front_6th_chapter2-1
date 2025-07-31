// 할인 타입 정의
export interface Discount {
  id: string;
  name: string;
  rate: number;
  description: string;
  icon?: string;
}

// 할인 정책 상수
export const DISCOUNT_POLICIES = {
  BULK_THRESHOLD: 10, // 개별 상품 할인 기준 수량
  TOTAL_BULK_THRESHOLD: 30, // 전체 수량 할인 기준
  TUESDAY_DISCOUNT_RATE: 0.1, // 화요일 할인율
  LIGHTNING_SALE_RATE: 0.2, // 번개세일 할인율
  RECOMMENDATION_RATE: 0.05, // 추천할인 할인율
  TOTAL_BULK_RATE: 0.25, // 전체 수량 할인율
} as const;

// 할인 계산 결과
export interface DiscountResult {
  subtotal: number;
  appliedDiscounts: Discount[];
  finalAmount: number;
  discountAmount: number;
}

// 개별 상품 할인 계산
export const calculateIndividualDiscount = (
  price: number,
  quantity: number,
  discountRate: number,
): number => {
  if (quantity >= DISCOUNT_POLICIES.BULK_THRESHOLD) {
    return price * quantity * discountRate;
  }
  return 0;
};

// 전체 수량 할인 계산
export const calculateTotalBulkDiscount = (subtotal: number, totalQuantity: number): number => {
  if (totalQuantity >= DISCOUNT_POLICIES.TOTAL_BULK_THRESHOLD) {
    return subtotal * DISCOUNT_POLICIES.TOTAL_BULK_RATE;
  }
  return 0;
};

// 화요일 할인 계산
export const calculateTuesdayDiscount = (amount: number): number => {
  const today = new Date();
  if (today.getDay() === 2) {
    // 화요일 (0=일요일, 1=월요일, 2=화요일)
    return amount * DISCOUNT_POLICIES.TUESDAY_DISCOUNT_RATE;
  }
  return 0;
};

// 할인 적용 순서 및 최종 계산
export const calculateFinalDiscount = (
  subtotal: number,
  totalQuantity: number,
  individualDiscounts: number[],
  lightningSaleDiscount: number = 0,
  recommendationDiscount: number = 0,
): DiscountResult => {
  const individualDiscountTotal = individualDiscounts.reduce((sum, discount) => sum + discount, 0);

  // 개별 할인 적용 후 금액
  const afterIndividualDiscount = subtotal - individualDiscountTotal;

  // 전체 수량 할인 계산 (개별 할인과 중복 불가)
  const totalBulkDiscount = calculateTotalBulkDiscount(afterIndividualDiscount, totalQuantity);

  // 번개세일과 추천할인은 중복 가능 (최대 25%)
  const specialDiscount = Math.min(
    lightningSaleDiscount + recommendationDiscount,
    afterIndividualDiscount * 0.25,
  );

  // 화요일 할인은 모든 할인과 중복 가능
  const tuesdayDiscount = calculateTuesdayDiscount(
    afterIndividualDiscount - totalBulkDiscount - specialDiscount,
  );

  const finalAmount =
    afterIndividualDiscount - totalBulkDiscount - specialDiscount - tuesdayDiscount;
  const totalDiscount =
    individualDiscountTotal + totalBulkDiscount + specialDiscount + tuesdayDiscount;

  return {
    subtotal,
    appliedDiscounts: [], // 실제 할인 객체는 별도로 관리
    finalAmount,
    discountAmount: totalDiscount,
  };
};
