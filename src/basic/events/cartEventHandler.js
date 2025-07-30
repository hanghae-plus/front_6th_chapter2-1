import { updateCartItem } from "../services/cartService";
import { getCartContainer } from "../ui/dom/getDOMElements";

/**
 * 장바구니 추가/삭제 이벤트 초기화
 */
export const initCartDOMEvent = () => {
  const cartContainer = getCartContainer();
  cartContainer.addEventListener("click", (event) => {
    const target = event.target;
    if (!target) return;
    if (
      target.classList.contains("quantity-change") ||
      target.classList.contains("remove-item")
    ) {
      const prodId = target.dataset.productId;
      const qtyChange = target.classList.contains("remove-item")
        ? -Infinity
        : parseInt(target.dataset.change);

      updateCartItem(prodId, qtyChange, cartContainer);
    }
  });
};
