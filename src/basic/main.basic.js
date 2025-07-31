import { App } from './App.js';
import { cartEventManager } from './features/cart/events/cartEventHandler.js';
import {
  calculateCartTotals,
  updateCartUI,
  renderCartTotalComponent,
} from './features/cart/services/cartService.js';
import {
  setupFlashSaleTimer,
  setupRecommendationTimer,
} from './features/cart/services/promotionService.js';
import { updateOrderSummary } from './features/order/services/orderService.js';
import { calculateAndRenderPoints } from './features/point/services/pointService.js';
import { initialProducts } from './features/product/constants/index.js';
import {
  updateProductSelector,
  updateStockInfo,
} from './features/product/services/productService.js';
import { setProductState } from './features/product/store/productStore.js';

/**
 * 장바구니 계산 및 UI 업데이트
 */
const updateCart = callback => {
  const cartResults = calculateCartTotals();
  updateCartUI(cartResults);
  const pointsResults = calculateAndRenderPoints(cartResults);
  updateOrderSummary(cartResults);
  renderCartTotalComponent(pointsResults);
  updateStockInfo();

  if (callback) {
    callback({
      ...cartResults,
      points: pointsResults.points,
      pointsDetails: pointsResults.details,
    });
  }
};

/**
 * 애플리케이션 초기화
 */
const initializeApp = () => {
  // 상태 초기화
  setProductState({
    products: initialProducts,
    amount: 0,
    itemCount: 0,
    lastSelectedProduct: null,
  });

  // App 컴포넌트 렌더링
  const { appElement, helpModal, header } = App();
  const root = document.getElementById('app');

  // 기존 내용 제거 후 Original과 동일한 순서로 추가
  root.innerHTML = '';
  root.appendChild(header); // 1. Header
  root.appendChild(appElement); // 2. Grid Container
  root.appendChild(helpModal.toggleButton); // 3. Help Toggle Button
  root.appendChild(helpModal.overlay); // 4. Help Modal Overlay

  // HelpModal 이벤트 핸들러 연결
  helpModal.toggleButton.addEventListener('click', helpModal.handleToggle);
  helpModal.overlay
    .querySelector('.help-close')
    .addEventListener('click', helpModal.handleClose);
  helpModal.overlay.addEventListener('click', event => {
    if (event.target === helpModal.overlay) {
      helpModal.handleClose();
    }
  });

  // 초기 계산 및 렌더링
  updateProductSelector();
  updateCart();

  // 타이머 설정
  setupFlashSaleTimer();
  setupRecommendationTimer();

  // 이벤트 핸들러 등록
  cartEventManager.registerEvents(updateCart, updateProductSelector);
};

// 애플리케이션 시작
initializeApp();
