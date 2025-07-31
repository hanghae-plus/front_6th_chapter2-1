import { CartItem, Discount } from '../types';

// 화요일인지 확인
export const isTuesday = (): boolean => {
  return new Date().getDay() === 2; // 0=일요일, 1=월요일, 2=화요일
};

// 개별 상품 할인 계산
export const calculateIndividualDiscount = (item: CartItem): number => {
  if (item.quantity >= 10) {
    return item.product.discount / 100; // 퍼센트를 소수로 변환
  }
  return 0;
};

// 전체 수량 할인 계산 (30개 이상)
export const calculateBulkDiscount = (cartItems: CartItem[]): number => {
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  return totalQuantity >= 30 ? 0.25 : 0; // 25% 할인
};

// 화요일 할인 계산
export const calculateTuesdayDiscount = (): number => {
  return isTuesday() ? 0.1 : 0; // 10% 할인
};

// 최종 할인율 계산 (중복 적용 시 복합 할인)
export const calculateTotalDiscount = (cartItems: CartItem[]): Discount[] => {
  const discounts: Discount[] = [];

  // 개별 상품 할인
  cartItems.forEach((item) => {
    const individualDiscount = calculateIndividualDiscount(item);
    if (individualDiscount > 0) {
      discounts.push({
        type: 'individual',
        rate: individualDiscount,
        description: `${item.product.name} ${item.quantity}개 이상 구매 할인`,
      });
    }
  });

  // 전체 수량 할인 (개별 할인보다 우선)
  const bulkDiscount = calculateBulkDiscount(cartItems);
  if (bulkDiscount > 0) {
    discounts.push({
      type: 'bulk',
      rate: bulkDiscount,
      description: '전체 30개 이상 구매 할인',
    });
  }

  // 화요일 할인
  const tuesdayDiscount = calculateTuesdayDiscount();
  if (tuesdayDiscount > 0) {
    discounts.push({
      type: 'tuesday',
      rate: tuesdayDiscount,
      description: '화요일 특별 할인',
    });
  }

  return discounts;
};

// 할인 적용된 총액 계산
export const calculateDiscountedTotal = (
  cartItems: CartItem[],
): {
  subtotal: number;
  totalDiscount: number;
  finalTotal: number;
  discounts: Discount[];
} => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discounts = calculateTotalDiscount(cartItems);

  // 할인율 계산 (복합 할인)
  let totalDiscountRate = 0;
  discounts.forEach((discount) => {
    // 복합 할인 공식: 1 - (1 - rate1) * (1 - rate2) * ...
    totalDiscountRate = 1 - (1 - totalDiscountRate) * (1 - discount.rate);
  });

  const totalDiscount = subtotal * totalDiscountRate;
  const finalTotal = subtotal - totalDiscount;

  return {
    subtotal,
    totalDiscount,
    finalTotal,
    discounts,
  };
};
