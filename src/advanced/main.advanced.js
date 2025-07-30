// ==========================================
// 상수 및 컴포넌트 Import
// ==========================================
import {
  DISCOUNT_RATES,
  // TIMERS,
  DAYS,
  PRODUCT_PRICES,
  INITIAL_STOCK,
  UI_CONSTANTS,
} from './constant';

// UI 컴포넌트들
import { Header, updateHeader } from './components/Header.js';
import {
  updateOrderSummaryUI,
  OrderSummaryHTML,
} from './components/OrderSummary.js';
import { updateTotalAndDiscountUI } from './components/TotalAndDiscount.js';
import { updateCartPricesUI } from './components/CartPrices.js';
import { updateProductSelectUI } from './components/ProductSelect.js';
import { Layout } from './components/Layout.js';
import { HelpModal } from './components/HelpModal.js';
import { ProductSelector } from './components/ProductSelector.js';
import { CartDisplay } from './components/CartDisplay.js';
import { setupEventHandlers } from './components/EventHandlers.js';

// 유틸리티 함수들
import {
  hasKeyboardMouseSet,
  hasFullProductSet,
} from './utils/validationUtils.js';

// 서비스 함수들
import { handleCalculateCartStuff } from './services/cartService.js';
import { calculateFinalDiscounts } from './services/calculationService.js';
import {
  setupLightningSaleTimer,
  setupSuggestSaleTimer,
} from './services/timerService.js';
import {
  initializeDomElements,
  setupLayout,
} from './services/appInitializationService.js';

// ==========================================
// 애플리케이션 상태 관리
// ==========================================

/**
 * 애플리케이션 상태
 */
const appState = {
  products: [],
  cart: {
    totalAmount: 0,
    itemCount: 0,
    bonusPoints: 0,
  },
  lastSelected: null,
};

/**
 * UI 요소 레퍼런스
 */
const uiElements = {
  stockInfo: null,
  productSelect: null,
  addButton: null,
  cartDisplay: null,
  orderSummary: null,
};

// ==========================================
// 상수 정의
// ==========================================

const PRODUCT_ONE = 'p1';
const PRODUCT_TWO = 'p2';
const PRODUCT_THREE = 'p3';
const PRODUCT_FOUR = 'p4';
const PRODUCT_FIVE = 'p5';

// ==========================================
// 유틸리티 함수들
// ==========================================

/**
 * ID로 상품 찾기
 */
const findProductById = productId => {
  return appState.products.find(product => product.id === productId) || null;
};

/**
 * 장바구니 아이템의 수량 조회
 */
const getCartItemQuantity = cartItemElement => {
  const qtyElem = cartItemElement.querySelector('.quantity-number');
  return qtyElem ? parseInt(qtyElem.textContent) : 0;
};

/**
 * 할인 상태에 따른 상품명 텍스트 생성
 */
export const getDiscountedProductName = product => {
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
 * 할인 상태에 따른 가격 HTML 생성
 */
export const getDiscountedPriceHTML = product => {
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
    return `<span class="line-through text-gray-400">${product.originalVal.toLocaleString()}</span>원 <span class="${discountColor}">${product.val.toLocaleString()}</span>원`;
  }

  return `${product.val.toLocaleString()}원`;
};

// ==========================================
// 조건부 로직 함수들
// ==========================================

/**
 * 번개 할인 적용 가능 여부 확인
 */
const canApplyLightningDiscount = item => item.quantity > 0 && !item.onSale;

/**
 * 화요일 보너스 적용 가능 여부 확인
 */
const shouldApplyTuesdayBonus = basePoints => {
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
export const hasBothDiscounts = product =>
  product.onSale && product.suggestSale;
const hasOnSaleOnly = product => product.onSale && !product.suggestSale;
const hasSuggestSaleOnly = product => !product.onSale && product.suggestSale;

// ==========================================
// DOM 요소 캐시
// ==========================================

/**
 * 자주 사용되는 DOM 요소들 캐시
 */
const domElements = {
  loyaltyPoints: null,
  summaryDetails: null,
  tuesdaySpecial: null,
  discountInfo: null,
};

/**
 * 애플리케이션 상태 초기화
 */
function initializeAppState() {
  appState.cart.totalAmount = UI_CONSTANTS.INITIAL_CART_AMOUNT;
  appState.cart.itemCount = UI_CONSTANTS.INITIAL_CART_COUNT;
  appState.cart.bonusPoints = UI_CONSTANTS.INITIAL_BONUS_POINTS;
  appState.lastSelected = null;

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
 */
//  * - 전역변수 수정 (prodList, totalAmt, itemCnt 등)
//  * - DOM 조작 (app 요소에 UI 추가)
//  * - 타이머 설정 (번개세일, 추천상품)
//  */
function main() {
  // 1️⃣ 상태 초기화
  initializeAppState();

  // 2️⃣ 컴포넌트 생성
  const layout = Layout();
  const helpModal = HelpModal();
  const productSelector = ProductSelector();
  const cartDisplay = CartDisplay();
  const headerComponent = Header(0);
  const orderSummary = OrderSummaryHTML();

  // 3️⃣ UI 요소 할당
  uiElements.productSelect = productSelector.productSelect;
  uiElements.addButton = productSelector.addButton;
  uiElements.stockInfo = productSelector.stockInfo;
  uiElements.cartDisplay = cartDisplay.cartDisplay;
  uiElements.orderSummary = orderSummary;

  // 4️⃣ 레이아웃 구성
  const layoutElements = setupLayout(
    layout,
    productSelector,
    cartDisplay,
    orderSummary,
    helpModal,
  );

  // 5️⃣ 헤더 추가
  layoutElements.root.appendChild(headerComponent);

  // 6️⃣ DOM 요소 캐시 초기화
  Object.assign(domElements, initializeDomElements());

  // 7️⃣ 초기 계산 및 UI 업데이트
  updateProductSelectUI(appState.products, getTotalStock());
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

  // 8️⃣ 타이머 설정
  setupLightningSaleTimer(
    appState.products,
    updateProductSelectUI,
    updateCartPricesUI,
    getTotalStock,
    canApplyLightningDiscount,
  );

  setupSuggestSaleTimer(
    appState.products,
    uiElements,
    updateProductSelectUI,
    updateCartPricesUI,
    DISCOUNT_RATES,
    getTotalStock,
  );

  // 9️⃣ 이벤트 핸들러 설정
  setupEventHandlers(
    uiElements,
    appState,
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
    updateProductSelectUI,
    updateCartPricesUI,
    isValidQuantityChange,
  );
}

/**
 * 전체 재고 수량 계산
 */
const getTotalStock = () => {
  return appState.products.reduce(
    (totalStock, product) => totalStock + product.quantity,
    0,
  );
};

main();
