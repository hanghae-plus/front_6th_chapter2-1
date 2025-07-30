import type { Cart, CartItem } from '../types/cart';
import {
  calculateIndividualDiscounts,
  calculateBulkDiscount,
  calculateTuesdayDiscount,
  selectBestDiscount,
} from './discountUtils';

// 기본 금액 계산
function calculateBasicAmounts(items: CartItem[]) {
  const originalAmount = items.reduce(
    (sum, item) => sum + item.originalPrice * item.quantity,
    0
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return { originalAmount, itemCount };
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