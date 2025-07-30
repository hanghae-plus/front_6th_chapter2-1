import { updateCartItem } from "../services/cartService";

/**
 * 장바구니 추가/삭제 이벤트 초기화
 */
export const initCartDOMEvent = (cartDisp, handleCalculateCartStuff) => {
  cartDisp.addEventListener("click", (event) => {
    const tgt = event.target;
    if (!tgt) return;

    if (
      tgt.classList.contains("quantity-change") ||
      tgt.classList.contains("remove-item")
    ) {
      const prodId = tgt.dataset.productId;
      const qtyChange = tgt.classList.contains("remove-item")
        ? -Infinity
        : parseInt(tgt.dataset.change);

      updateCartItem(prodId, qtyChange, handleCalculateCartStuff, cartDisp);
    }
  });
};
