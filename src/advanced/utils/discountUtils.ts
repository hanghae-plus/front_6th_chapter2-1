import { CartItem, DiscountInfo } from '../types/index.js';
import { DISCOUNT_POLICY, PRODUCT_DISCOUNT_RATE } from '../constants/index.js';
import { isTuesday } from './dateUtils.js';

// ============== 할인 계산 관련 유틸리티 함수들 ==============

// 대량구매 할인 확인
export const checkBulkDiscount = (totalItemCount: number): { 
  hasDiscount: boolean; 
  rate: number; 
  description: string 
} => {
  if (totalItemCount >= DISCOUNT_POLICY.BULK_PURCHASE_THRESHOLD) {
    return {
      hasDiscount: true,
      rate: DISCOUNT_POLICY.BULK_PURCHASE_RATE,
      description: `대량구매 할인 (${totalItemCount}개)`
    };
  }
  return { hasDiscount: false, rate: 0, description: '' };
};

// 개별 상품 할인 확인
export const checkIndividualDiscount = (items: CartItem[]): { 
  hasDiscount: boolean; 
  rate: number; 
  description: string 
} => {
  let maxIndividualDiscount = 0;
  let discountedProduct = '';

  items.forEach(item => {
    if (item.quantity >= DISCOUNT_POLICY.INDIVIDUAL_DISCOUNT_THRESHOLD) {
      const productDiscountRate = PRODUCT_DISCOUNT_RATE[item.id] || 0;
      if (productDiscountRate > maxIndividualDiscount) {
        maxIndividualDiscount = productDiscountRate;
        discountedProduct = item.name;
      }
    }
  });

  if (maxIndividualDiscount > 0) {
    return {
      hasDiscount: true,
      rate: maxIndividualDiscount,
      description: `개별 상품 할인: ${discountedProduct}`
    };
  }

  return { hasDiscount: false, rate: 0, description: '' };
};

// 화요일 할인 적용
export const applyTuesdayDiscount = (
  baseRate: number, 
  baseDescription: string
): { rate: number; description: string } => {
  if (!isTuesday()) {
    return { rate: baseRate, description: baseDescription };
  }

  if (baseRate > 0) {
    // 화요일 할인은 기존 할인과 중복 적용
    // 예: 10% 할인 -> 10% 화요일 할인 = 19% (1 - 0.9 * 0.9 = 0.19)
    const finalRate = 1 - (1 - baseRate) * (1 - DISCOUNT_POLICY.TUESDAY_DISCOUNT_RATE);
    return {
      rate: finalRate,
      description: `${baseDescription} + 화요일 할인`
    };
  } else {
    // 다른 할인이 없는 경우 화요일 할인만 적용
    return {
      rate: DISCOUNT_POLICY.TUESDAY_DISCOUNT_RATE,
      description: '화요일 할인'
    };
  }
};

// 할인 정보 생성
export const createDiscountInfo = (
  items: CartItem[],
  totalItemCount: number
): DiscountInfo | null => {
  // 대량구매 할인 확인
  const bulkDiscount = checkBulkDiscount(totalItemCount);
  
  let discountRate = 0;
  let discountType: DiscountInfo['type'] = 'individual';
  let description = '';

  if (bulkDiscount.hasDiscount) {
    discountRate = bulkDiscount.rate;
    discountType = 'bulk';
    description = bulkDiscount.description;
  } else {
    // 개별 상품 할인 확인
    const individualDiscount = checkIndividualDiscount(items);
    if (individualDiscount.hasDiscount) {
      discountRate = individualDiscount.rate;
      discountType = 'individual';
      description = individualDiscount.description;
    }
  }

  // 화요일 할인 적용
  const tuesdayResult = applyTuesdayDiscount(discountRate, description);
  discountRate = tuesdayResult.rate;
  description = tuesdayResult.description;

  if (discountRate === 0) {
    return null;
  }

  // 할인 금액 계산
  const subtotal = items.reduce((acc, item) => 
    acc + (item.originalPrice * item.quantity), 0
  );
  const discountAmount = Math.round(subtotal * discountRate);

  return {
    rate: discountRate,
    amount: discountAmount,
    type: discountType,
    description,
  };
}; 