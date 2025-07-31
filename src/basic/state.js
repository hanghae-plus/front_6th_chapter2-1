import { PRODUCT_ID } from './constants.js';

// 초기 상태 정의
const initialState = {
  products: [
    { id: PRODUCT_ID.P1, name: '버그 없애는 키보드', val: 10000, originalVal: 10000, q: 50, onSale: false, suggestSale: false },
    { id: PRODUCT_ID.P2, name: '생산성 폭발 마우스', val: 20000, originalVal: 20000, q: 30, onSale: false, suggestSale: false },
    { id: PRODUCT_ID.P3, name: '거북목 탈출 모니터암', val: 30000, originalVal: 30000, q: 20, onSale: false, suggestSale: false },
    { id: PRODUCT_ID.P4, name: '에러 방지 노트북 파우치', val: 15000, originalVal: 15000, q: 0, onSale: false, suggestSale: false },
    { id: PRODUCT_ID.P5, name: '코딩할 때 듣는 Lo-Fi 스피커', val: 25000, originalVal: 25000, q: 10, onSale: false, suggestSale: false },
  ],
  cart: [],
};

function createState(initialState) {
  let state = JSON.parse(JSON.stringify(initialState)); // Deep copy for reset
  const listeners = new Set();

  function notify() {
    // 상태가 변경될 때마다 모든 리스너(렌더링 함수 등)를 호출
    for (const listener of listeners) {
      listener(state);
    }
  }

  const methods = {
    getState() {
      return state;
    },

    subscribe(listener) {
      listeners.add(listener);
      // 구독 취소 함수 반환
      return () => listeners.delete(listener);
    },

    addItemToCart(productId) {
      const product = state.products.find((p) => p.id === productId);
      if (!product || product.q <= 0) {
        if (product && product.q <= 0) alert('재고가 부족합니다.');
        return;
      }

      const cartItem = state.cart.find((item) => item.id === productId);
      if (cartItem) {
        // cartItem.quantity++; // 직접 수정 대신 불변성 유지
        state.cart = state.cart.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // state.cart.push({ id: productId, quantity: 1 }); // 직접 수정 대신 불변성 유지
        state.cart = [...state.cart, { id: productId, quantity: 1 }];
      }

      product.q--;
      notify();
    },

    updateQuantity(productId, change) {
      const product = state.products.find((p) => p.id === productId);
      const cartItem = state.cart.find((item) => item.id === productId);

      if (!cartItem || !product) return;

      const newQuantity = cartItem.quantity + change;

      if (change > 0 && product.q <= 0) {
        alert('재고가 부족합니다.');
        return;
      }

      if (newQuantity > 0) {
        // cartItem.quantity = newQuantity; // 직접 수정하는 대신, 불변성을 유지하며 업데이트
        state.cart = state.cart.map(item => 
          item.id === productId ? { ...item, quantity: newQuantity } : item
        );
        product.q -= change;
      } else {
        // 수량이 0 이하가 되면 카트에서 제거
        product.q += cartItem.quantity;
        state.cart = state.cart.filter((item) => item.id !== productId);
      }
      notify();
    },

    removeItemFromCart(productId) {
      const cartItemIndex = state.cart.findIndex((item) => item.id === productId);
      if (cartItemIndex === -1) return;

      const cartItem = state.cart[cartItemIndex];
      const product = state.products.find((p) => p.id === productId);

      if (product) {
        product.q += cartItem.quantity;
      }

      state.cart.splice(cartItemIndex, 1);
      notify();
    },
    
    // 테스트 환경을 위한 리셋 함수
    reset() {
      state = JSON.parse(JSON.stringify(initialState));
    }
  };

  return methods;
}

export const stateManager = createState(initialState);