/**
 * 장바구니 아이템들의 총 가격을 계산하는 함수
 * @param {Array} cartItems - 장바구니 아이템 목록
 * @returns {number} 장바구니 아이템들의 총 가격
 */
export function getCartTotalCount(cartItems) {
  return cartItems.reduce((acc, item) => acc + item.val * item.quantity, 0);
}

/**
 * 장바구니 아이템들의 총 개수를 계산하는 함수
 * @param {Array} cartItems - 장바구니 아이템 목록
 * @returns {number} 장바구니 아이템들의 총 개수
 */
export function calculateTotalAmount(cartItems) {
  return cartItems.reduce((acc, item) => acc + item.quantity, 0);
}
