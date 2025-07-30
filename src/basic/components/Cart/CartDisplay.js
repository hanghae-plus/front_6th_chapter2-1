import {
  getCartItems,
  removeItemFromCart,
  updateCartItemQuantity,
} from '../../services/cartService';
import { CartItem } from './CartItem';

export const CartDisplay = (onCartUpdate) => {
  const cartDisp = document.createElement('div');
  cartDisp.id = 'cart-items';

  // 장바구니 UI를 다시 그리는 함수
  const renderCart = () => {
    cartDisp.innerHTML = ''; // 기존 항목 비우기
    const cartItems = getCartItems(); // 최신 장바구니 데이터 가져오기

    cartItems.forEach((itemData) => {
      // 각 장바구니 항목에 대한 CartItem 컴포넌트 생성 및 이벤트 핸들러 연결
      const cartItemElement = CartItem(
        itemData,
        (productId, change) => {
          // 수량 변경 시 서비스 호출 및 UI 업데이트
          const result = updateCartItemQuantity(productId, change);
          if (!result.success) {
            alert(result.message);
          }
          onCartUpdate();
        },
        (productId) => {
          // 항목 제거 시 서비스 호출 및 UI 업데이트
          removeItemFromCart(productId);
          onCartUpdate();
        }
      );
      if (cartItemElement) {
        cartDisp.appendChild(cartItemElement); // 생성된 항목을 DOM에 추가
      }
    });
  };

  renderCart(); // 초기 렌더링 실행

  return { element: cartDisp, renderCart }; // 장바구니 DOM 요소와 렌더링 함수 반환
};
