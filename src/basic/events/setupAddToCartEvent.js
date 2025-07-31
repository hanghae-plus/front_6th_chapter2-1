import { handleAddToCart } from './handlers/handleAddToCart.js';

/**
 * 장바구니 추가 이벤트 설정
 */
export function setupAddToCartEvent({
  addToCartButton,
  productSelector,
  cartDisplayArea,
  getCartState,
  setCartState,
}) {
  addToCartButton.addEventListener('click', () => {
    handleAddToCart({
      productSelector,
      cartDisplayArea,
      getCartState,
      setCartState,
    });
  });
}
