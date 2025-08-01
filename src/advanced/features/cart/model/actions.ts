/**
 * 장바구니 도메인 액션 타입 정의
 */
export type CartAction =
  | { type: 'cart/ADD_TO_CART'; payload: string }
  | { type: 'cart/UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'cart/REMOVE_FROM_CART'; payload: string }
  | { type: 'cart/CLEAR_CART' };

// 장바구니 액션 생성자
export const cartActions = {
  // 상품을 장바구니에 추가
  addToCart: (productId: string): CartAction => ({
    type: 'cart/ADD_TO_CART',
    payload: productId,
  }),

  // 장바구니 아이템 수량 변경
  updateQuantity: (id: string, quantity: number): CartAction => ({
    type: 'cart/UPDATE_QUANTITY',
    payload: { id, quantity },
  }),

  // 장바구니에서 아이템 제거
  removeFromCart: (productId: string): CartAction => ({
    type: 'cart/REMOVE_FROM_CART',
    payload: productId,
  }),

  // 장바구니 전체 비우기
  clearCart: (): CartAction => ({
    type: 'cart/CLEAR_CART',
  }),
};
