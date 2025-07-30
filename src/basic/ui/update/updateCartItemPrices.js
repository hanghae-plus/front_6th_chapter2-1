import { renderCartItemPrice } from "../render/renderCartItemPrice";
import productStore from "../../store/product";

/**
 * 카트 아이템들의 가격과 이름을 업데이트하는 함수
 * @param {HTMLElement} cartContainer - 카트 컨테이너 DOM 요소
 */
export const updateCartItemPrices = (cartContainer) => {
  const products = productStore.getState().products;
  const cartItems = cartContainer.children;

  // 각 카트 아이템의 가격과 이름 업데이트
  for (let i = 0; i < cartItems.length; i++) {
    const cartItem = cartItems[i];
    const itemId = cartItem.id;

    // 상품 정보 찾기
    const product = products.find((p) => p.id === itemId);
    if (!product) continue;

    // 가격과 이름 렌더링
    const { priceHTML, displayName } = renderCartItemPrice(product);

    // DOM 업데이트
    const priceDiv = cartItem.querySelector(".text-lg");
    const nameDiv = cartItem.querySelector("h3");

    // 가격 업데이트
    if (priceDiv) {
      priceDiv.innerHTML = priceHTML;
    }

    // 이름 업데이트
    if (nameDiv) {
      nameDiv.textContent = displayName;
    }
  }
};
