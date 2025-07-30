import { updateCartItem } from "../services/cartService";
import { getCartContainer } from "../ui/dom/getDOMElements";

/**
 * 장바구니 추가/삭제 이벤트 초기화
 */
export const initCartDOMEvent = () => {
  // 장바구니 컨테이너 존재 체크
  const cartContainer = getCartContainer();
  cartContainer.addEventListener("click", (event) => {
    // 클릭 이벤트 타겟 체크
    const target = event.target;
    if (!target) return;

    // 수량 변경 또는 삭제 이벤트 체크
    if (
      target.classList.contains("quantity-change") ||
      target.classList.contains("remove-item")
    ) {
      // 상품 ID 체크
      const prodId = target.dataset.productId;
      const qtyChange = target.classList.contains("remove-item")
        ? -Infinity
        : parseInt(target.dataset.change);

      // 장바구니 업데이트
      updateCartItem(prodId, qtyChange, cartContainer);
    }
  });
};
