// ==========================================
// import 선언
// ==========================================

import {
  PRODUCT_ONE,
  PRODUCT_TWO,
  PRODUCT_THREE,
  PRODUCT_FOUR,
  PRODUCT_FIVE,
  PRODUCT_LIST,
} from './constants/products.js';

import {
  TIMER_CONFIG,
  DISCOUNT_RATES,
  QUANTITY_THRESHOLDS,
  POINTS_CONFIG,
  WEEKDAYS,
  PRICE_CONFIG,
} from './constants/config.js';

import { CartItem, Header, HelpModal, MainLayout } from './components/ui.js';
import { SALE_ICONS, PRODUCT_OPTION_STYLES } from './constants/styles.js';
// 🛒 장바구니 서비스 import
import {
  addProductToCart,
  removeItem,
  changeCartItemQuantity,
} from './services/cartService.js';
// 🎯 이벤트 핸들러 import
import { setupCartEventListeners } from './handlers/cartHandlers.js';
// 💰 할인 계산 서비스 import
import {
  calculateCartTotals,
  applyBulkDiscount,
  applyTuesdayDiscount,
  findProductById,
} from './services/discountService.js';
// 🎁 포인트 계산 서비스 import
import { renderBonusPoints } from './services/pointsService.js';

// ==========================================
// 전역 변수들
// ==========================================

let bonusPoints = 0;
let itemCount = 0;
let totalAmount = 0;
let lastSelectedProduct = '';

// 🌍 전역 상태 객체
const globalState = {
  get lastSelectedProduct() {
    return lastSelectedProduct;
  },
  set lastSelectedProduct(value) {
    lastSelectedProduct = value;
  },
};

let stockInfo;
let productSelect;
let addButton;
let cartDisplay;
let sum; // 🎯 장바구니 총액 표시 요소

// ==========================================
// 메인 초기화 함수
// ==========================================

// 애플리케이션 상태를 초기화합니다
function initializeAppState() {
  totalAmount = 0;
  itemCount = 0;
  lastSelectedProduct = null;
}

// UI를 렌더링 합니다
function renderInitialUI() {
  const root = document.getElementById('app');
  if (!root) {
    throw new Error('Root 요소를 찾을 수 없습니다.');
  }

  root.innerHTML = `
    ${Header()}
    ${MainLayout(PRODUCT_LIST)}
    ${HelpModal()}
  `;
}

// DOM 요소들 참조 설정

function bindDOMElements() {
  const elements = {
    productSelect: 'product-select',
    addButton: 'add-to-cart',
    cartDisplay: 'cart-items',
    stockInfo: 'stock-status',
    cartTotal: 'cart-total',
    manualToggle: 'manual-toggle',
    manualOverlay: 'manual-overlay',
  };

  // 전역 변수에 할당
  productSelect = document.getElementById(elements.productSelect);
  addButton = document.getElementById(elements.addButton);
  cartDisplay = document.getElementById(elements.cartDisplay);
  stockInfo = document.getElementById(elements.stockInfo);
  sum = document.getElementById(elements.cartTotal);

  return {
    manualToggle: document.getElementById(elements.manualToggle),
    manualOverlay: document.getElementById(elements.manualOverlay),
  };
}

// 메뉴얼 토글 핸들러

function createModalToggleHandler(manualOverlay) {
  return function () {
    if (!manualOverlay) return;

    manualOverlay.classList.toggle('hidden');
    const manualPanel = document.getElementById('manual-panel');
    if (manualPanel) {
      manualPanel.classList.toggle('translate-x-full');
    }
  };
}

// 매뉴얼 오버레이 클릭 핸들러

function createModalOverlayHandler(manualOverlay) {
  return function (event) {
    if (event.target !== manualOverlay) return;

    manualOverlay.classList.add('hidden');
    const manualPanel = document.getElementById('manual-panel');
    if (manualPanel) {
      manualPanel.classList.add('translate-x-full');
    }
  };
}

// 모달 관련 이벤트

function setupModalEventListeners() {
  const { manualToggle, manualOverlay } = bindDOMElements();

  if (manualToggle && manualOverlay) {
    manualToggle.addEventListener(
      'click',
      createModalToggleHandler(manualOverlay)
    );
    manualOverlay.addEventListener(
      'click',
      createModalOverlayHandler(manualOverlay)
    );
  }
}

// 번개 세일 처리 로직

function handleLightningSale() {
  const availableProducts = PRODUCT_LIST.filter(
    (product) => product.quantity > 0 && !product.onSale
  );

  if (availableProducts.length === 0) return;

  const luckyIndex = Math.floor(Math.random() * availableProducts.length);
  const selectedItem = availableProducts[luckyIndex];

  // 가격 할인 적용
  selectedItem.price = Math.round(
    selectedItem.originalPrice * PRICE_CONFIG.LIGHTNING_SALE_MULTIPLIER
  );
  selectedItem.onSale = true;

  alert(
    `⚡번개세일! ${selectedItem.name}이(가) ${DISCOUNT_RATES.LIGHTNING_SALE * 100}% 할인 중입니다!`
  );

  updateProductOptions();
  doUpdatePricesInCart();
}

// 추천 상품 찾기

function findSuggestionProduct() {
  if (!lastSelectedProduct) return null;

  return PRODUCT_LIST.find(
    (product) =>
      product.id !== lastSelectedProduct &&
      product.quantity > 0 &&
      !product.suggestSale
  );
}

// 추천 상품 할인 처리

function handleProductSuggestion() {
  // 장바구니가 비어 있거나, 마지막 선택 상품이 없으면 리턴
  if (cartDisplay.children.length === 0 || !lastSelectedProduct) return;

  const suggestedProduct = findSuggestionProduct();
  if (!suggestedProduct) return;

  suggestedProduct.price = Math.round(
    suggestedProduct.price * PRICE_CONFIG.SUGGESTION_SALE_MULTIPLIER
  );
  suggestedProduct.suggestSale = true;

  alert(
    `💝 ${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 ${DISCOUNT_RATES.SUGGESTION * 100}% 추가 할인!`
  );

  updateProductOptions();
  doUpdatePricesInCart();
}

// 번개 세일 타이머 설정 (setTimeout)

function setupLightningSaleTimer() {
  const initialDelay = Math.random() * TIMER_CONFIG.LIGHTNING_SALE_MAX_DELAY;

  setTimeout(() => {
    setInterval(handleLightningSale, TIMER_CONFIG.LIGHTNING_SALE_INTERVAL);
  }, initialDelay);
}

// 추천 상품 세일 타이머 설정

function setupSuggestionTimer() {
  const initialDelay = Math.random() * TIMER_CONFIG.SUGGESTION_MAX_DELAY;

  setTimeout(() => {
    setInterval(handleProductSuggestion, TIMER_CONFIG.SUGGESTION_INTERVAL);
  }, initialDelay);
}

// 타이머 초기화

function initializeTimers() {
  setupLightningSaleTimer();
  setupSuggestionTimer();
}

// 초기 렌더링 수행

function initializeRender() {
  updateProductOptions();
  handleCalculateCartStuff();
}

function main() {
  try {
    // 전역 상태 초기화
    initializeAppState();

    // UI 렌더링
    renderInitialUI();

    // dom 요소 바인딩
    bindDOMElements();

    // 이벤트 리스너 설정
    setupModalEventListeners();

    // 🎯 장바구니 이벤트 리스너 설정
    initializeEventListeners();

    // 초기 렌더
    initializeRender();

    // 타이머 설정
    initializeTimers();
  } catch (error) {
    console.log('초기화 중 오류 발생: ', error);
    alert('사이트를 초기화하는 중 오류가 발생했습니다.');
  }
}

// ==========================================
// UI 업데이트 함수들 🎨
// ==========================================

// 아이템 카운트 업데이트
function updateItemCount(itemCount) {
  const itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    const previousCount = parseInt(
      itemCountElement.textContent.match(/\d+/) || 0
    );
    itemCountElement.textContent = `🛍️ ${itemCount} items in cart`;

    if (previousCount !== itemCount) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }
}

// 주문 요약 상세 내역
function renderOrderSummary(cartTotals, discountInfo) {
  const summaryElement = document.getElementById('summary-details');
  if (!summaryElement) return;

  summaryElement.innerHTML = '';

  if (cartTotals.subtotal <= 0) return;

  // 상품별 라인 아이템
  cartTotals.items.forEach((item) => {
    summaryElement.innerHTML += `
      <div class="flex justify-between text-xs tracking-wide text-gray-400">
        <span>${item.product.name} x ${item.quantity}</span>
        <span>₩${item.subtotal.toLocaleString()}</span>
      </div>
    `;
  });

  // 소계
  summaryElement.innerHTML += `
    <div class="border-t border-white/10 my-3"></div>
    <div class="flex justify-between text-sm tracking-wide">
      <span>Subtotal</span>
      <span>₩${cartTotals.subtotal.toLocaleString()}</span>
    </div>
  `;

  // 할인 내역 표시
  renderDiscountDetails(summaryElement, cartTotals, discountInfo);

  // 배송비
  summaryElement.innerHTML += `
    <div class="flex justify-between text-sm tracking-wide text-gray-400">
      <span>Shipping</span>
      <span>Free</span>
    </div>
  `;
}

// 할인 내역 상세 렌더링
function renderDiscountDetails(summaryElement, cartTotals, discountInfo) {
  const { itemCount, itemDiscounts } = cartTotals;
  const today = new Date();
  const isTuesday = today.getDay() === WEEKDAYS.TUESDAY;

  // 대량구매 할인
  if (itemCount >= QUANTITY_THRESHOLDS.BULK_DISCOUNT_MINIMUM) {
    summaryElement.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-green-400">
        <span class="text-xs">🎉 대량구매 할인 (${QUANTITY_THRESHOLDS.BULK_DISCOUNT_MINIMUM}개 이상)</span>
        <span class="text-xs">-${DISCOUNT_RATES.BULK_DISCOUNT_30_PLUS * 100}%</span>
      </div>
    `;
  }
  // 개별 상품 할인
  else if (itemDiscounts.length > 0) {
    itemDiscounts.forEach((item) => {
      summaryElement.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">${item.name} (${QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT_MINIMUM}개↑)</span>
          <span class="text-xs">-${item.discount}%</span>
        </div>
      `;
    });
  }

  // 화요일 할인
  if (isTuesday && discountInfo.finalAmount > 0) {
    summaryElement.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-purple-400">
        <span class="text-xs">🌟 화요일 추가 할인</span>
        <span class="text-xs">-${DISCOUNT_RATES.TUESDAY_SPECIAL * 100}%</span>
      </div>
    `;
  }
}

// 총액 표시 업데이트
function updateTotalDisplay(totalAmount) {
  const totalElement = sum?.querySelector('.text-2xl');
  if (totalElement) {
    totalElement.textContent = `₩${Math.round(totalAmount).toLocaleString()}`;
  }
}

// 할인 정보 표시
function updateDiscountInfo(discountInfo) {
  const discountInfoElement = document.getElementById('discount-info');
  if (!discountInfoElement) return;

  discountInfoElement.innerHTML = '';

  if (discountInfo.discountRate > 0 && discountInfo.finalAmount > 0) {
    const savedAmount = discountInfo.originalTotal - discountInfo.finalAmount;
    discountInfoElement.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discountInfo.discountRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }
}

// ==========================================
// UI 업데이트 함수들
// ==========================================

// 전체 재고 계산

function calculateTotalStock(products) {
  return products.reduce((total, product) => total + product.quantity, 0);
}

// 할인 상태 확인하여 아이콘으로 변환
function getSaleIcon(product) {
  if (product.onSale && product.suggestSale) return SALE_ICONS.SUPER_COMBO;

  if (product.onSale) return SALE_ICONS.LIGHTNING;

  if (product.suggestSale) return SALE_ICONS.SUGGESTION;

  return '';
}

// 할인 정보 텍스트 생성 (슈퍼세일~ 세일~ 추천할인~)

function getDiscountText(product) {
  if (product.onSale && product.suggestSale)
    return `${DISCOUNT_RATES.SUPER_SALE_COMBO * 100}% SUPER SALE!`;

  if (product.onSale) return `${DISCOUNT_RATES.LIGHTNING_SALE * 100}% SALE!`;

  if (product.suggestSale)
    return `${DISCOUNT_RATES.SUGGESTION * 100}% 추천할인!`;

  return '';
}

// 상품 옵션의 스타일 클래스 설정
function getOptionStyle(product) {
  if (product.quantity === 0) {
    return PRODUCT_OPTION_STYLES.OUT_OF_STOCK;
  }
  if (product.onSale && product.suggestSale) {
    return PRODUCT_OPTION_STYLES.SUPER_SALE;
  }
  if (product.onSale) {
    return PRODUCT_OPTION_STYLES.LIGHTNING_SALE;
  }
  if (product.suggestSale) {
    return PRODUCT_OPTION_STYLES.SUGGESTION_SALE;
  }
  return '';
}

// 품절 옵션 텍스트 생성
function createOutOfStockOptionText(product) {
  const saleIcon = getSaleIcon(product);
  const additionalText = saleIcon ? ` ${saleIcon}` : '';
  return `${product.name} - ${product.price}원 (품절)${additionalText}`;
}

// 할인 제품 옵션 텍스트 생성 (품절 x)
function createDiscountOptionText(product) {
  const saleIcon = getSaleIcon(product);
  const discountText = getDiscountText(product);
  const priceDisplay = `${product.originalPrice}원 → ${product.price}원`;

  return `${saleIcon}${product.name} - ${priceDisplay} (${discountText})`;
}

// 일반 제품 텍스트 생성
function createRegularOptionText(product) {
  return `${product.name} - ${product.price}원`;
}

// 상품 옵션  텍스트 생성

function createOptionText(product) {
  if (product.quantity === 0) {
    return createOutOfStockOptionText(product);
  }

  if (product.onSale || product.suggestSale) {
    return createDiscountOptionText(product);
  }

  return createRegularOptionText(product);
}

// 개별 상품 옵션 element 생성

function createProductOption(product) {
  const option = document.createElement('option');

  option.value = product.id;
  option.textContent = createOptionText(product);
  option.className = getOptionStyle(product);

  if (product.quantity === 0) {
    option.disabled = true;
  }

  return option;
}

// select - option 렌더링

function renderProductDropdown(products) {
  if (!productSelect) return;

  productSelect.innerHTML = '';

  products.forEach((product) => {
    const option = createProductOption(product);

    productSelect.appendChild(option);
  });
}

// 재고 상태에 따른 ui 스타일 업데이트
function updateStockIndicator(totalStock) {
  if (!productSelect) return;

  // 재고가 부족한지
  const isLowStock = totalStock < QUANTITY_THRESHOLDS.STOCK_BORDER_WARNING;

  // 부족하면 borderColor 업데이트
  productSelect.style.borderColor = isLowStock
    ? PRODUCT_OPTION_STYLES.LOW_STOCK_BORDER
    : '';
}

function updateProductOptions() {
  if (!PRODUCT_LIST || !Array.isArray(PRODUCT_LIST)) {
    console.error('상품 목록이 올바르지 않습니다');
    return;
  }

  try {
    const totalStock = calculateTotalStock(PRODUCT_LIST);

    renderProductDropdown(PRODUCT_LIST);
    updateStockIndicator(totalStock);
  } catch (error) {
    console.error('상품 옵션 업데이트 중 오류:', error);
  }
}

// ==========================================
// 장바구니 총액 및 할인 계산 (discountService 사용) 💰
// ==========================================

function handleCalculateCartStuff() {
  try {
    // 기본 계산 (cartDisplay 파라미터 전달)
    const cartTotal = calculateCartTotals(cartDisplay);
    // 대량 구매 할인
    const bulkDiscountInfo = applyBulkDiscount(cartTotal);

    // 화요일 할인
    const finalDiscountInfo = applyTuesdayDiscount(
      bulkDiscountInfo.finalAmount,
      bulkDiscountInfo.originalTotal
    );

    // 전역 변수 업데이트
    totalAmount = finalDiscountInfo.finalAmount;
    itemCount = cartTotal.itemCount;

    // ui 업데이트
    updateItemCount(cartTotal.itemCount);
    renderOrderSummary(cartTotal, finalDiscountInfo);
    updateTotalDisplay(finalDiscountInfo.finalAmount);
    updateDiscountInfo({
      ...finalDiscountInfo,
      discountRate: finalDiscountInfo.discountRate,
    });

    handleStockInfoUpdate();
    // 🎁 포인트 계산 (pointsService 사용)
    bonusPoints = renderBonusPoints(cartDisplay, totalAmount, itemCount);
  } catch (error) {
    console.error('🚨 장바구니 계산 중 오류 발생:', error);
    alert('장바구니 계산 중 문제가 발생했습니다.');
  }
}

// ==========================================
// 재고 관리 함수들
// ==========================================

// 전체 재고 수량 계산
function onGetStockTotal() {
  return PRODUCT_LIST.reduce((acc, cur) => (acc += cur.quantity), 0);
}

// 재고 정보 업데이트
const handleStockInfoUpdate = function () {
  const totalStock = onGetStockTotal();

  if (totalStock < QUANTITY_THRESHOLDS.STOCK_WARNING_THRESHOLD) {
    // 재고 부족 경고 로직
  }

  // 재고 부족 상품들만 필터링
  const lowStockItems = PRODUCT_LIST.filter(
    (item) => item.quantity < QUANTITY_THRESHOLDS.LOW_STOCK_WARNING
  ).map((item) => {
    return item.quantity > 0
      ? `${item.name}: 재고 부족 (${item.quantity}개 남음)`
      : `${item.name}: 품절`;
  });

  // DOM 업데이트
  stockInfo.textContent = lowStockItems.join('\n');
};

// 세일 상태별 UI 설정 맵
const SALE_STATE_UI_CONFIG = {
  super: {
    priceClass: 'text-purple-600',
    icon: '⚡💝',
  },
  lightning: {
    priceClass: 'text-red-500',
    icon: '⚡',
  },
  suggestion: {
    priceClass: 'text-blue-500',
    icon: '💝',
  },
  regular: {
    priceClass: '',
    icon: '',
  },
};

// 상품의 세일 상태 결정
function determineSaleState(product) {
  if (product.onSale && product.suggestSale) return 'super';
  if (product.onSale) return 'lightning';
  if (product.suggestSale) return 'suggestion';
  return 'regular';
}

// 세일 가격 HTML 생성
function createSalePriceHTML(product, saleState) {
  const config = SALE_STATE_UI_CONFIG[saleState];

  if (saleState === 'regular') {
    return `₩${product.price.toLocaleString()}`;
  }

  const originalPriceSpan = `<span class="line-through text-gray-400">₩${product.originalPrice.toLocaleString()}</span>`;
  const salePriceSpan = `<span class="${config.priceClass}">₩${product.price.toLocaleString()}</span>`;

  return `${originalPriceSpan} ${salePriceSpan}`;
}

// 상품 이름 with 아이콘 생성
function createProductNameWithIcon(product, saleState) {
  const config = SALE_STATE_UI_CONFIG[saleState];
  return `${config.icon}${product.name}`;
}

// 개별 장바구니 아이템 UI 업데이트
function updateCartItemUI(cartElement, product) {
  const priceElement = cartElement.querySelector('.text-lg');
  const nameElement = cartElement.querySelector('h3');

  if (!priceElement || !nameElement) return;

  const saleState = determineSaleState(product);

  priceElement.innerHTML = createSalePriceHTML(product, saleState);

  nameElement.textContent = createProductNameWithIcon(product, saleState);
}

// 모든 장바구니 아이템 가격 업데이트
function updateAllCartItemPrices() {
  const cartItems = Array.from(cartDisplay.children);

  cartItems.forEach((cartElement) => {
    const product = PRODUCT_LIST.find((p) => p.id === cartElement.id);

    if (product) {
      updateCartItemUI(cartElement, product);
    }
  });
}

function doUpdatePricesInCart() {
  try {
    updateAllCartItemPrices();
    handleCalculateCartStuff();
  } catch (error) {
    console.error('🚨 장바구니 가격 업데이트 중 오류:', error);
    handleCalculateCartStuff();
  }
}

// ==========================================
// 이벤트 리스너 설정 (handlers 사용) 🎯
// ==========================================

// 장바구니 이벤트 리스너 설정
function initializeEventListeners() {
  setupCartEventListeners(
    cartDisplay,
    addButton,
    productSelect,
    handleCalculateCartStuff,
    updateProductOptions,
    globalState
  );
}

// ==========================================
// 애플리케이션 시작점
// ==========================================

// 애플리케이션 초기화
main();
