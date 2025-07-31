import type { Cart, CartItem } from '../types/cart';
import {
  calculateIndividualDiscounts,
  calculateBulkDiscount,
  calculateTuesdayDiscount,
  selectBestDiscount,
} from './discountUtils';
import { calculateLoyaltyPoints } from './pointUtils';

// 기본 금액 계산
function calculateBasicAmounts(items: CartItem[]) {
  // Subtotal: 현재 가격 (번개세일 포함) × 수량
  const originalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  // 실제 원가: 할인율 계산용
  const realOriginalAmount = items.reduce(
    (sum, item) => sum + item.originalPrice * item.quantity,
    0
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { originalAmount, realOriginalAmount, itemCount };
}

// 메인 계산 함수
export function calculateCartTotals(
  items: CartItem[]
): Pick<
  Cart,
  | 'totalAmount'
  | 'originalAmount'
  | 'realOriginalAmount'
  | 'discountAmount'
  | 'itemCount'
  | 'appliedDiscounts'
  | 'loyaltyPoints'
  | 'pointsBreakdown'
> {
  // 기본 금액 계산
  const {
    originalAmount: cartOriginalAmount,
    realOriginalAmount: cartRealOriginalAmount,
    itemCount: cartItemCount,
  } = calculateBasicAmounts(items);

  // 할인 옵션들 계산
  const individualDiscountResult = calculateIndividualDiscounts(items);
  const bulkDiscountResult = calculateBulkDiscount(
    cartOriginalAmount,
    cartItemCount
  );

  // 더 유리한 기본 할인 선택
  const selectedBaseDiscount = selectBestDiscount(
    individualDiscountResult,
    bulkDiscountResult
  );

  // 화요일 특가 추가 계산 (기본 할인 적용 후 금액에서)
  const amountAfterBaseDiscount =
    cartOriginalAmount - selectedBaseDiscount.amount;
  const tuesdayDiscountResult = calculateTuesdayDiscount(
    amountAfterBaseDiscount
  );

  // 수량 관련 할인 정보 (할인율 표시용)
  const quantityDiscountAmount =
    selectedBaseDiscount.amount + tuesdayDiscountResult.discountAmount;
  const finalAppliedDiscounts = [
    ...selectedBaseDiscount.descriptions,
    ...(tuesdayDiscountResult.applied ? ['화요일 특가 10% 추가 할인'] : []),
  ];

  const finalTotalAmount = cartOriginalAmount - quantityDiscountAmount;

  // 포인트 계산 (최종 결제 금액 기준)
  const { loyaltyPoints, pointsBreakdown } = calculateLoyaltyPoints(
    items,
    finalTotalAmount
  );

  return {
    totalAmount: Math.max(0, finalTotalAmount),
    originalAmount: cartOriginalAmount,
    realOriginalAmount: cartRealOriginalAmount,
    discountAmount: quantityDiscountAmount, // 수량 관련 할인만
    itemCount: cartItemCount,
    appliedDiscounts: finalAppliedDiscounts,
    loyaltyPoints,
    pointsBreakdown,
  };
}

// 장바구니 총 아이템 개수 계산
export function getTotalCartItems(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}
