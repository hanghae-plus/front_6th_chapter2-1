/**
 * 장바구니 상태 관리 함수들
 */

// 상태
let cartState = {
  items: [],
  total: 0,
  discountRate: 0,
};

// 리스너들
const listeners = [];

/**
 * 상태 가져오기
 */
export const getCartState = () => ({ ...cartState });

/**
 * 상태 설정
 */
export const setCartState = updates => {
  cartState = { ...cartState, ...updates };
  notifyListeners();
};

/**
 * 리스너 등록
 */
export const subscribeToCartState = listener => {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
};

/**
 * 리스너들에게 변경 알림
 */
const notifyListeners = () => {
  listeners.forEach(listener => listener(cartState));
};

/**
 * 장바구니 아이템 추가
 */
export const addCartItem = item => {
  const existingItem = cartState.items.find(i => i.id === item.id);

  if (existingItem) {
    // 기존 아이템 수량 증가
    const updatedItems = cartState.items.map(i =>
      i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
    );
    setCartState({ items: updatedItems });
  } else {
    // 새 아이템 추가
    setCartState({
      items: [...cartState.items, { ...item, quantity: 1 }],
    });
  }
};

/**
 * 장바구니 아이템 제거
 */
export const removeCartItem = itemId => {
  setCartState({
    items: cartState.items.filter(item => item.id !== itemId),
  });
};

/**
 * 장바구니 아이템 수량 변경
 */
export const updateCartItemQuantity = (itemId, quantity) => {
  if (quantity <= 0) {
    removeCartItem(itemId);
    return;
  }

  const updatedItems = cartState.items.map(item =>
    item.id === itemId ? { ...item, quantity } : item,
  );
  setCartState({ items: updatedItems });
};

/**
 * 장바구니 총액 업데이트
 */
export const updateCartTotal = total => {
  setCartState({ total });
};

/**
 * 할인율 업데이트
 */
export const updateDiscountRate = discountRate => {
  setCartState({ discountRate });
};

/**
 * 장바구니 비우기
 */
export const clearCart = () => {
  setCartState({
    items: [],
    total: 0,
    discountRate: 0,
  });
};

/**
 * 스토어 초기화
 */
export const initializeCartStore = initialState => {
  cartState = {
    items: [],
    total: 0,
    discountRate: 0,
    ...initialState,
  };
  listeners.length = 0; // 리스너 초기화
};

/**
 * 스토어 리셋
 */
export const resetCartStore = () => {
  initializeCartStore();
};
