import { CART_TOTAL_BENEFIT_THRESHOLD, PER_ITEM_DISCOUNT_THRESHOLD } from '../const/discount';
import { cartManager } from '../domain/cart';
import productManager from '../domain/product';
import { PRODUCT_FIVE, PRODUCT_FOUR, PRODUCT_ONE, PRODUCT_THREE, PRODUCT_TWO } from '../domain/product';
import { isTuesday } from '../utils/dateUtil';

export const applyItemDiscount = () => {
  return cartManager.getItems().reduce(
    (result, { productId, quantity: cartQuantity }) => {
      const product = productManager.getProductById(productId);
      const price = product.discountValue * cartQuantity;

      let discountRate = 0;
      if (cartQuantity >= PER_ITEM_DISCOUNT_THRESHOLD) {
        switch (productId) {
          case PRODUCT_ONE:
            discountRate = 0.1;
            break;
          case PRODUCT_TWO:
            discountRate = 0.15;
            break;
          case PRODUCT_THREE:
            discountRate = 0.2;
            break;
          case PRODUCT_FOUR:
            discountRate = 0.05;
            break;
          case PRODUCT_FIVE:
            discountRate = 0.25;
            break;
        }
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

  if (totalItemCount >= CART_TOTAL_BENEFIT_THRESHOLD) {
    finalTotal = subTotal * 0.75;
    finalDiscountRate = 0.25;
  }

  if (isTuesday() && finalTotal > 0) {
    finalTotal = finalTotal * 0.9;
    finalDiscountRate = subTotal === 0 ? 0 : 1 - finalTotal / subTotal;
  }

  finalTotal = Math.round(finalTotal);
  finalDiscountRate = Math.round(finalDiscountRate * 100) / 100;

  return {
    finalTotal,
    finalDiscountRate,
    itemDiscounts: totalItemCount >= CART_TOTAL_BENEFIT_THRESHOLD ? [] : appliedItemDiscounts, // 전체 할인 시 개별 할인 내역 제거
  };
};
