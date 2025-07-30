import type { Cart, CartItem } from '../types/cart';
import { QUANTITY_THRESHOLDS, DISCOUNT_RATES } from '../constants/shopPolicy';

// productId와 상수 키 매핑
const PRODUCT_ID_TO_DISCOUNT_KEY = {
  p1: 'KEYBOARD',
  p2: 'MOUSE',
  p3: 'MONITOR_ARM',
  p4: 'LAPTOP_POUCH',
  p5: 'SPEAKER',
} as const;

// 개별 상품 할인 계산
function calculateIndividualDiscounts(items: CartItem[]) {
  let totalDiscountAmount = 0;
  const discountedItemNames: string[] = [];

  items.forEach((item) => {
    const isEligibleForDiscount = item.quantity >= QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT;
    if (!isEligibleForDiscount) return;

    const discountKey = PRODUCT_ID_TO_DISCOUNT_KEY[item.id as keyof typeof PRODUCT_ID_TO_DISCOUNT_KEY];
    if (!discountKey) return;

    const discountRate = DISCOUNT_RATES.PRODUCT[discountKey as keyof typeof DISCOUNT_RATES.PRODUCT];
    if (!discountRate) return;

    const itemOriginalTotal = item.originalPrice * item.quantity;
    const itemDiscountAmount = itemOriginalTotal * discountRate;
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
function calculateBulkDiscount(originalAmount: number, itemCount: number) {
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
function calculateTuesdayDiscount(amount: number) {
  const isTuesday = new Date().getDay() === 2;
  
  if (isTuesday) {
    return {
      discountAmount: amount * DISCOUNT_RATES.TUESDAY,
      applied: true,
    };
  }
  
  return { discountAmount: 0, applied: false };
}

// 기본 금액 계산
function calculateBasicAmounts(items: CartItem[]) {
  const originalAmount = items.reduce(
    (sum, item) => sum + item.originalPrice * item.quantity,
    0
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return { originalAmount, itemCount };
}

// 더 유리한 할인 선택
function selectBestDiscount(individualResult: ReturnType<typeof calculateIndividualDiscounts>, bulkResult: ReturnType<typeof calculateBulkDiscount>) {
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

// 메인 계산 함수
export function calculateCartTotals(
  items: CartItem[]
): Pick<Cart, 'totalAmount' | 'originalAmount' | 'discountAmount' | 'itemCount' | 'appliedDiscounts'> {
  // 기본 금액 계산
  const { originalAmount: cartOriginalAmount, itemCount: cartItemCount } = calculateBasicAmounts(items);

  // 할인 옵션들 계산
  const individualDiscountResult = calculateIndividualDiscounts(items);
  const bulkDiscountResult = calculateBulkDiscount(cartOriginalAmount, cartItemCount);

  // 더 유리한 기본 할인 선택
  const selectedBaseDiscount = selectBestDiscount(individualDiscountResult, bulkDiscountResult);

  // 화요일 특가 추가 계산 (기본 할인 적용 후 금액에서)
  const amountAfterBaseDiscount = cartOriginalAmount - selectedBaseDiscount.amount;
  const tuesdayDiscountResult = calculateTuesdayDiscount(amountAfterBaseDiscount);

  // 최종 할인 정보 조합
  const finalDiscountAmount = selectedBaseDiscount.amount + tuesdayDiscountResult.discountAmount;
  const finalAppliedDiscounts = [
    ...selectedBaseDiscount.descriptions,
    ...(tuesdayDiscountResult.applied ? ['화요일 특가 10% 추가 할인'] : [])
  ];

  const finalTotalAmount = cartOriginalAmount - finalDiscountAmount;

  return {
    totalAmount: Math.max(0, finalTotalAmount),
    originalAmount: cartOriginalAmount,
    discountAmount: finalDiscountAmount,
    itemCount: cartItemCount,
    appliedDiscounts: finalAppliedDiscounts,
  };
}