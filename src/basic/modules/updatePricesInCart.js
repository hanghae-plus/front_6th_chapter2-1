/**
 * 장바구니 내 상품들의 총 수량을 계산
 */
export function updatePricesInCart({ cartDisp, totalCount }) {
  const cartItems = Array.from(cartDisp.children);

  return cartItems.reduce((count, cartItem) => {
    const quantityElement = cartItem.querySelector('.quantity-number');
    const quantity = parseInt(quantityElement.textContent, 10);
    return count + quantity;
  }, totalCount);
}
