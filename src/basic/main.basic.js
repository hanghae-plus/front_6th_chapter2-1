// ==========================================
// React 친화적 패턴으로 리팩토링된 메인 앱
// ==========================================

// React 스타일 상태 관리 및 핸들러
import { useAppState } from './hooks/useAppState.js';
import { 
  createEventHandlers, 
  initializeReactLikeApp 
} from './handlers/reactHandlers.js';

// 순수 함수 컴포넌트들
import { ProductSelector } from './components/ProductSelector.js';
import { CartDisplay } from './components/CartDisplay.js';
import { Header } from './components/Header.js';
import { Layout } from './components/Layout.js';
import { HelpModal } from './components/HelpModal.js';

// 상수
import { DISCOUNT_RATES } from './constant/index.js';

// ==========================================
// React 스타일 앱 컴포넌트
// ==========================================

/**
 * 메인 App 컴포넌트 (React 패턴)
 * 
 * @param {Object} state - 앱 상태
 * @param {Object} handlers - 이벤트 핸들러들
 */
function App(state, handlers) {
  const { products, cart, lastSelected } = state;
  const { onProductSelect, onAddToCart } = handlers;

  // 컴포넌트 렌더링
  const productSelector = ProductSelector({
    products,
    selectedProductId: lastSelected,
    onProductSelect,
    onAddToCart,
    totalStock: products.reduce((sum, p) => sum + p.quantity, 0)
  });

  const cartDisplay = CartDisplay({
    cart,
    onQuantityChange: handlers.onQuantityChange,
    onRemoveFromCart: handlers.onRemoveFromCart
  });

  return {
    productSelector,
    cartDisplay,
    render: () => {
      // 실제 DOM 업데이트 로직
      updateUI({ productSelector, cartDisplay }, state);
    }
  };
}

// ==========================================
// UI 업데이트 함수 (React의 렌더링과 유사)
// ==========================================

/**
 * UI 업데이트 함수 (React의 render와 유사)
 * 
 * @param {Object} components - 렌더링할 컴포넌트들
 * @param {Object} state - 현재 상태
 */
function updateUI(components, state) {
  const { productSelector, cartDisplay } = components;
  
  // 각 컴포넌트의 render 함수 호출
  if (productSelector && productSelector.render) {
    productSelector.render();
  }
  
  if (cartDisplay && cartDisplay.render) {
    cartDisplay.render();
  }
  
  // 헤더 업데이트
  updateHeader(state.cart);
}

/**
 * 헤더 업데이트 (순수 함수)
 */
function updateHeader(cart) {
  const headerElement = document.querySelector('header');
  if (headerElement) {
    const totalElement = headerElement.querySelector('.total-amount');
    const countElement = headerElement.querySelector('.item-count');
    
    if (totalElement) {
      totalElement.textContent = `₩${cart.totalAmount.toLocaleString()}`;
    }
    if (countElement) {
      countElement.textContent = `${cart.itemCount}개`;
    }
  }
}

// ==========================================
// React 스타일 메인 함수
// ==========================================

/**
 * React 스타일 메인 함수 - 앱 초기화 및 실행
 */
function main() {
  // 1. 앱 컨테이너 준비
  const appContainer = document.getElementById('app') || document.body;
  
  // 2. 기본 레이아웃 생성
  const layout = Layout();
  const helpModal = HelpModal();
  appContainer.appendChild(layout);
  appContainer.appendChild(helpModal);

  // 3. React 스타일 앱 초기화
  const cleanup = initializeReactLikeApp(appContainer, (state, handlers) => {
    // 렌더링 콜백 - 상태가 변경될 때마다 호출됨
    const app = App(state, handlers);
    app.render();
  });

  // 4. 정리 함수 등록 (페이지 언로드 시)
  window.addEventListener('beforeunload', cleanup);
  
  console.log('✅ React 친화적 패턴으로 앱이 초기화되었습니다!');
}

// 앱 실행
main();
