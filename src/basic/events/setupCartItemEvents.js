import { handleCartItemClick } from './handlers/handleCartItemClick.js';

export function setupCartItemEvents({
  cartDisplayArea,
  getCartState,
  setCartState,
}) {
  cartDisplayArea.addEventListener('click', event => {
    const target = event.target;

    // 수량 변경 또는 삭제 버튼이 아닌 경우 무시
    if (
      !target.classList.contains('quantity-change') &&
      !target.classList.contains('remove-item')
    ) {
      return;
    }

    const cartItemElement = target.closest('[id]');
    if (!cartItemElement) {
      return;
    }

    handleCartItemClick({
      cartItemElement,
      cartState: getCartState(),
      setCartState,
    });
  });
}
