import { renderNewCartItem } from "./renderNewCartItem";

/**
 * 장바구니의 모든 아이템을 한 번에 렌더링하는 함수
 * @param {Array} cartItems - 장바구니 아이템 배열
 * @returns {string} 렌더링된 HTML
 */
export const renderAllCartItems = (cartItems) => {
  if (!cartItems || cartItems.length === 0) {
    return ""; // 빈 장바구니일 때는 빈 문자열 반환
  }

  return cartItems
    .map((item) => renderNewCartItem(item, item.quantity))
    .join("");
};
