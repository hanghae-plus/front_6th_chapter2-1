import type { CartItem } from '../types/cart';
import { QUANTITY_THRESHOLDS, DISCOUNT_RATES, PRODUCT_ID_TO_DISCOUNT_KEY } from '../constants/shopPolicy';

// 개별 상품 할인 계산
export function calculateIndividualDiscounts(items: CartItem[]) {
  let totalDiscountAmount = 0;
  const discountedItemNames: string[] = [];

  items.forEach((item) => {
    const isEligibleForDiscount = item.quantity >= QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT;
    if (!isEligibleForDiscount) return;

    const discountKey = PRODUCT_ID_TO_DISCOUNT_KEY[item.id as keyof typeof PRODUCT_ID_TO_DISCOUNT_KEY];
    if (!discountKey) return;

    const discountRate = DISCOUNT_RATES.PRODUCT[discountKey as keyof typeof DISCOUNT_RATES.PRODUCT];
    if (!discountRate) return;

    const itemCurrentTotal = item.price * item.quantity;
    const itemDiscountAmount = itemCurrentTotal * discountRate;
    const discountPercentage = Math.round(discountRate * 100);

    totalDiscountAmount += itemDiscountAmount;
    discountedItemNames.push(`${item.name} ${discountPercentage}% 할인`);
  });

  return { 
    discountAmount: totalDiscountAmount, 
    discountedItems: discountedItemNames 
  };
}

// 대량 구매 할인 계산
export function calculateBulkDiscount(originalAmount: number, itemCount: number) {
  const isEligibleForBulkDiscount = itemCount >= QUANTITY_THRESHOLDS.BONUS_LARGE;
  
  if (isEligibleForBulkDiscount) {
    return {
      discountAmount: originalAmount * DISCOUNT_RATES.BULK,
      applied: true,
    };
  }
  
  return { discountAmount: 0, applied: false };
}

// 화요일 특가 계산
export function calculateTuesdayDiscount(amount: number) {
  const isTuesday = new Date().getDay() === 2;
  
  if (isTuesday) {
    return {
      discountAmount: amount * DISCOUNT_RATES.TUESDAY,
      applied: true,
    };
  }
  
  return { discountAmount: 0, applied: false };
}

// 더 유리한 할인 선택
export function selectBestDiscount(
  individualResult: ReturnType<typeof calculateIndividualDiscounts>, 
  bulkResult: ReturnType<typeof calculateBulkDiscount>
) {
  const isBulkDiscountBetter = 
    bulkResult.applied && 
    bulkResult.discountAmount > individualResult.discountAmount;

  if (isBulkDiscountBetter) {
    return { 
      amount: bulkResult.discountAmount, 
      descriptions: ['대량 구매 25% 할인'] 
    };
  }
  
  return { 
    amount: individualResult.discountAmount, 
    descriptions: individualResult.discountedItems 
  };
}