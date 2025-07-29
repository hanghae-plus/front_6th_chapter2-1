/**
 * 장바구니 표시 영역 생성
 */
export function CartDisplay() {
  const cartDisplay = document.createElement('div');
  cartDisplay.id = 'cart-items';

  return {
    cartDisplay,
  };
}
