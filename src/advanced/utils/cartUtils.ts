import { CartItem, DiscountInfo } from '../types/index.js';
import { CART_CONSTANTS, DAYS_OF_WEEK } from '../constants/index.js';

// ============== 장바구니 관련 유틸리티 함수들 ==============

// 화요일인지 확인
export const isTuesday = (): boolean => {
  return new Date().getDay() === DAYS_OF_WEEK.TUESDAY;
};

// 개별 상품 할인 계산
export const calculateIndividualDiscount = (item: CartItem): number => {
  if (item.quantity < CART_CONSTANTS.INDIVIDUAL_DISCOUNT_THRESHOLD) {
    return 0;
  }
  
  const discountRate = CART_CONSTANTS.INDIVIDUAL_DISCOUNT_RATES[item.id as keyof typeof CART_CONSTANTS.INDIVIDUAL_DISCOUNT_RATES];
  return discountRate || 0;
};

// 개별 상품별 총액 계산 (할인 적용)
export const calculateItemTotal = (item: CartItem): number => {
  const currentPrice = item.price; // 번개세일/추천할인이 적용된 현재 가격
  const itemTotal = currentPrice * item.quantity;
  const discount = calculateIndividualDiscount(item);
  
  return itemTotal * (1 - discount);
};

// 대량구매 할인 적용 여부 확인
export const shouldApplyBulkDiscount = (totalItemCount: number): boolean => {
  return totalItemCount >= CART_CONSTANTS.BULK_PURCHASE_THRESHOLD;
};

// 대량구매 할인 적용된 총액 계산
export const calculateBulkDiscountTotal = (cartItems: CartItem[]): number => {
  const currentSubtotal = cartItems.reduce((acc, item) => 
    acc + (item.price * item.quantity), 0
  );
  
  return currentSubtotal * (1 - CART_CONSTANTS.BULK_PURCHASE_DISCOUNT_RATE);
};

// 화요일 할인 적용
export const applyTuesdayDiscount = (totalAmount: number): number => {
  if (!isTuesday() || totalAmount <= 0) {
    return totalAmount;
  }
  
  return totalAmount * (1 - CART_CONSTANTS.TUESDAY_DISCOUNT_RATE);
};

// 할인 정보 생성
export const createDiscountInfo = (
  subtotal: number,
  totalAmount: number,
  totalItemCount: number
): DiscountInfo | null => {
  if (subtotal <= totalAmount) {
    return null;
  }
  
  const discountAmount = subtotal - totalAmount;
  const discountRate = discountAmount / subtotal;
  
  const discountTypes: string[] = [];
  
  // 할인 타입별 메시지 추가
  if (shouldApplyBulkDiscount(totalItemCount)) {
    discountTypes.push(CART_CONSTANTS.DISCOUNT_MESSAGES.BULK_PURCHASE);
  } else if (totalItemCount > 0) {
    // 개별 할인이 적용되었는지 확인 (간단한 체크)
    discountTypes.push(CART_CONSTANTS.DISCOUNT_MESSAGES.INDIVIDUAL);
  }
  
  if (isTuesday()) {
    discountTypes.push(CART_CONSTANTS.DISCOUNT_MESSAGES.TUESDAY);
  }
  
  // 할인 정보가 있을 때만 반환
  if (discountTypes.length > 0) {
    return {
      rate: discountRate,
      amount: discountAmount,
      type: shouldApplyBulkDiscount(totalItemCount) 
        ? CART_CONSTANTS.DISCOUNT_TYPES.BULK 
        : CART_CONSTANTS.DISCOUNT_TYPES.INDIVIDUAL,
      description: discountTypes.join(' + ')
    };
  }
  
  return null;
}; 