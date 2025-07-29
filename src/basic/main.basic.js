import {
  DISCOUNT_RATES,
  THRESHOLDS,
  POINT_BONUSES,
  TIMERS,
  DAYS,
  PRODUCT_PRICES,
  INITIAL_STOCK,
  UI_CONSTANTS,
  // BONUS_RULES,
} from './constant';
import { Header, updateHeader } from './components/Header.js';

import {
  hasKeyboardMouseSet,
  hasFullProductSet,
} from './utils/validationUtils.js';
// import { generateStockWarningMessage } from './utils/stockUtils.js';
// import { updateStockInfoUI } from './components/StockInfo.js';
// import { calculateCartSubtotal } from './services/calculationService.js';
import { handleCalculateCartStuff } from './services/cartService.js';
import { calculateFinalDiscounts } from './services/calculationService.js';
// import { renderBonusPoints } from './services/pointService.js';
// import { shouldApplyTuesdayDiscount } from './utils/conditionUtils.js';

// ==========================================
// 🚀 Phase 2: 전역변수 → 상태 관리 패턴 (React 준비)
// ==========================================

/**
 * 애플리케이션 상태 (React useState 패턴 준비)
 * @typedef {Object} AppState
 * @property {Array} products - 상품 목록
 * @property {Object} cart - 장바구니 상태
 * @property {string|null} lastSelected - 마지막 선택 상품 ID
 */
const appState = {
  products: [], // prodList 대체
  cart: {
    totalAmount: 0, // totalAmt 대체
    itemCount: 0, // itemCnt 대체
    bonusPoints: 0, // bonusPts 대체
  },
  lastSelected: null, // lastSel 대체
};

/**
 * UI 요소 레퍼런스 (React useRef 패턴 준비)
 * @typedef {Object} UIElements
 * @property {HTMLElement|null} stockInfo - 재고 정보 표시 요소
 * @property {HTMLSelectElement|null} productSelect - 상품 선택 드롭다운
 * @property {HTMLButtonElement|null} addButton - 장바구니 추가 버튼
 * @property {HTMLElement|null} cartDisplay - 장바구니 표시 영역
 * @property {HTMLElement|null} orderSummary - 주문 요약 영역
 */
const uiElements = {
  stockInfo: null, // stockInfo 대체
  productSelect: null, // sel 대체
  addButton: null, // addBtn 대체
  cartDisplay: null, // cartDisp 대체
  orderSummary: null, // sum 대체 (새로 추가)
};

// 🏷️ 상품 ID 상수
const PRODUCT_ONE = 'p1';
const PRODUCT_TWO = 'p2';
const PRODUCT_THREE = 'p3';
const PRODUCT_FOUR = 'p4';
const PRODUCT_FIVE = 'p5';

// ==========================================
// 🚀 Phase 4: 중복코드 제거 (DRY 원칙 적용)
// ==========================================

/**
 * 🤖 [AI-REFACTORED] ID로 상품 찾기 (중복 제거 유틸리티)
 *
 * @description 상품 ID를 통해 상품 객체를 조회하는 공통 유틸리티 함수
 *
 * 🎯 DRY 원칙 적용:
 * - 8곳에서 반복되던 for-loop + id 체크 로직을 하나로 통합
 * - 성능 개선: find() 메서드로 조기 종료
 * - 가독성 향상: 의도가 명확한 함수명
 *
 * @param {string} productId - 찾을 상품의 ID
 * @returns {Object|null} 찾은 상품 객체 또는 null
 */
const findProductById = productId => {
  return appState.products.find(product => product.id === productId) || null;
};

/**
 * 🤖 [AI-REFACTORED] 장바구니 아이템의 수량 조회 (중복 제거 유틸리티)
 *
 * @description DOM 요소에서 수량 정보를 추출하는 공통 유틸리티 함수
 *
 * 🎯 DRY 원칙 적용:
 * - 5곳에서 반복되던 querySelector + parseInt 로직 통합
 * - 에러 처리 추가: 요소가 없는 경우 기본값 반환
 *
 * @param {HTMLElement} cartItemElement - 장바구니 아이템 DOM 요소
 * @returns {number} 수량 (기본값: 0)
 */
const getCartItemQuantity = cartItemElement => {
  const qtyElem = cartItemElement.querySelector('.quantity-number');
  return qtyElem ? parseInt(qtyElem.textContent) : 0;
};

/**
 * 🤖 [AI-REFACTORED] 할인 상태에 따른 상품명 텍스트 생성 (중복 제거 유틸리티)
 *
 * @description 상품의 할인 상태에 따라 적절한 아이콘과 텍스트를 생성
 *
 * 🎯 DRY 원칙 적용:
 * - 여러 곳에서 반복되던 할인 아이콘 로직 통합
 * - 가독성 향상: 할인 상태 판단 로직 분리
 *
 * @param {Object} product - 상품 객체
 * @returns {string} 할인 아이콘이 포함된 상품명
 */
const getDiscountedProductName = product => {
  // 🎯 데이터 기반 할인 아이콘 생성 (중복 조건 개선)
  const icons = [];
  if (product.onSale) {
    icons.push('⚡');
  }
  if (product.suggestSale) {
    icons.push('💝');
  }

  return icons.length > 0 ? `${icons.join('')}${product.name}` : product.name;
};

/**
 * 🤖 [AI-REFACTORED] 할인 상태에 따른 가격 HTML 생성 (중복 제거 유틸리티)
 *
 * @description 상품의 할인 상태에 따라 적절한 가격 표시 HTML을 생성
 *
 * 🎯 DRY 원칙 적용:
 * - 여러 곳에서 반복되던 가격 표시 로직 통합
 * - CSS 클래스와 색상 관리 중앙화
 *
 * @param {Object} product - 상품 객체
 * @returns {string} 할인 가격이 표시된 HTML
 */
const getDiscountedPriceHTML = product => {
  // 🧠 복잡한 조건 → 의미있는 함수로 개선
  const getDiscountColor = () => {
    if (hasBothDiscounts(product)) {
      return 'text-purple-600';
    }
    if (hasOnSaleOnly(product)) {
      return 'text-red-500';
    }
    if (hasSuggestSaleOnly(product)) {
      return 'text-blue-500';
    }
    return null;
  };

  const discountColor = getDiscountColor();
  if (discountColor) {
    return `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="${discountColor}">₩${product.val.toLocaleString()}</span>`;
  }

  return `₩${product.val.toLocaleString()}`;
};

// ==========================================
// 🧠 복잡한 조건문을 의미있는 함수로 분리
// ==========================================

/**
 * 🤖 [AI-REFACTORED] 번개 할인 적용 가능 여부 확인
 * @param {Object} item - 상품 객체
 * @returns {boolean} 번개 할인 적용 가능하면 true
 */
const canApplyLightningDiscount = item => item.quantity > 0 && !item.onSale;

/**
 * 🤖 [AI-REFACTORED] 화요일 보너스 적용 가능 여부 확인
 * @param {number} basePoints - 기본 포인트
 * @returns {boolean} 화요일 보너스 적용 가능하면 true
 */
const shouldApplyTuesdayBonus = basePoints => {
  // ⚡ 성능 최적화: Date 객체 캐싱
  const isTuesday = new Date().getDay() === DAYS.TUESDAY;
  return isTuesday && basePoints > 0;
};

/**
 * 🤖 [AI-REFACTORED] 유효한 수량 변경인지 확인
 * @param {number} newQty - 새로운 수량
 * @param {Object} product - 상품 객체
 * @param {number} currentQty - 현재 수량
 * @returns {boolean} 유효한 수량 변경이면 true
 */
const isValidQuantityChange = (newQty, product, currentQty) =>
  newQty > 0 && newQty <= product.quantity + currentQty;

/**
 * 🤖 [AI-REFACTORED] 할인 정보 표시 가능 여부 확인
 * @param {number} discountRate - 할인율
 * @param {number} finalAmount - 최종 금액
 * @returns {boolean} 할인 정보 표시 가능하면 true
 */
const shouldShowDiscount = (discountRate, finalAmount) =>
  discountRate > 0 && finalAmount > 0;

/**
 * 🤖 [AI-REFACTORED] 화요일 할인 적용 가능 여부 확인
 * @param {boolean} isTuesday - 화요일 여부
 * @param {number} finalAmount - 최종 금액
 * @returns {boolean} 화요일 할인 적용 가능하면 true
 */

/**
 * 🤖 [AI-REFACTORED] 할인 상태 체크 함수들
 * @param {Object} product - 상품 객체
 * @returns {boolean} 해당 할인 상태면 true
 */
const hasBothDiscounts = product => product.onSale && product.suggestSale;
const hasOnSaleOnly = product => product.onSale && !product.suggestSale;
const hasSuggestSaleOnly = product => !product.onSale && product.suggestSale;

// ==========================================
// 🚀 단순한 DOM 요소 캐시 (중복 제거용)
// ==========================================

/**
 * 🤖 [AI-REFACTORED] 자주 사용되는 DOM 요소들 캐시
 *
 * 🎯 목적: 동일한 getElementById 호출 중복 제거
 * - loyaltyPoints: 3곳에서 사용
 * - itemCount: 2곳에서 사용
 * - 나머지: 1곳씩이지만 통일성 위해 포함
 */
const domElements = {
  loyaltyPoints: null,
  summaryDetails: null,
  tuesdaySpecial: null,
  discountInfo: null,
};

/**
 * 🤖 [AI-REFACTORED] 애플리케이션 상태 초기화
 *
 * @description 앱 시작시 필요한 상태 데이터를 설정
 * - 장바구니 상태 초기화 (총액, 수량, 포인트)
 * - 상품 목록 데이터 설정
 * - 마지막 선택 상품 초기화
 */
function initializeAppState() {
  // 🚀 애플리케이션 상태 초기화 (장바구니, 포인트, 선택 상태)
  appState.cart.totalAmount = UI_CONSTANTS.INITIAL_CART_AMOUNT;
  appState.cart.itemCount = UI_CONSTANTS.INITIAL_CART_COUNT;
  appState.cart.bonusPoints = UI_CONSTANTS.INITIAL_BONUS_POINTS;
  appState.lastSelected = null;

  // 📦 상품 목록 데이터 설정 (가격, 재고, 할인 상태 초기화)
  appState.products = [
    {
      id: PRODUCT_ONE,
      name: '버그 없애는 키보드',
      val: PRODUCT_PRICES.KEYBOARD,
      originalVal: PRODUCT_PRICES.KEYBOARD,
      quantity: INITIAL_STOCK.KEYBOARD,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_TWO,
      name: '생산성 폭발 마우스',
      val: PRODUCT_PRICES.MOUSE,
      originalVal: PRODUCT_PRICES.MOUSE,
      quantity: INITIAL_STOCK.MOUSE,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_THREE,
      name: '거북목 탈출 모니터암',
      val: PRODUCT_PRICES.MONITOR_ARM,
      originalVal: PRODUCT_PRICES.MONITOR_ARM,
      quantity: INITIAL_STOCK.MONITOR_ARM,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_FOUR,
      name: '에러 방지 노트북 파우치',
      val: PRODUCT_PRICES.POUCH,
      originalVal: PRODUCT_PRICES.POUCH,
      quantity: INITIAL_STOCK.POUCH,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_FIVE,
      name: '코딩할 때 듣는 Lo-Fi 스피커',
      val: PRODUCT_PRICES.SPEAKER,
      originalVal: PRODUCT_PRICES.SPEAKER,
      quantity: INITIAL_STOCK.SPEAKER,
      onSale: false,
      suggestSale: false,
    },
  ];
}

/**
 * 앱 전체 초기화 및 UI 생성
 *
 * @description 쇼핑카트 애플리케이션의 전체 초기화를 담당
 * - 제품 목록 초기화
 * - DOM 요소들 생성 및 배치
 * - 이벤트 리스너 설정
 * - 번개세일 및 추천 상품 타이머 설정
 *
 * @sideEffects
 * - 전역변수 수정 (prodList, totalAmt, itemCnt 등)
 * - DOM 조작 (app 요소에 UI 추가)
 * - 타이머 설정 (번개세일, 추천상품)
 */
function main() {
  const root = document.getElementById('app');
  const gridContainer = document.createElement('div');
  const leftColumn = document.createElement('div');
  const selectorContainer = document.createElement('div');
  const manualToggle = document.createElement('button');
  const manualOverlay = document.createElement('div');
  const manualColumn = document.createElement('div');
  const lightningDelay = Math.random() * TIMERS.MAX_LIGHTNING_DELAY;

  // 1️⃣ 상태 초기화
  initializeAppState();

  // 2️⃣ DOM 구조 생성
  // 🏷️ 메인 헤더 섹션 생성 (헤더 컴포넌트 사용)
  const headerComponent = Header(0);

  // 🛒 상품 선택 영역 생성 (드롭다운 + 추가 버튼)
  uiElements.productSelect = document.createElement('select');
  uiElements.productSelect.id = 'product-select';
  uiElements.productSelect.className =
    'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';

  uiElements.addButton = document.createElement('button');
  uiElements.addButton.id = 'add-to-cart';
  uiElements.addButton.innerHTML = 'Add to Cart';
  uiElements.addButton.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';

  uiElements.stockInfo = document.createElement('div');
  uiElements.stockInfo.id = 'stock-status';
  uiElements.stockInfo.className =
    'text-xs text-red-500 mt-3 whitespace-pre-line';

  // 🎨 메인 레이아웃 구성 (좌측 카트 + 우측 요약)
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';
  selectorContainer.appendChild(uiElements.productSelect);
  selectorContainer.appendChild(uiElements.addButton);
  selectorContainer.appendChild(uiElements.stockInfo);

  leftColumn.className = 'bg-white border border-gray-200 p-8 overflow-y-auto';
  leftColumn.appendChild(selectorContainer);

  uiElements.cartDisplay = document.createElement('div');
  uiElements.cartDisplay.id = 'cart-items';
  leftColumn.appendChild(uiElements.cartDisplay);

  // 📋 주문 요약 영역 생성 (총액, 할인, 포인트 표시)
  uiElements.orderSummary = document.createElement('div');
  uiElements.orderSummary.className = 'bg-black text-white p-8 flex flex-col';
  uiElements.orderSummary.innerHTML = `
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

  // 🔲 메인 그리드 구성 (2열 레이아웃: 카트 + 요약)
  gridContainer.className =
    'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';
  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(uiElements.orderSummary);

  // 💡 도움말 버튼 및 모달 생성 (사용법 안내)
  manualToggle.className =
    'fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50';
  manualToggle.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `;

  manualOverlay.className =
    'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300';
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
            • 키보드 ${THRESHOLDS.ITEM_DISCOUNT_MIN}개↑: ${DISCOUNT_RATES.KEYBOARD * 100}%<br>
            • 마우스 ${THRESHOLDS.ITEM_DISCOUNT_MIN}개↑: ${DISCOUNT_RATES.MOUSE * 100}%<br>
            • 모니터암 ${THRESHOLDS.ITEM_DISCOUNT_MIN}개↑: ${DISCOUNT_RATES.MONITOR_ARM * 100}%<br>
            • 스피커 ${THRESHOLDS.ITEM_DISCOUNT_MIN}개↑: ${DISCOUNT_RATES.SPEAKER * 100}%
          </p>
        </div>
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">전체 수량</p>
          <p class="text-gray-700 text-xs pl-2">• ${THRESHOLDS.BULK_DISCOUNT_MIN}개 이상: ${DISCOUNT_RATES.BULK_DISCOUNT * 100}%</p>
        </div>
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">특별 할인</p>
          <p class="text-gray-700 text-xs pl-2">
            • 화요일: +${DISCOUNT_RATES.TUESDAY_DISCOUNT * 100}%<br>
            • ⚡번개세일: ${DISCOUNT_RATES.LIGHTNING_SALE * 100}%<br>
            • 💝추천할인: ${DISCOUNT_RATES.SUGGEST_SALE * 100}%
          </p>
        </div>
      </div>
    </div>
    <div class="mb-6">
      <h3 class="text-base font-bold mb-3">🎁 포인트 적립</h3>
      <div class="space-y-3">
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">기본</p>
          <p class="text-gray-700 text-xs pl-2">• 구매액의 ${((1 / THRESHOLDS.POINTS_PER_WON) * 100).toFixed(1)}%</p>
        </div>
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">추가</p>
          <p class="text-gray-700 text-xs pl-2">
            • 화요일: ${POINT_BONUSES.TUESDAY_MULTIPLIER}배<br>
            • 키보드+마우스: +${POINT_BONUSES.KEYBOARD_MOUSE_SET}p<br>
            • 풀세트: +${POINT_BONUSES.FULL_SET}p<br>
            • ${THRESHOLDS.ITEM_DISCOUNT_MIN}개↑: +${POINT_BONUSES.BULK_10}p / ${THRESHOLDS.BULK_20_MIN}개↑: +${POINT_BONUSES.BULK_20}p / ${THRESHOLDS.BULK_DISCOUNT_MIN}개↑: +${POINT_BONUSES.BULK_30}p
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

  // 🎯 이벤트 리스너 설정 (클릭, 변경 이벤트)
  manualToggle.onclick = function () {
    manualOverlay.classList.toggle('hidden');
    manualColumn.classList.toggle('translate-x-full');
  };

  manualOverlay.onclick = function (event) {
    if (event.target === manualOverlay) {
      manualOverlay.classList.add('hidden');
      manualColumn.classList.add('translate-x-full');
    }
  };

  // 🔗 DOM 요소 연결 및 애플리케이션 시작
  manualOverlay.appendChild(manualColumn);
  root.appendChild(headerComponent);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);

  // 3️⃣ DOM 요소 캐시 초기화 (단순하게)
  domElements.loyaltyPoints = document.getElementById('loyalty-points');
  domElements.summaryDetails = document.getElementById('summary-details');
  domElements.tuesdaySpecial = document.getElementById('tuesday-special');
  domElements.discountInfo = document.getElementById('discount-info');

  // 4️⃣ 초기 계산 및 UI 업데이트
  updateProductSelectUI();
  handleCalculateCartStuff(
    appState,
    uiElements,
    domElements,
    getCartItemQuantity,
    getTotalStock,
    calculateFinalDiscounts,
    updateOrderSummaryUI,
    updateTotalAndDiscountUI,
    updateHeader,
    findProductById,
    hasKeyboardMouseSet,
    hasFullProductSet,
    shouldApplyTuesdayBonus,
  );

  // 4️⃣ 타이머 설정
  setTimeout(() => {
    setInterval(() => {
      const luckyIdx = Math.floor(Math.random() * appState.products.length);
      const luckyItem = appState.products[luckyIdx];
      // 🧠 복잡한 조건 → 의미있는 함수로 개선
      if (canApplyLightningDiscount(luckyItem)) {
        luckyItem.val = Math.round(
          luckyItem.originalVal * (1 - DISCOUNT_RATES.LIGHTNING_SALE),
        );
        luckyItem.onSale = true;
        alert(
          `⚡번개세일! ${luckyItem.name}이(가) ${DISCOUNT_RATES.LIGHTNING_SALE * 100}% 할인 중입니다!`,
        );
        updateProductSelectUI();
        updateCartPricesUI();
      }
    }, TIMERS.LIGHTNING_SALE_INTERVAL);
  }, lightningDelay);

  setTimeout(() => {
    setInterval(() => {
      if (uiElements.cartDisplay.children.length === 0) {
        return;
      }
      if (appState.lastSelected) {
        // 🎯 for문 → find() 메서드로 현대화
        const suggest = appState.products.find(
          product =>
            product.id !== appState.lastSelected &&
            product.quantity > 0 &&
            !product.suggestSale,
        );
        if (suggest) {
          alert(
            `💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 ${DISCOUNT_RATES.SUGGEST_SALE * 100}% 추가 할인!`,
          );
          suggest.val = Math.round(
            suggest.val * (1 - DISCOUNT_RATES.SUGGEST_SALE),
          );
          suggest.suggestSale = true;
          updateProductSelectUI();
          updateCartPricesUI();
        }
      }
    }, TIMERS.SUGGEST_SALE_INTERVAL);
  }, Math.random() * TIMERS.MAX_INITIAL_DELAY);
}

/**
 * 상품 선택 옵션 업데이트 (React 패턴 네이밍)
 *
 * @description 제품 목록을 기반으로 선택 드롭다운의 옵션들을 동적으로 생성/업데이트
 * - 재고 상태에 따른 옵션 표시 (품절, 할인 등)
 * - 세일 및 추천 상품 표시 (⚡, 💝 아이콘)
 * - 재고 부족시 드롭다운 테두리 색상 변경 (주황색)
 *
 * 🎯 네이밍 개선: onUpdateSelectOptions → updateProductSelectUI
 * - React 패턴: update + 대상 + UI
 * - 의미 명확화: 상품 선택 UI 업데이트
 *
 * @sideEffects
 * - productSelect 요소의 innerHTML 수정
 * - productSelect 요소의 style.borderColor 수정
 */
const updateProductSelectUI = () => {
  uiElements.productSelect.innerHTML = '';

  // 🎯 for문 → reduce() 메서드로 현대화 (의미없는 변수명도 개선)
  const totalStock = appState.products.reduce(
    (stockSum, product) => stockSum + product.quantity,
    0,
  );
  // 🎯 for문 + IIFE → forEach() 메서드로 현대화
  appState.products.forEach(product => {
    const option = document.createElement('option');
    option.value = product.id;

    let discountText = '';
    if (product.onSale) {
      discountText += ' ⚡SALE';
    }
    if (product.suggestSale) {
      discountText += ' 💝추천';
    }

    if (product.quantity === 0) {
      option.textContent = `${product.name} - ${product.val}원 (품절)${discountText}`;
      option.disabled = true;
      option.className = 'text-gray-400';
    } else {
      // 🧠 복잡한 조건 → 의미있는 함수로 개선
      if (hasBothDiscounts(product)) {
        option.textContent = `⚡💝${product.name} - ${product.originalVal}원 → ${
          product.val
        }원 (25% SUPER SALE!)`;
        option.className = 'text-purple-600 font-bold';
      } else if (product.onSale) {
        option.textContent = `⚡${product.name} - ${product.originalVal}원 → ${
          product.val
        }원 (20% SALE!)`;
        option.className = 'text-red-500 font-bold';
      } else if (product.suggestSale) {
        option.textContent = `💝${product.name} - ${product.originalVal}원 → ${
          product.val
        }원 (5% 추천할인!)`;
        option.className = 'text-blue-500 font-bold';
      } else {
        option.textContent = `${product.name} - ${product.val}원${discountText}`;
      }
    }

    uiElements.productSelect.appendChild(option);
  });
  if (totalStock < THRESHOLDS.STOCK_ALERT_THRESHOLD) {
    uiElements.productSelect.style.borderColor = 'orange';
  } else {
    uiElements.productSelect.style.borderColor = '';
  }
};

/**
 * 🤖 [AI-REFACTORED] 주문 요약 UI 업데이트 (SRP 적용)
 *
 * @description 장바구니 아이템별 상세 내역을 UI에 표시
 *
 * 🎯 SRP 적용:
 * - 단일 책임: 주문 요약 UI 업데이트만 담당
 * - DOM 조작만 처리
 * - 비즈니스 로직 배제
 *
 * @param {HTMLCollection} cartItems - 장바구니 DOM 요소들
 * @param {Array} products - 상품 목록
 * @param {number} subTotal - 소계
 * @param {Array} itemDiscounts - 개별 상품 할인 정보
 * @param {number} itemCount - 총 아이템 수
 * @param {boolean} isTuesdayApplied - 화요일 할인 적용 여부
 */
function updateOrderSummaryUI(
  cartItems,
  products,
  subTotal,
  itemDiscounts,
  itemCount,
  isTuesdayApplied,
) {
  // 🎯 캐시된 DOM 요소 사용 (중복 제거로 성능 향상)
  const { summaryDetails } = domElements;

  // 🚀 주문 요약 초기화 (기존 내용 삭제)
  summaryDetails.innerHTML = '';

  if (subTotal <= 0) {
    return;
  }

  // 🎯 성능 개선: Map으로 O(1) 검색
  const productMap = new Map();
  for (const product of products) {
    productMap.set(product.id, product);
  }

  // 📋 아이템별 상세 내역 (Array.from() + forEach()로 현대화)
  Array.from(cartItems).forEach(cartItem => {
    const product = productMap.get(cartItem.id);
    if (!product) {
      return; // 🛡️ Guard Clause: 유효하지 않은 상품은 건너뛰기
    }

    // 🎯 DRY 적용: 중복 제거된 유틸리티 사용
    const quantity = getCartItemQuantity(cartItem);
    const itemTotal = product.val * quantity;

    summaryDetails.innerHTML += `
      <div class="flex justify-between text-xs tracking-wide text-gray-400">
        <span>${product.name} x ${quantity}</span>
        <span>₩${itemTotal.toLocaleString()}</span>
      </div>
    `;
  });

  // 💰 소계 표시 (할인 적용 전 원래 금액)
  summaryDetails.innerHTML += `
    <div class="border-t border-white/10 my-3"></div>
    <div class="flex justify-between text-sm tracking-wide">
      <span>Subtotal</span>
      <span>₩${subTotal.toLocaleString()}</span>
    </div>
  `;

  // 🎯 할인 정보 표시 (개별 + 대량 + 화요일 할인)
  if (itemCount >= THRESHOLDS.BULK_DISCOUNT_MIN) {
    summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (${THRESHOLDS.BULK_DISCOUNT_MIN}개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
  } else if (itemDiscounts.length > 0) {
    itemDiscounts.forEach(item => {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
                      <span class="text-xs">${item.name} (${THRESHOLDS.ITEM_DISCOUNT_MIN}개↑)</span>
          <span class="text-xs">-${item.discount}%</span>
        </div>
      `;
    });
  }

  // 🌟 화요일 특가 할인 표시 (10% 추가 할인)
  if (isTuesdayApplied) {
    summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-${DISCOUNT_RATES.TUESDAY_DISCOUNT * 100}%</span>
          </div>
        `;
  }

  // 🚚 배송비 표시 (무료 배송 기준)
  summaryDetails.innerHTML += `
    <div class="flex justify-between text-sm tracking-wide text-gray-400">
      <span>Shipping</span>
      <span>Free</span>
    </div>
  `;
}

/**
 * 🤖 [AI-REFACTORED] 총액 및 할인 정보 UI 업데이트 (SRP 적용)
 *
 * @description 총액, 포인트, 할인 정보를 UI에 표시
 *
 * 🎯 SRP 적용:
 * - 단일 책임: 총액 관련 UI 업데이트만 담당
 *
 * @param {number} finalAmount - 최종 금액
 * @param {number} discountRate - 할인율
 * @param {number} originalTotal - 원래 총액
 * @param {boolean} isTuesdayApplied - 화요일 할인 적용 여부
 */
function updateTotalAndDiscountUI(
  finalAmount,
  discountRate,
  originalTotal,
  isTuesdayApplied,
) {
  // 💰 총액 업데이트 (최종 결제 금액)
  const totalDiv = uiElements.orderSummary.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = `₩${finalAmount.toLocaleString()}`;
  }

  // 🎁 포인트 표시 업데이트 (캐시된 DOM 사용으로 성능 향상)
  // 🛡️ Guard Clause: DOM 요소가 있을 때만 포인트 업데이트 (원래 중첩 제거)
  const loyaltyPointsDiv = domElements.loyaltyPoints;
  if (loyaltyPointsDiv) {
    // ⚡ 성능 최적화: Math 함수 캐싱
    const points = Math.floor(finalAmount / THRESHOLDS.POINTS_PER_WON);
    loyaltyPointsDiv.textContent = `적립 포인트: ${points}p`;
    loyaltyPointsDiv.style.display = 'block';
  }

  // 🎯 할인 정보 업데이트 (캐시된 DOM 사용으로 성능 향상)
  const discountInfoDiv = domElements.discountInfo;
  discountInfoDiv.innerHTML = '';

  // 🧠 복잡한 조건 → 의미있는 함수로 개선
  if (shouldShowDiscount(discountRate, finalAmount)) {
    const savedAmount = originalTotal - finalAmount;
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discountRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }

  // 🌟 화요일 특가 표시 업데이트 (캐시된 DOM 사용으로 성능 향상)
  const { tuesdaySpecial } = domElements;
  if (isTuesdayApplied) {
    tuesdaySpecial.classList.remove('hidden');
  } else {
    tuesdaySpecial.classList.add('hidden');
  }
}

/**
 * 🤖 [AI-REFACTORED] 재고 부족 알림 생성 (SRP 적용)
 *
 * @description 재고 부족 상품들의 알림 메시지를 생성
 *
 * 🎯 SRP 적용:
 * - 단일 책임: 재고 알림 메시지 생성만 담당
 * - 순수 함수: DOM 조작 없음
 *
 * @param {Array} products - 상품 목록
 * @returns {string} 재고 알림 메시지
 */

/**
 * 장바구니 총 계산 및 UI 업데이트 (리팩토링된 함수)
 *
 * @description 장바구니의 모든 계산과 UI 업데이트를 담당하는 복합 함수
 *
 * 주요 기능:
 * - 소계 계산 (각 상품 가격 × 수량)
 * - 개별 상품 할인 계산 (10개 이상시 상품별 할인율 적용)
 * - 대량구매 할인 (30개 이상시 25% 할인)
 * - 화요일 특가 추가 할인 (10% 추가)
 * - 적립 포인트 계산
 * - 주문 요약 UI 업데이트
 * - 재고 부족 알림 업데이트
 *
 * @warning 이 함수는 SRP(단일 책임 원칙)을 위반하고 있음
 * - 계산 로직과 UI 로직이 섞여 있음
 * - 150줄 이상의 거대 함수
 * - 테스트 및 디버깅이 어려움
 *
 * @sideEffects
 * - 전역변수 수정 (totalAmt, itemCnt)
 * - DOM 요소들 대량 수정 (summary-details, cart-total, loyalty-points 등)
 * - 다른 함수 호출 (updateStockInfoUI, renderBonusPoints)
 */

/**
 * 보너스 포인트 렌더링 (React 패턴 네이밍)
 *
 * @description 구매 금액과 특별 조건에 따라 적립 포인트를 계산하고 UI에 표시
 *
 * 포인트 적립 규칙:
 * - 기본: 구매액의 0.1% (1000원당 1포인트)
 * - 화요일: 기본 포인트 2배
 * - 키보드+마우스 세트: +50포인트
 * - 풀세트 구매 (키보드+마우스+모니터암): +100포인트 추가
 * - 대량구매: 10개↑ +20p, 20개↑ +50p, 30개↑ +100p
 *
 * 🎯 네이밍 개선: doRenderBonusPoints → renderBonusPoints
 * - React 패턴: render + 대상
 * - 함수 선언 통일: const 화살표 함수
 *
 * @sideEffects
 * - 전역 상태 수정 (appState.cart.bonusPoints)
 * - DOM 수정 (loyalty-points 요소의 innerHTML, style.display)
 */

/**
 * 전체 재고 수량 계산 (React 패턴 네이밍)
 *
 * @description 모든 제품의 재고 수량을 합산하여 반환
 *
 * 🎯 네이밍 개선: onGetStockTotal → getTotalStock
 * - React 패턴: get + 대상
 * - 함수 선언 통일: const 화살표 함수
 * - 의미 명확화: 총 재고량 조회
 *
 * @returns {number} 전체 재고 수량의 합계
 *
 * @example
 * const totalStock = getTotalStock();
 * console.log(`총 재고: ${totalStock}개`);
 */
const getTotalStock = () => {
  // 🎯 for문 → reduce() 메서드로 현대화 (의미없는 변수명도 제거)
  return appState.products.reduce(
    (totalStock, product) => totalStock + product.quantity,
    0,
  );
};

/**
 * 재고 정보 UI 업데이트 (React 패턴 네이밍)
 *
 * @description 각 제품의 재고 상태를 확인하여 부족/품절 알림 메시지를 생성하고 UI에 표시
 *
 * 알림 조건:
 * - 재고 5개 미만: "재고 부족 (N개 남음)" 메시지 표시
 * - 재고 0개: "품절" 메시지 표시
 * - 전체 재고 30개 미만: 추가 로직 실행 (현재 빈 구현)
 *
 * 🎯 네이밍 개선: handleStockInfoUpdate → updateStockInfoUI
 * - React 패턴: update + 대상 + UI
 * - 함수 선언 통일: const 화살표 함수
 *
 * @sideEffects
 * - stockInfo 요소의 textContent 수정
 */

/**
 * 장바구니 가격 UI 업데이트 (React 패턴 네이밍)
 *
 * @description 번개세일이나 추천할인이 적용된 상품들의 장바구니 내 가격과 이름을 업데이트
 *
 * 업데이트 내용:
 * - 상품명에 할인 아이콘 추가 (⚡번개세일, 💝추천할인, ⚡💝동시할인)
 * - 가격 표시를 원가 취소선 + 할인가로 변경
 * - 할인 상태에 따른 색상 변경 (빨강/파랑/보라)
 *
 * 🎯 네이밍 개선: doUpdatePricesInCart → updateCartPricesUI
 * - React 패턴: update + 대상 + UI
 * - 함수 선언 통일: const 화살표 함수
 *
 * @sideEffects
 * - 장바구니 아이템들의 가격 표시 DOM 수정
 * - 상품명 텍스트 수정
 * - handleCalculateCartStuff() 함수 호출로 전체 계산 재실행
 */
const updateCartPricesUI = () => {
  const cartItems = uiElements.cartDisplay.children;
  // 🎯 for문 → Array.from() + forEach() 메서드로 현대화
  Array.from(cartItems).forEach(cartItem => {
    const product = findProductById(cartItem.id);
    if (product) {
      const priceDiv = cartItem.querySelector('.text-lg');
      const nameDiv = cartItem.querySelector('h3');

      // 🎯 DRY 적용: 중복 제거된 유틸리티 사용
      priceDiv.innerHTML = getDiscountedPriceHTML(product);
      nameDiv.textContent = getDiscountedProductName(product);
    }
  });
  handleCalculateCartStuff(
    appState,
    uiElements,
    domElements,
    getCartItemQuantity,
    getTotalStock,
    calculateFinalDiscounts,
    updateOrderSummaryUI,
    updateTotalAndDiscountUI,
    updateHeader,
    findProductById,
    hasKeyboardMouseSet,
    hasFullProductSet,
    shouldApplyTuesdayBonus,
  );
};
main();
uiElements.addButton.addEventListener('click', () => {
  const selItem = uiElements.productSelect.value;
  // 🎯 DRY 적용: 중복 제거된 유틸리티 사용
  const itemToAdd = findProductById(selItem);
  // 🛡️ Guard Clause: 선택된 아이템이 없거나 유효하지 않으면 종료
  if (!selItem || !itemToAdd) {
    return;
  }

  // 🛡️ Guard Clause: 재고가 있을 때만 장바구니 추가 로직 실행
  if (itemToAdd.quantity > 0) {
    // 🎨 코딩 스타일 통일: 대괄호 → 점 표기법
    const item = document.getElementById(itemToAdd.id);
    if (item) {
      // 🎯 DRY 적용: 중복 제거된 유틸리티 사용
      const currentQty = getCartItemQuantity(item);
      const newQty = currentQty + 1;
      if (newQty <= itemToAdd.quantity + currentQty) {
        const qtyElem = item.querySelector('.quantity-number');
        qtyElem.textContent = newQty;
        itemToAdd.quantity--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      const newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className =
        'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';
      newItem.innerHTML = `
        <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
          <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
        </div>
        <div>
          <h3 class="text-base font-normal mb-1 tracking-tight">${getDiscountedProductName(itemToAdd)}</h3>
          <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
          <p class="text-xs text-black mb-3">${getDiscountedPriceHTML(itemToAdd)}</p>
          <div class="flex items-center gap-4">
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="-1">−</button>
            <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="1">+</button>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg mb-2 tracking-tight tabular-nums">${getDiscountedPriceHTML(itemToAdd)}</div>
          <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${itemToAdd.id}">Remove</a>
        </div>
      `;
      uiElements.cartDisplay.appendChild(newItem);
      itemToAdd.quantity--;
    }
    handleCalculateCartStuff(
      appState,
      uiElements,
      domElements,
      getCartItemQuantity,
      getTotalStock,
      calculateFinalDiscounts,
      updateOrderSummaryUI,
      updateTotalAndDiscountUI,
      updateHeader,
      findProductById,
      hasKeyboardMouseSet,
      hasFullProductSet,
      shouldApplyTuesdayBonus,
    );
    appState.lastSelected = selItem;
  }
});
uiElements.cartDisplay.addEventListener('click', event => {
  const tgt = event.target;
  if (
    tgt.classList.contains('quantity-change') ||
    tgt.classList.contains('remove-item')
  ) {
    const prodId = tgt.dataset.productId;
    const itemElem = document.getElementById(prodId);
    // 🎯 DRY 적용: 중복 제거된 유틸리티 사용
    const prod = findProductById(prodId);
    if (tgt.classList.contains('quantity-change')) {
      const qtyChange = parseInt(tgt.dataset.change);
      // 🎯 DRY 적용: 중복 제거된 유틸리티 사용
      const currentQty = getCartItemQuantity(itemElem);
      const newQty = currentQty + qtyChange;
      // 🧠 복잡한 조건 → 의미있는 함수로 개선
      if (isValidQuantityChange(newQty, prod, currentQty)) {
        const qtyElem = itemElem.querySelector('.quantity-number');
        qtyElem.textContent = newQty;
        prod.quantity -= qtyChange;
      } else if (newQty <= 0) {
        prod.quantity += currentQty;
        itemElem.remove();
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (tgt.classList.contains('remove-item')) {
      // 🎯 DRY 적용: 중복 제거된 유틸리티 사용
      const remQty = getCartItemQuantity(itemElem);
      prod.quantity += remQty;
      itemElem.remove();
    }
    // 🔍 재고 상태 확인 (필요시 추가 로직 구현 가능)
    handleCalculateCartStuff(
      appState,
      uiElements,
      domElements,
      getCartItemQuantity,
      getTotalStock,
      calculateFinalDiscounts,
      updateOrderSummaryUI,
      updateTotalAndDiscountUI,
      updateHeader,
      findProductById,
      hasKeyboardMouseSet,
      hasFullProductSet,
      shouldApplyTuesdayBonus,
    );
    updateProductSelectUI();
  }
});
