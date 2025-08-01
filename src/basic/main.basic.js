// ============================================
// MAIN APPLICATION
// ============================================

import {
  PRODUCT_ONE,
  PRODUCT_TWO,
  PRODUCT_THREE,
  PRODUCT_FOUR,
  PRODUCT_FIVE,
} from './constants.js';
import { createSetupEventListeners } from './eventHandlers.js';
import { updateSelectOptions, calculateCart } from './uiUpdates.js';
// ============================================
// GLOBAL STATE
// ============================================

// 점진적 정리: 모든 상태 변수들을 객체로 분리
const AppState = {
  // 상품 관련 상태
  products: [],

  // 장바구니 상태
  cart: {
    bonusPoints: 0,
    itemCount: 0,
    totalAmount: 0,
    lastSelectedProduct: null,
  },

  // DOM 요소 참조 (점진적 정리 완료)
  elements: {
    productSelector: null,
    addButton: null,
    cartDisplay: null,
    stockInfo: null,
    summaryElement: null,
  },
};

// ============================================
// 안전한 전역 변수 접근 래퍼 함수들
// ============================================

// 안전한 함수 실행 래퍼
const safeExecute = (fn, fallback) => {
  try {
    return fn();
  } catch (error) {
    console.error('함수 실행 중 에러:', error);
    return fallback;
  }
};

// 초기화 상태 확인
export const ensureInitialized = () => true;

// 상품 목록 관리 (안전한 래퍼)
export const getProductList = () => {
  if (!AppState.products || !Array.isArray(AppState.products)) {
    console.warn('productList가 초기화되지 않았습니다');
    return [];
  }
  return AppState.products;
};

export const setProductList = (newProductList) => {
  if (!Array.isArray(newProductList)) {
    console.error('productList는 배열이어야 합니다');
    return;
  }
  AppState.products = newProductList;
};

// 장바구니 상태 관리 (안전한 래퍼)
export const getCartState = () =>
  safeExecute(
    () => ({
      itemCount: AppState.cart.itemCount,
      totalAmount: AppState.cart.totalAmount,
      lastSelectedProduct: AppState.cart.lastSelectedProduct,
      bonusPoints: AppState.cart.bonusPoints,
    }),
    { itemCount: 0, totalAmount: 0, lastSelectedProduct: null, bonusPoints: 0 },
  );

export const setCartState = (newState) => {
  if (newState.itemCount !== undefined) {
    AppState.cart.itemCount = newState.itemCount;
  }
  if (newState.totalAmount !== undefined) {
    AppState.cart.totalAmount = newState.totalAmount;
  }
  if (newState.lastSelectedProduct !== undefined) {
    AppState.cart.lastSelectedProduct = newState.lastSelectedProduct;
  }
  if (newState.bonusPoints !== undefined) {
    AppState.cart.bonusPoints = newState.bonusPoints;
  }
};

// DOM 요소 관리 (안전한 래퍼)
export const getDOMElements = () =>
  safeExecute(
    () => ({
      productSelector: AppState.elements.productSelector,
      addButton: AppState.elements.addButton,
      cartDisplay: AppState.elements.cartDisplay,
      stockInfo: AppState.elements.stockInfo,
      summaryElement: AppState.elements.summaryElement,
    }),
    {},
  );

export const setDOMElements = (elements) => {
  if (elements.productSelector) AppState.elements.productSelector = elements.productSelector;
  if (elements.addButton) AppState.elements.addButton = elements.addButton;
  if (elements.cartDisplay) AppState.elements.cartDisplay = elements.cartDisplay;
  if (elements.stockInfo) AppState.elements.stockInfo = elements.stockInfo;
  if (elements.summaryElement) AppState.elements.summaryElement = elements.summaryElement;
};

// 개별 상태 업데이트 함수들 (안전한 래퍼)
export const updateItemCount = (newCount) => {
  if (typeof newCount !== 'number' || newCount < 0) {
    console.error('itemCount는 0 이상의 숫자여야 합니다');
    return;
  }
  AppState.cart.itemCount = newCount;
};

export const updateTotalAmount = (newAmount) => {
  if (typeof newAmount !== 'number' || newAmount < 0) {
    console.error('totalAmount는 0 이상의 숫자여야 합니다');
    return;
  }
  AppState.cart.totalAmount = newAmount;
};

export const updateLastSelectedProduct = (productId) => {
  if (typeof productId !== 'string') {
    console.error('productId는 문자열이어야 합니다');
    return;
  }
  AppState.cart.lastSelectedProduct = productId;
};

// 호환성을 위한 기존 변수 참조 (점진적 제거 예정)
// const bonusPoints = AppState.cart.bonusPoints;
// const itemCount = AppState.cart.itemCount;
// const totalAmount = AppState.cart.totalAmount;
// const lastSelectedProduct = AppState.cart.lastSelectedProduct;

// ============================================
// TIMER FUNCTIONS
// ============================================

const setupLightningSaleTimer = () => {
  const lightningDelay = Math.random() * 10000;
  setTimeout(() => {
    setInterval(() => {
      const productList = getProductList();
      const luckyIndex = Math.floor(Math.random() * productList.length);
      const luckyProduct = productList[luckyIndex];

      if (luckyProduct.quantity > 0 && !luckyProduct.onSale) {
        luckyProduct.value = Math.round(luckyProduct.originalValue * 0.8);
        luckyProduct.onSale = true;
        alert(`⚡번개세일! ${luckyProduct.name}이(가) 20% 할인 중입니다!`);

        // 동적 import로 updateSelectOptions와 updatePricesInCart 가져오기
        import('./uiUpdates.js').then(({ updateSelectOptions, updatePricesInCart }) => {
          updateSelectOptions(getProductList, getDOMElements);
          updatePricesInCart(getProductList, getCartState, setCartState, getDOMElements);
        });
      }
    }, 30000);
  }, lightningDelay);
};

const setupRecommendationTimer = () => {
  setTimeout(() => {
    setInterval(() => {
      const elements = getDOMElements();
      if (elements.cartDisplay.children.length === 0) {
        return;
      }

      const { lastSelectedProduct } = getCartState();
      if (lastSelectedProduct) {
        const productList = getProductList();
        const suggestProduct = productList.find(
          (product) =>
            product.id !== lastSelectedProduct && product.quantity > 0 && !product.suggestSale,
        );

        if (suggestProduct) {
          alert(`💝 ${suggestProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          suggestProduct.value = Math.round(suggestProduct.value * 0.95);
          suggestProduct.suggestSale = true;

          // 동적 import로 updateSelectOptions와 updatePricesInCart 가져오기
          import('./uiUpdates.js').then(({ updateSelectOptions, updatePricesInCart }) => {
            updateSelectOptions(getProductList, getDOMElements);
            updatePricesInCart(getProductList, getCartState, setCartState, getDOMElements);
          });
        }
      }
    }, 60000);
  }, Math.random() * 20000);
};

// ============================================
// MAIN FUNCTION
// ============================================

const main = () => {
  // 초기화
  AppState.cart.totalAmount = 0;
  AppState.cart.itemCount = 0;
  AppState.cart.lastSelectedProduct = null;

  // 상품 목록 초기화는 나중에 setProductList로 처리

  // DOM 요소 생성
  const root = document.getElementById('app');

  // 헤더 생성
  const header = document.createElement('div');
  header.className = 'mb-8';
  header.innerHTML = `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
  `;

  // 상품 선택기 생성
  const productSelector = document.createElement('select');
  productSelector.id = 'product-select';
  productSelector.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';
  AppState.elements.productSelector = productSelector; // 전역 변수에 할당

  // 그리드 컨테이너 생성
  const gridContainer = document.createElement('div');
  gridContainer.className =
    'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';

  // 왼쪽 컬럼 생성
  const leftColumn = document.createElement('div');
  leftColumn.className = 'bg-white border border-gray-200 p-8 overflow-y-auto';

  // 선택기 컨테이너 생성
  const selectorContainer = document.createElement('div');
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';

  // 추가 버튼 생성
  const addButton = document.createElement('button');
  addButton.id = 'add-to-cart';
  addButton.innerHTML = 'Add to Cart';
  addButton.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';
  AppState.elements.addButton = addButton; // 전역 변수에 할당

  // 재고 정보 생성
  const stockInfo = document.createElement('div');
  stockInfo.id = 'stock-status';
  stockInfo.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';
  AppState.elements.stockInfo = stockInfo; // 전역 변수에 할당

  // 장바구니 표시 영역 생성
  const cartDisplay = document.createElement('div');
  cartDisplay.id = 'cart-items';
  AppState.elements.cartDisplay = cartDisplay; // 전역 변수에 할당

  // 오른쪽 컬럼 생성
  const rightColumn = document.createElement('div');
  rightColumn.className = 'bg-black text-white p-8 flex flex-col';
  rightColumn.innerHTML = `
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
  `;

  // 수동 오버레이 토글 버튼 생성
  const manualToggle = document.createElement('button');
  manualToggle.className =
    'fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50';
  manualToggle.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `;

  // 수동 오버레이 생성
  const manualOverlay = document.createElement('div');
  manualOverlay.className = 'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300';

  // 수동 컬럼 생성
  const manualColumn = document.createElement('div');
  manualColumn.className =
    'fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300';
  manualColumn.innerHTML = `
    <button class="absolute top-4 right-4 text-gray-500 hover:text-black" onclick="document.querySelector('.fixed.inset-0').classList.add('hidden'); this.parentElement.classList.add('translate-x-full')">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
    <h2 class="text-xl font-bold mb-4">📖 이용 안내</h2>
   
    <div class="mb-6">
      <h3 class="text-base font-bold mb-3">💰 할인 정책</h3>
      <div class="space-y-3">
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">개별 상품</p>
          <p class="text-gray-700 text-xs pl-2">
            • 키보드 10개↑: 10%<br>
            • 마우스 10개↑: 15%<br>
            • 모니터암 10개↑: 20%<br>
            • 스피커 10개↑: 25%
          </p>
        </div>
       
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">전체 수량</p>
          <p class="text-gray-700 text-xs pl-2">• 30개 이상: 25%</p>
        </div>
       
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">특별 할인</p>
          <p class="text-gray-700 text-xs pl-2">
            • 화요일: +10%<br>
            • ⚡번개세일: 20%<br>
            • 💝추천할인: 5%
          </p>
        </div>
      </div>
    </div>
   
    <div class="mb-6">
      <h3 class="text-base font-bold mb-3">🎁 포인트 적립</h3>
      <div class="space-y-3">
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">기본</p>
          <p class="text-gray-700 text-xs pl-2">• 구매액의 0.1%</p>
        </div>
       
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">추가</p>
          <p class="text-gray-700 text-xs pl-2">
            • 화요일: 2배<br>
            • 키보드+마우스: +50p<br>
            • 풀세트: +100p<br>
            • 10개↑: +20p / 20개↑: +50p / 30개↑: +100p
          </p>
        </div>
      </div>
    </div>
   
    <div class="border-t border-gray-200 pt-4 mt-4">
      <p class="text-xs font-bold mb-1">💡 TIP</p>
      <p class="text-2xs text-gray-600 leading-relaxed">
        • 화요일 대량구매 = MAX 혜택<br>
        • ⚡+💝 중복 가능<br>
        • 상품4 = 품절
      </p>
    </div>
  `;

  // 이벤트 리스너 설정
  manualToggle.onclick = () => {
    manualOverlay.classList.toggle('hidden');
    manualColumn.classList.toggle('translate-x-full');
  };

  manualOverlay.onclick = (e) => {
    if (e.target === manualOverlay) {
      manualOverlay.classList.add('hidden');
      manualColumn.classList.add('translate-x-full');
    }
  };

  // DOM에 요소들 추가
  selectorContainer.appendChild(productSelector);
  selectorContainer.appendChild(addButton);
  selectorContainer.appendChild(stockInfo);
  leftColumn.appendChild(selectorContainer);
  leftColumn.appendChild(cartDisplay);

  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  manualOverlay.appendChild(manualColumn);
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);

  // summaryElement 설정 (rightColumn에서 찾기)
  AppState.elements.summaryElement = rightColumn.querySelector('#cart-total');

  // 전역 변수 설정이 더 이상 필요하지 않음
  // 모든 상태는 래퍼 함수를 통해 접근

  // 초기화 순서 재구성 - 즉시 실행으로 테스트 호환성 확보
  // 1단계: 기본 초기화
  try {
    // 상품 목록 설정
    setProductList([
      {
        id: PRODUCT_ONE,
        name: '버그 없애는 키보드',
        value: 10000,
        originalValue: 10000,
        quantity: 50,
        onSale: false,
        suggestSale: false,
      },
      {
        id: PRODUCT_TWO,
        name: '생산성 폭발 마우스',
        value: 20000,
        originalValue: 20000,
        quantity: 30,
        onSale: false,
        suggestSale: false,
      },
      {
        id: PRODUCT_THREE,
        name: '거북목 탈출 모니터암',
        value: 30000,
        originalValue: 30000,
        quantity: 20,
        onSale: false,
        suggestSale: false,
      },
      {
        id: PRODUCT_FOUR,
        name: '에러 방지 노트북 파우치',
        value: 15000,
        originalValue: 15000,
        quantity: 0,
        onSale: false,
        suggestSale: false,
      },
      {
        id: PRODUCT_FIVE,
        name: '코딩할 때 듣는 Lo-Fi 스피커',
        value: 25000,
        originalValue: 25000,
        quantity: 10,
        onSale: false,
        suggestSale: false,
      },
    ]);

    // DOM 요소 설정
    setDOMElements({
      productSelector,
      addButton,
      cartDisplay,
      stockInfo,
      summaryElement: rightColumn.querySelector('#cart-total'),
    });
  } catch (error) {
    console.warn('기본 초기화 중 오류 발생:', error);
  }

  // 2단계: UI 업데이트 (즉시 실행)
  try {
    updateSelectOptions(getProductList, getDOMElements);
    calculateCart(getProductList, getCartState, setCartState, getDOMElements);
  } catch (error) {
    console.warn('UI 업데이트 중 오류 발생:', error);
  }

  // 3단계: 타이머 설정
  setupLightningSaleTimer();
  setupRecommendationTimer();

  // 4단계: 이벤트 리스너 설정 (즉시 실행)
  try {
    const setupEventListeners = createSetupEventListeners(
      getDOMElements,
      getProductList,
      updateLastSelectedProduct,
      getCartState,
      setCartState,
      calculateCart,
      updateSelectOptions,
    );
    setupEventListeners(addButton);
  } catch (error) {
    console.warn('이벤트 리스너 설정 중 오류 발생:', error);
  }
};

// ============================================
// INITIALIZATION
// ============================================

main();
