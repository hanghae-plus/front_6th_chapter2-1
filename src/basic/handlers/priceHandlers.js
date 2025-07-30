import { PRODUCT_LIST } from "../data/product.js";
import { findProductById } from "../utils/productUtils.js";
import { calculateProductDiscountInfo } from "./productHandlers.js";
import { uiEventBus } from "../core/eventBus.js";

// 장바구니 내 가격 업데이트 핸들러
export function handlePricesUpdate(cartItems = []) {
  // 장바구니 아이템 정보 처리
  const itemsToUpdate = cartItems
    .map(cartItem => {
      const product = findProductById(cartItem.id, PRODUCT_LIST);
      if (product) {
        const discountInfo = calculateProductDiscountInfo(product);
        return { cartItem, product, discountInfo };
      }
      return null;
    })
    .filter(item => item !== null);

  // 이벤트 발송 (DOM 조작 없음)
  uiEventBus.emit("product:prices:updated", {
    itemsToUpdate,
    success: true,
  });

  // 요약 업데이트도 함께
  uiEventBus.emit("cart:summary:updated");
}
