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
  SUPER_SALE_RATE: 0.25, // SUPER SALE 할인율 (번개세일 + 추천할인)
} as const;

// 할인 계산 결과
export interface DiscountResult {
  subtotal: number;
  appliedDiscounts: Discount[];
  finalAmount: number;
  discountAmount: number;
}

// 할인 상태 관리
export interface DiscountState {
  lightningSale: {
    isActive: boolean;
    productId: string | null;
    startTime: number | null;
  };
  recommendation: {
    isActive: boolean;
    productId: string | null;
    startTime: number | null;
  };
}

// 개별 상품 할인 계산 (original과 동일)
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

// 전체 수량 할인 계산 (original과 동일)
export const calculateTotalBulkDiscount = (subtotal: number, totalQuantity: number): number => {
  if (totalQuantity >= DISCOUNT_POLICIES.TOTAL_BULK_THRESHOLD) {
    return subtotal * DISCOUNT_POLICIES.TOTAL_BULK_RATE;
  }
  return 0;
};

// 화요일 할인 계산 (original과 동일)
export const calculateTuesdayDiscount = (amount: number): number => {
  const today = new Date();
  if (today.getDay() === 2) {
    // 화요일 (0=일요일, 1=월요일, 2=화요일)
    return amount * DISCOUNT_POLICIES.TUESDAY_DISCOUNT_RATE;
  }
  return 0;
};

// 번개세일 할인 계산 (original과 동일)
export const calculateLightningSaleDiscount = (
  productId: string,
  price: number,
  quantity: number,
  lightningSaleProductId: string | null,
): number => {
  if (lightningSaleProductId === productId) {
    return price * quantity * DISCOUNT_POLICIES.LIGHTNING_SALE_RATE;
  }
  return 0;
};

// 추천할인 계산 (original과 동일)
export const calculateRecommendationDiscount = (
  productId: string,
  price: number,
  quantity: number,
  recommendationProductId: string | null,
): number => {
  if (recommendationProductId === productId) {
    return price * quantity * DISCOUNT_POLICIES.RECOMMENDATION_RATE;
  }
  return 0;
};

// 할인 적용 순서 및 최종 계산 (original과 동일한 순서)
export const calculateFinalDiscount = (
  subtotal: number,
  totalQuantity: number,
  individualDiscounts: number[],
  lightningSaleDiscount: number = 0,
  recommendationDiscount: number = 0,
): DiscountResult => {
  // 1. 개별 상품 할인 계산
  const individualDiscountTotal = individualDiscounts.reduce((sum, discount) => sum + discount, 0);
  let currentAmount = subtotal - individualDiscountTotal;

  // 2. 전체 수량 할인 계산 (30개 이상)
  if (totalQuantity >= DISCOUNT_POLICIES.TOTAL_BULK_THRESHOLD) {
    currentAmount = subtotal * (1 - DISCOUNT_POLICIES.TOTAL_BULK_RATE);
  }

  // 3. 번개세일과 추천할인 계산
  let specialDiscount = 0;
  const hasLightningSale = lightningSaleDiscount > 0;
  const hasRecommendation = recommendationDiscount > 0;

  if (hasLightningSale && hasRecommendation) {
    // SUPER SALE: 25% 할인
    specialDiscount = Math.max(lightningSaleDiscount, recommendationDiscount) * 1.25;
  } else {
    specialDiscount = lightningSaleDiscount + recommendationDiscount;
  }

  currentAmount -= specialDiscount;

  // 4. 화요일 할인 계산 (마지막에 적용)
  const tuesdayDiscount = calculateTuesdayDiscount(currentAmount);
  currentAmount -= tuesdayDiscount;

  const finalAmount = currentAmount;
  const totalDiscount = subtotal - finalAmount;

  return {
    subtotal,
    appliedDiscounts: [], // 실제 할인 객체는 별도로 관리
    finalAmount,
    discountAmount: totalDiscount,
  };
};

// 할인 아이콘 및 스타일 가져오기 (original과 동일)
export const getDiscountStyle = (
  productId: string,
  lightningSaleProductId: string | null,
  recommendationProductId: string | null,
): { icon: string; className: string } => {
  const hasLightningSale = lightningSaleProductId === productId;
  const hasRecommendation = recommendationProductId === productId;
  const isSuperSale = hasLightningSale && hasRecommendation;

  if (isSuperSale) {
    return {
      icon: '⚡💝',
      className: 'text-purple-600 font-bold',
    };
  } else if (hasLightningSale) {
    return {
      icon: '⚡',
      className: 'text-red-500 font-bold',
    };
  } else if (hasRecommendation) {
    return {
      icon: '💝',
      className: 'text-blue-500 font-bold',
    };
  }

  return {
    icon: '',
    className: '',
  };
};
