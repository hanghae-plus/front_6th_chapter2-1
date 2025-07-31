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

/**
 * CartDisplay 렌더링 함수
 *
 * @description 장바구니 표시 영역 HTML 문자열을 생성
 *
 * @returns {string} 장바구니 표시 영역 HTML 문자열
 */
export const renderCartDisplay = () => {
  return '<div id="cart-items"></div>';
};
