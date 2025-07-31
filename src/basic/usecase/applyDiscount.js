import {
  CART_TOTAL_DISCOUNT_RATE,
  CART_TOTAL_DISCOUNT_THRESHOLD,
  PER_ITEM_DISCOUNT_RATES,
  PER_ITEM_DISCOUNT_THRESHOLD,
  TUESDAY_DISCOUNT_RATE,
} from '../const/discount';
import { cartManager } from '../domain/cart';
import productManager from '../domain/product';
import { isTuesday } from '../utils/dateUtil';

export const applyItemDiscount = () => {
  return cartManager.getItems().reduce(
    (result, { productId, quantity: cartQuantity }) => {
      const product = productManager.getProductById(productId);
      const price = product.discountValue * cartQuantity;

      let discountRate = 0;
      if (cartQuantity >= PER_ITEM_DISCOUNT_THRESHOLD) {
        discountRate = PER_ITEM_DISCOUNT_RATES[productId] ?? 0;
      }

      if (discountRate > 0) {
        result.appliedItemDiscounts.push({
          name: product.name,
          discount: discountRate * 100,
        });
      }

      result.subTotal += price;
      result.totalAfterItemDiscount += price * (1 - discountRate);

      return result;
    },
    { subTotal: 0, totalAfterItemDiscount: 0, appliedItemDiscounts: [] }
  );
};

// 2단계: 전체 수량 할인 및 화요일 할인 적용 함수
export const applyTotalDiscount = ({ subTotal, totalAfterItemDiscount, appliedItemDiscounts }) => {
  const totalItemCount = cartManager.getTotalItem();
  let finalTotal = totalAfterItemDiscount;
  let finalDiscountRate = subTotal === 0 ? 0 : (subTotal - finalTotal) / subTotal;

  if (totalItemCount >= CART_TOTAL_DISCOUNT_THRESHOLD) {
    finalTotal = subTotal * (1 - CART_TOTAL_DISCOUNT_RATE);
    finalDiscountRate = CART_TOTAL_DISCOUNT_RATE;
  }

  if (isTuesday() && finalTotal > 0) {
    finalTotal = finalTotal * (1 - TUESDAY_DISCOUNT_RATE);
    finalDiscountRate = subTotal === 0 ? 0 : 1 - finalTotal / subTotal;
  }

  finalTotal = Math.round(finalTotal);
  finalDiscountRate = Math.round(finalDiscountRate * 100) / 100;

  return {
    finalTotal,
    finalDiscountRate,
    itemDiscounts: totalItemCount >= CART_TOTAL_DISCOUNT_THRESHOLD ? [] : appliedItemDiscounts, // 전체 할인 시 개별 할인 내역 제거
  };
};
