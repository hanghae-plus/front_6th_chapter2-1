import { registerCartEvents } from '@/basic/features/cart/events/cartEventHandler.js';
import {
  calculateCartTotals,
  updateCartUI,
  renderCartTotalComponent,
} from '@/basic/features/cart/services/cartService.js';
import {
  initializeCartPromotion,
  setupFlashSaleTimer,
  setupRecommendationTimer,
} from '@/basic/features/cart/services/promotionService.js';
import { initializeCartStore } from '@/basic/features/cart/store/cartStore.js';
import { updateOrderSummary } from '@/basic/features/order/services/orderService.js';
import { calculateAndRenderPoints } from '@/basic/features/point/services/pointService.js';
import ProductSelector from '@/basic/features/product/components/ProductSelector.js';
import { initialProducts } from '@/basic/features/product/constants/index.js';
import {
  updateProductSelector,
  updateStockInfo,
  setProductState,
  initializeProductStore,
  getProductState,
} from '@/basic/features/product/services/productService.js';
import { HelpModal } from '@/basic/shared/components/HelpModal.js';
import { ELEMENT_IDS } from '@/basic/shared/constants/elementIds.js';
import { addEventListener } from '@/basic/shared/core/domUtils.js';

/**
 * 애플리케이션 초기화 (순수 함수)
 */
const initializeApp = () => {
  const root = document.getElementById('app');

  setProductState({
    products: initialProducts,
    amount: 0,
    itemCount: 0,
    lastSelectedProduct: null,
  });

  initializeCartPromotion();

  const app = App();
  root.appendChild(app.appElement);
  root.appendChild(app.helpModal.toggleButton);
  root.appendChild(app.helpModal.overlay);

  setAppState({
    isInitialized: true,
    helpModal: app.helpModal,
  });

  return app;
};

/**
 * 이벤트 핸들러 설정 (부수 효과)
 * @param {object} app - 앱 인스턴스
 */
const setupEventHandlers = app => {
  addEventListener(document, 'click', event => {
    const target = event.target;

    if (target.closest('.help-toggle')) {
      app.helpModal.handleToggle();
      return;
    }

    if (
      target.closest('.help-close') ||
      (target.closest('.help-overlay') &&
        event.target.classList.contains('help-overlay'))
    ) {
      app.helpModal.handleClose();
      return;
    }
  });
};

/**
 * 카트 계산 및 업데이트 (순수 함수)
 * @param {Function} callback - 계산 완료 후 실행할 콜백
 */
const calculateCart = callback => {
  const cartResults = calculateCartTotals();
  if (!cartResults) return;

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
 * 타이머 설정 (부수 효과)
 */
const setupTimers = () => {
  setupFlashSaleTimer();
  setupRecommendationTimer();
};

/**
 * 카트 이벤트 등록 (부수 효과)
 */
const setupCartEvents = () => {
  registerCartEvents(calculateCart, updateProductSelector);

  window.addEventListener('cart-updated', () => {
    calculateCart();
  });
};

/**
 * 초기 렌더링 (부수 효과)
 */
const performInitialRender = () => {
  updateProductSelector();
  calculateCart();
};

/**
 * 메인 애플리케이션 실행
 * @param {Function} callbackFn - 초기화 완료 후 실행할 콜백
 */
const main = callbackFn => {
  const app = initializeApp(callbackFn);

  setupEventHandlers(app);
  performInitialRender();
  setupTimers();
  setupCartEvents();

  if (callbackFn) {
    callbackFn(app.helpModal);
  }
};

// 애플리케이션 시작
main(() => {
  // 초기화 완료 후 추가 작업이 필요하면 여기에
});
