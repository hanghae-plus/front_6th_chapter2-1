import { Cart } from "../types";
import { DISCOUNT_RATES } from "../constants";

export interface DiscountInfo {
  type: string;
  percentage: number;
  description: string;
  savedAmount: number;
}

export const calculateIndividualDiscount = (item: Cart): number => {
  if (item.quantity < 10) return 0;

  const discountRate = DISCOUNT_RATES.INDIVIDUAL[item.product.id as keyof typeof DISCOUNT_RATES.INDIVIDUAL];
  return discountRate || 0;
};

export const calculateBulkDiscount = (totalQuantity: number): number => {
  if (totalQuantity < DISCOUNT_RATES.BULK_THRESHOLD) return 0;
  return DISCOUNT_RATES.BULK_DISCOUNT;
};

export const calculateTuesdayDiscount = (): boolean => {
  const today = new Date();
  return today.getDay() === 2; // 화요일
};

export const calculateTotalDiscount = (cartItems: Cart[], subtotal: number): DiscountInfo[] => {
  const discounts: DiscountInfo[] = [];
  let totalDiscountAmount = 0;

  // 개별 상품 할인
  cartItems.forEach(item => {
    const individualDiscount = calculateIndividualDiscount(item);
    if (individualDiscount > 0) {
      const discountAmount = (item.product.val * item.quantity * individualDiscount) / 100;
      totalDiscountAmount += discountAmount;
      discounts.push({
        type: "individual",
        percentage: individualDiscount,
        description: `${item.product.name} (10개↑)`,
        savedAmount: discountAmount,
      });
    }
  });

  // 대량 구매 할인
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const bulkDiscount = calculateBulkDiscount(totalQuantity);
  if (bulkDiscount > 0) {
    const discountAmount = (subtotal * bulkDiscount) / 100;
    totalDiscountAmount += discountAmount;
    discounts.push({
      type: "bulk",
      percentage: bulkDiscount,
      description: "대량구매 할인 (30개 이상)",
      savedAmount: discountAmount,
    });
  }

  // 화요일 할인
  if (calculateTuesdayDiscount()) {
    const discountAmount = (subtotal * DISCOUNT_RATES.TUESDAY_DISCOUNT) / 100;
    totalDiscountAmount += discountAmount;
    discounts.push({
      type: "tuesday",
      percentage: DISCOUNT_RATES.TUESDAY_DISCOUNT,
      description: "화요일 추가 할인",
      savedAmount: discountAmount,
    });
  }

  return discounts;
};

export const calculateFinalPrice = (subtotal: number, discounts: DiscountInfo[]): number => {
  const totalDiscountPercentage = discounts.reduce((sum, discount) => sum + discount.percentage, 0);
  return subtotal * (1 - totalDiscountPercentage / 100);
};
