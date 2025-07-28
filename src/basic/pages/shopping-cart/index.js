import { ProductRepository } from '../../entities/product/index.js';
import { CartManagementService } from '../../features/cart-management/index.js';
import { PromotionService } from '../../features/promotion/index.js';
import { ProductSelectorWidget } from '../../widgets/product-selector/index.js';
import { CartWidget } from '../../widgets/cart-widget/index.js';

// 메인 쇼핑카트 페이지 애플리케이션
export class ShoppingCartApp {
  constructor() {
    this.productRepo = new ProductRepository();
    this.cartService = new CartManagementService();
    this.promotionService = new PromotionService(this.productRepo);
    
    this.lastSelectedProduct = null;
    this.widgets = {};
    
    this.init();
  }

  init() {
    this.createDOMStructure();
    this.initializeWidgets();
    this.setupPromotions();
    this.setupEventListeners();
  }

  createDOMStructure() {
    const app = document.getElementById('app');
    if (!app) {
      throw new Error('App container not found');
    }

    app.innerHTML = `
      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
        <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
        <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
      </header>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
        <!-- Left Column: Product Selection & Cart -->
        <div id="left-column" class="bg-white border border-gray-200 p-8 overflow-y-auto">
          <div id="product-selector-container"></div>
          <div id="cart-items-container"></div>
        </div>

        <!-- Right Column: Order Summary -->
        <div id="right-column" class="bg-black text-white p-8 flex flex-col">
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
              </div>
            </div>
          </div>
          <button class="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
            Checkout
          </button>
          <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
            <span id="points-notice">Earn loyalty points with purchase.</span>
          </p>
        </div>
      </div>

      <!-- Special Promotions -->
      <div id="tuesday-special" class="mt-4 p-3 bg-white/10 rounded-lg hidden">
        <div class="flex items-center gap-2">
          <span class="text-purple-400">🎉</span>
          <span class="text-sm font-medium text-purple-400">화요일 특별 할인! 모든 상품 추가 10% 할인</span>
        </div>
      </div>

      <!-- Help Button -->
      <button id="help-button" class="fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </button>

      <!-- Help Modal -->
      <div id="help-modal" class="fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300">
        <div class="fixed right-0 top-0 h-full w-96 bg-white shadow-xl transform translate-x-full transition-transform duration-300 ease-in-out">
          <div class="p-6 h-full overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold">📖 이용 안내</h2>
              <button id="close-help" class="text-gray-500 hover:text-gray-700">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            ${this._getHelpContent()}
          </div>
        </div>
      </div>
    `;
  }

  _getHelpContent() {
    return `
      <div class="mb-6">
        <h3 class="text-base font-bold mb-3">💰 할인 정책</h3>
        <div class="space-y-3">
          <div class="bg-gray-50 p-3 rounded">
            <h4 class="font-medium">개별 상품 할인</h4>
            <p class="text-sm text-gray-600 mt-1">10개 이상 구매 시 상품별 할인율 적용</p>
          </div>
          <div class="bg-gray-50 p-3 rounded">
            <h4 class="font-medium">대량 구매 할인</h4>
            <p class="text-sm text-gray-600 mt-1">총 30개 이상 구매 시 25% 할인 (개별 할인 무시)</p>
          </div>
          <div class="bg-gray-50 p-3 rounded">
            <h4 class="font-medium">화요일 특별 할인</h4>
            <p class="text-sm text-gray-600 mt-1">화요일에 모든 구매에 추가 10% 할인</p>
          </div>
        </div>
      </div>
    `;
  }

  initializeWidgets() {
    // Product Selector Widget
    const productSelectorContainer = document.getElementById('product-selector-container');
    this.widgets.productSelector = new ProductSelectorWidget(
      productSelectorContainer,
      this.productRepo,
      (productId) => this.onProductSelect(productId),
      (productId) => this.onAddToCart(productId)
    );

    // Cart Widget (simplified for now, will be enhanced)
    const leftColumn = document.getElementById('left-column');
    const cartContainer = document.createElement('div');
    cartContainer.id = 'cart-widget-container';
    leftColumn.appendChild(cartContainer);
    
    this.widgets.cart = new CartWidget(
      document.getElementById('right-column'),
      this.cartService
    );

    this.updateUI();
  }

  setupPromotions() {
    // 프로모션 타이머 설정 (간소화된 버전)
    this.promotionService.setupPromotionTimers();
    
    // 화요일 배너 표시/숨김
    this.updateTuesdayBanner();
  }

  setupEventListeners() {
    // Help modal
    const helpButton = document.getElementById('help-button');
    const helpModal = document.getElementById('help-modal');
    const closeHelp = document.getElementById('close-help');
    const slidePanel = helpModal.querySelector('.fixed.right-0');

    helpButton.addEventListener('click', () => {
      helpModal.classList.remove('hidden');
      setTimeout(() => slidePanel.classList.remove('translate-x-full'), 10);
    });

    const closeModal = () => {
      slidePanel.classList.add('translate-x-full');
      setTimeout(() => helpModal.classList.add('hidden'), 300);
    };

    closeHelp.addEventListener('click', closeModal);
    helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) closeModal();
    });
  }

  onProductSelect(productId) {
    this.lastSelectedProduct = productId;
    
    // 추천 세일 로직 (간소화)
    if (Math.random() > 0.7) { // 30% 확률로 추천 세일 시작
      setTimeout(() => {
        this.promotionService.startSuggestSale(productId);
        this.widgets.productSelector.update();
      }, 1000);
    }
  }

  onAddToCart(productId) {
    try {
      this.cartService.addToCart(productId, 1);
      this.updateUI();
    } catch (error) {
      alert(error.message);
    }
  }

  updateUI() {
    const cartState = this.cartService.getCartState();
    
    // 아이템 개수 업데이트
    const itemCountElement = document.getElementById('item-count');
    if (itemCountElement) {
      itemCountElement.textContent = `🛍️ ${cartState.totalQuantity} items in cart`;
    }

    // 위젯들 업데이트
    if (this.widgets.cart) {
      this.widgets.cart.update();
    }

    if (this.widgets.productSelector) {
      this.widgets.productSelector.update();
    }

    // 포인트 공지 업데이트
    const pointsNotice = document.getElementById('points-notice');
    if (pointsNotice && !cartState.isEmpty) {
      pointsNotice.textContent = `적립 포인트: ${cartState.points}p`;
    }
  }

  updateTuesdayBanner() {
    const tuesdayBanner = document.getElementById('tuesday-special');
    const today = new Date();
    
    if (today.getDay() === 2) { // 화요일
      tuesdayBanner.classList.remove('hidden');
    } else {
      tuesdayBanner.classList.add('hidden');
    }
  }

  // Public API for external access (레거시 호환성)
  getProductRepository() {
    return this.productRepo;
  }

  getCartService() {
    return this.cartService;
  }

  getPromotionService() {
    return this.promotionService;
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.shoppingCartApp = new ShoppingCartApp();
});