import { DISCOUNT, ITEM_DISCOUNT } from "../constants/discount.constant";
import { PRODUCT_IDS } from "../constants/product.constant";
import type { CartItem } from "../types";

export interface CartTotals {
  subTotal: number;
  totalAmount: number;
  totalQty: number;
  itemDiscounts: Array<{ name: string; discount: number }>;
  bulkDiscount: number;
  tuesdayDiscount: number;
  isTuesday: boolean;
  totalDiscountRate: number;
  savedAmount: number;
}

/**
 * 아이템 할인 계산
 * @param productId - 상품 ID
 * @param quantity - 수량
 * @param discountThreshold - 할인 임계값
 * @returns 할인율
 */
export const calculateItemDiscount = (
  productId: string,
  quantity: number,
  discountThreshold: number = ITEM_DISCOUNT.THRESHOLD
): number => {
  // 수량이 할인 임계값보다 작으면 기본 할인율 반환
  if (quantity < discountThreshold) return ITEM_DISCOUNT.RATES.default;

  // 상품 ID별 할인율 반환
  switch (productId) {
    case PRODUCT_IDS.p1:
      return ITEM_DISCOUNT.RATES.p1;
    case PRODUCT_IDS.p2:
      return ITEM_DISCOUNT.RATES.p2;
    case PRODUCT_IDS.p3:
      return ITEM_DISCOUNT.RATES.p3;
    case PRODUCT_IDS.p4:
      return ITEM_DISCOUNT.RATES.p4;
    case PRODUCT_IDS.p5:
      return ITEM_DISCOUNT.RATES.p5;
    default:
      return ITEM_DISCOUNT.RATES.default;
  }
};

/**
 * 장바구니 총계 계산 함수
 * @param items - 장바구니 아이템 배열
 * @returns 계산된 총계 정보
 */
export const calculateCartTotals = (items: CartItem[]): CartTotals => {
  let subTotal = 0;
  let totalAmount = 0;
  let totalQty = 0;
  const itemDiscounts: Array<{ name: string; discount: number }> = [];

  // 기본 계산
  items.forEach((item) => {
    const { quantity, val, id, name } = item;
    const itemTotal = val * quantity;
    const discount = calculateItemDiscount(id, quantity);

    subTotal += itemTotal;
    totalAmount += itemTotal * (1 - discount);
    totalQty += quantity;

    if (discount > 0) {
      itemDiscounts.push({ name, discount: discount * 100 });
    }
  });

  // 대량구매 할인 계산
  let bulkDiscount = 0;
  if (totalQty >= DISCOUNT.BULK.THRESHOLD) {
    totalAmount = subTotal * DISCOUNT.BULK.RATE;
    bulkDiscount = DISCOUNT.BULK.PERCENT;
  }

  // 화요일 할인 계산
  const today = new Date();
  const isTuesday = today.getDay() === DISCOUNT.TUESDAY.WEEKDAY;
  let tuesdayDiscount = 0;

  if (isTuesday && totalAmount > 0) {
    totalAmount = totalAmount * DISCOUNT.TUESDAY.RATE;
    tuesdayDiscount = DISCOUNT.TUESDAY.PERCENT;
  }

  // 총 할인율 계산
  const totalDiscountRate =
    subTotal > 0 ? ((subTotal - totalAmount) / subTotal) * 100 : 0;

  return {
    subTotal,
    totalAmount: Math.round(totalAmount),
    totalQty,
    itemDiscounts,
    bulkDiscount,
    tuesdayDiscount,
    isTuesday,
    totalDiscountRate,
    savedAmount: Math.round(subTotal - totalAmount),
  };
};
