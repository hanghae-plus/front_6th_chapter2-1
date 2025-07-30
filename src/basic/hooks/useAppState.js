// ==========================================
// 앱 상태 관리 Custom Hook
// ==========================================

import { 
  PRODUCT_PRICES, 
  INITIAL_STOCK, 
  UI_CONSTANTS 
} from '../constant/index.js';

/**
 * React useState 패턴을 모방한 상태 관리 클래스
 */
class StateManager {
  constructor(initialState) {
    this._state = initialState;
    this._listeners = [];
  }

  getState() {
    return this._state;
  }

  setState(updater) {
    const newState = typeof updater === 'function' 
      ? updater(this._state) 
      : { ...this._state, ...updater };
    
    this._state = newState;
    this._listeners.forEach(listener => listener(newState));
    return newState;
  }

  subscribe(listener) {
    this._listeners.push(listener);
    return () => {
      this._listeners = this._listeners.filter(l => l !== listener);
    };
  }
}

/**
 * 초기 상품 상태 생성
 */
const createInitialProducts = () => [
  {
    id: 'p1',
    name: '버그 없애는 키보드',
    val: PRODUCT_PRICES.KEYBOARD,
    originalVal: PRODUCT_PRICES.KEYBOARD,
    quantity: INITIAL_STOCK.KEYBOARD,
    onSale: false,
    suggestSale: false,
  },
  {
    id: 'p2',
    name: '생산성 폭발 마우스',
    val: PRODUCT_PRICES.MOUSE,
    originalVal: PRODUCT_PRICES.MOUSE,
    quantity: INITIAL_STOCK.MOUSE,
    onSale: false,
    suggestSale: false,
  },
  {
    id: 'p3',
    name: '거북목 탈출 모니터암',
    val: PRODUCT_PRICES.MONITOR_ARM,
    originalVal: PRODUCT_PRICES.MONITOR_ARM,
    quantity: INITIAL_STOCK.MONITOR_ARM,
    onSale: false,
    suggestSale: false,
  },
  {
    id: 'p4',
    name: '에러 방지 노트북 파우치',
    val: PRODUCT_PRICES.POUCH,
    originalVal: PRODUCT_PRICES.POUCH,
    quantity: INITIAL_STOCK.POUCH,
    onSale: false,
    suggestSale: false,
  },
  {
    id: 'p5',
    name: '코딩할 때 듣는 Lo-Fi 스피커',
    val: PRODUCT_PRICES.SPEAKER,
    originalVal: PRODUCT_PRICES.SPEAKER,
    quantity: INITIAL_STOCK.SPEAKER,
    onSale: false,
    suggestSale: false,
  },
];

/**
 * 앱 상태 관리 Custom Hook (React useState 패턴)
 */
export function useAppState() {
  const initialState = {
    products: createInitialProducts(),
    cart: {
      totalAmount: UI_CONSTANTS.INITIAL_CART_AMOUNT,
      itemCount: UI_CONSTANTS.INITIAL_CART_COUNT,
      bonusPoints: UI_CONSTANTS.INITIAL_BONUS_POINTS,
    },
    lastSelected: null,
  };

  const stateManager = new StateManager(initialState);

  // React useState 스타일의 액션들
  const actions = {
    updateProducts: (updater) => 
      stateManager.setState(state => ({
        ...state,
        products: typeof updater === 'function' ? updater(state.products) : updater
      })),

    updateCart: (updater) => 
      stateManager.setState(state => ({
        ...state,
        cart: typeof updater === 'function' ? updater(state.cart) : { ...state.cart, ...updater }
      })),

    setLastSelected: (productId) => 
      stateManager.setState(state => ({
        ...state,
        lastSelected: productId
      })),

    // 불변성을 지키는 상품 업데이트
    updateProduct: (productId, updates) => 
      stateManager.setState(state => ({
        ...state,
        products: state.products.map(product => 
          product.id === productId 
            ? { ...product, ...updates }
            : product
        )
      })),

    // 장바구니 아이템 추가/수정
    updateCartItem: (productId, quantity) => {
      const state = stateManager.getState();
      const product = state.products.find(p => p.id === productId);
      if (!product) return state;

      // 실제 장바구니 로직은 여기서 구현
      return stateManager.setState(currentState => ({
        ...currentState,
        cart: {
          ...currentState.cart,
          // 장바구니 업데이트 로직
        }
      }));
    }
  };

  return {
    getState: () => stateManager.getState(),
    subscribe: (listener) => stateManager.subscribe(listener),
    actions
  };
}

/**
 * 커스텀 이펙트 Hook (React useEffect 패턴)
 */
export function useEffect(effectFn, dependencies = []) {
  let hasChanged = true;
  let prevDeps = [];

  return {
    run: () => {
      if (hasChanged || dependencies.some((dep, i) => dep !== prevDeps[i])) {
        effectFn();
        prevDeps = [...dependencies];
        hasChanged = false;
      }
    }
  };
}

/**
 * 특정 상품 찾기 Hook
 */
export function useProduct(appState, productId) {
  return {
    getProduct: () => appState.getState().products.find(p => p.id === productId),
    updateProduct: (updates) => appState.actions.updateProduct(productId, updates)
  };
}
