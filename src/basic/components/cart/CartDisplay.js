/**
 * 장바구니 표시 영역 컴포넌트
 * 장바구니 아이템들을 표시하는 컨테이너를 생성합니다.
 */
export function createCartDisplay() {
  const cartDisplayElement = document.createElement('div');
  cartDisplayElement.id = 'cart-items';
  return cartDisplayElement;
}
