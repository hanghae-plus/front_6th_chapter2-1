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
 * 애플리케이션 초기화 (DI 적용)
 */
const initializeApp = () => {
  const root = document.getElementById('app');

  // 스토어 초기화
  initializeProductStore();
  initializeCartStore();

  // 초기 상태 설정
  setProductState({
    products: initialProducts,
    amount: 0,
    itemCount: 0,
    lastSelectedProduct: null,
  });

  // 프로모션 초기화
  initializeCartPromotion();

  // 직접 HTML 삽입 (기존 DOM 구조 유지)
  root.innerHTML = /* html */ `
    <div class="bg-gray-100 p-8">
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
          <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
          <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
        </div>
        
        <!-- Main Grid Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
          <!-- Left Column -->
          <div class="bg-white border border-gray-200 p-8 overflow-y-auto">
            <div class="mb-6 pb-6 border-b border-gray-200">
              <!-- ProductSelector will be inserted here -->
              <button id="${ELEMENT_IDS.ADD_TO_CART}" class="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all">
                Add to Cart
              </button>
              <div id="${ELEMENT_IDS.STOCK_STATUS}" class="text-xs text-red-500 mt-3 whitespace-pre-line"></div>
            </div>
            <div id="${ELEMENT_IDS.CART_ITEMS}" class="space-y-3"></div>
          </div>

          <!-- Right Column -->
          <div class="bg-black text-white p-8 flex flex-col">
            <h2 class="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
            <div class="flex-1 flex flex-col">
              <div id="summary-details" class="space-y-3"></div>
              <div class="mt-auto">
                <div id="discount-info" class="mb-4"></div>
                <div id="cart-total" class="pt-5 border-t border-white/10">
                  <div class="flex justify-between items-baseline">
                    <span class="text-sm uppercase tracking-wider">Total</span>
                    <div class="text-2xl tracking-tight">₩0</div>
                  </div>
                  <div id="loyalty-points" class="text-xs text-blue-400 mt-2 text-right">적립 포인트: 0p</div>
                </div>
                <div id="tuesday-special" class="mt-4 p-3 bg-white/10 rounded-lg hidden">
                  <div class="flex items-center gap-2">
                    <span class="text-2xs">🎉</span>
                    <span class="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
                  </div>
                </div>
              </div>
            </div>
            <button class="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
              Proceed to Checkout
            </button>
            <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
              Free shipping on all orders.<br>
              <span id="points-notice">Earn loyalty points with purchase.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  `;

  const selectorContainer = root.querySelector('.border-b');
  const productSelectorElement = ProductSelector({
    products: initialProducts,
    selectedProductId: '',
    onSelectionChange: productId => {
      setProductState({
        ...getProductState(),
        lastSelectedProduct: productId,
      });
    },
  });
  selectorContainer.insertBefore(
    productSelectorElement,
    selectorContainer.firstChild,
  );

  // 도움말 모달 추가
  const helpModal = HelpModal();
  root.appendChild(helpModal.toggleButton);
  root.appendChild(helpModal.overlay);

  return { helpModal };
};

/**
 * 이벤트 핸들러 설정
 * @param {object} helpModal - 도움말 모달 인스턴스
 */
const setupEventHandlers = helpModal => {
  document.addEventListener('click', event => {
    const target = event.target;

    if (target.closest('.help-toggle')) {
      helpModal.handleToggle();
      return;
    }

    if (target.closest('.help-close') || target.closest('.help-overlay')) {
      helpModal.handleClose();
      return;
    }
  });
};

/**
 * 카트 계산 및 업데이트 (DI 적용)
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
 * 타이머 설정
 */
const setupTimers = () => {
  setupFlashSaleTimer();
  setupRecommendationTimer();
};

/**
 * 카트 이벤트 등록
 */
const setupCartEvents = () => {
  registerCartEvents(calculateCart, updateProductSelector);

  window.addEventListener('cart-updated', () => {
    calculateCart();
  });
};

/**
 * 초기 렌더링
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
  const { helpModal } = initializeApp();

  setupEventHandlers(helpModal);
  performInitialRender();
  setupTimers();
  setupCartEvents();

  if (callbackFn) {
    callbackFn();
  }
};

main();
