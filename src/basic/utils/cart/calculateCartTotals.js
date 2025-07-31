import { DISCOUNT } from "../../constants/discount.constant";
import { calculateItemDiscount } from "./calculateItemDiscount";

/**
 * 장바구니 총계 계산 함수
 * @param {Array} items - 장바구니 아이템 배열
 * @returns {Object} 계산된 총계 정보
 */
export const calculateCartTotals = (items) => {
  let subTotal = 0;
  let totalAmount = 0;
  let totalQty = 0;
  let itemDiscounts = [];

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
