// ==========================================
// 전역 변수 선언
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

import { Header, HelpModal, MainLayout } from './components/ui.js';
import { SALE_ICONS, PRODUCT_OPTION_STYLES } from './constants/styles.js';

let bonusPoints = 0;
let stockInfo;
let itemCount;
let lastSelectedProduct;
let productSelect;
let addButton;
let totalAmount = 0;

let cartDisplay;

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
// UI 업데이트 함수들
// ==========================================

let sum;

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
// 장바구니 계산 및 할인 로직
// ==========================================

// 할인 계산
const PRODUCT_BULK_DISCOUNT_MAP = {
  [PRODUCT_ONE]: DISCOUNT_RATES.PRODUCT_BULK_DISCOUNTS.KEYBOARD,
  [PRODUCT_TWO]: DISCOUNT_RATES.PRODUCT_BULK_DISCOUNTS.MOUSE,
  [PRODUCT_THREE]: DISCOUNT_RATES.PRODUCT_BULK_DISCOUNTS.MONITOR_ARM,
  [PRODUCT_FOUR]: DISCOUNT_RATES.PRODUCT_BULK_DISCOUNTS.LAPTOP_POUCH,
  [PRODUCT_FIVE]: DISCOUNT_RATES.PRODUCT_BULK_DISCOUNTS.SPEAKER,
};

// 개별 상품 할인 계산 (10개 이상)
function calculateItemDiscount(item) {
  if (item.quantity < QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT_MINIMUM) {
    return 0;
  }

  return PRODUCT_BULK_DISCOUNT_MAP[item.product.id] || 0;
}

// 상품 정보 찾기
function findProductById(productId) {
  return PRODUCT_LIST.find((product) => product.id === productId);
}

// 장바구니에 담은 아이템 데이터 파싱
function parseCartItems() {
  const cartItems = Array.from(cartDisplay.children);

  return cartItems.map((cartItem) => {
    const product = findProductById(cartItem.id);
    const quantityElement = cartItem.querySelector('.quantity-number');
    const quantity = parseInt(quantityElement.textContent);

    return {
      cartElement: cartItem,
      product,
      quantity,
      subtotal: product.price * quantity,
    };
  });
}

// 대량 구매 시 UI 강조
function updateBulkPurchaseUI(cartItem, quantity) {
  const priceElements = cartItem.querySelectorAll('.text-lg, .text-xs');
  const isBulkPurchase =
    quantity >= QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT_MINIMUM;

  priceElements.forEach((element) => {
    if (element.classList.contains('text-lg')) {
      element.style.fontWeight = isBulkPurchase ? 'bold' : 'normal';
    }
  });
}

// 장바구니 아이템별 계산

function calculateCartTotals() {
  const items = parseCartItems();
  let totalAmount = 0; // 할인
  let itemCount = 0; // 개수
  let subtotal = 0; // 총계
  const itemDiscounts = [];

  items.forEach((item) => {
    const discount = calculateItemDiscount(item);
    const discountedTotal = item.subtotal * (1 - discount);

    updateBulkPurchaseUI(item.cartElement, item.quantity);

    if (discount > 0) {
      itemDiscounts.push({
        name: item.product.name,
        discount: discount * 100,
      });
    }

    totalAmount += discountedTotal;
    itemCount += item.quantity;
    subtotal += item.subtotal;
  });

  return {
    items,
    totalAmount,
    itemCount,
    subtotal,
    itemDiscounts,
  };
}

// 대량 구매 할인 적용 (30개 이상)
function applyBulkDiscount(cartTotals) {
  if (cartTotals.itemCount < QUANTITY_THRESHOLDS.BULK_DISCOUNT_MINIMUM) {
    return {
      finalAmount: cartTotals.totalAmount,
      discountRate:
        (cartTotals.subtotal - cartTotals.totalAmount) / cartTotals.subtotal,
      originalTotal: cartTotals.subtotal,
    };
  }

  const bulkDiscountedAmount =
    cartTotals.subtotal * PRICE_CONFIG.BULK_DISCOUNT_MULTIPLIER;

  return {
    finalAmount: bulkDiscountedAmount,
    discountRate: DISCOUNT_RATES.BULK_DISCOUNT_30_PLUS,
    originalTotal: cartTotals.subtotal,
  };
}

// 화요일 특별 할인 적용
function applyTuesdayDiscount(amount, originalTotal) {
  const today = new Date();
  const isTuesday = today.getDay() === WEEKDAYS.TUESDAY;

  const tuesdaySpecialElement = document.getElementById('tuesday-special');

  if (!isTuesday) {
    tuesdaySpecialElement?.classList.add('hidden');
    return { finalAmount: amount, discountRate: 1 - amount / originalTotal };
  }

  if (amount <= 0) {
    tuesdaySpecialElement?.classList.add('hidden');
    return { finalAmount: amount, discountRate: 1 - amount / originalTotal };
  }

  const tuesdayDiscountedAmount = amount * PRICE_CONFIG.TUESDAY_MULTIPLIER;
  tuesdaySpecialElement?.classList.remove('hidden');

  return {
    finalAmount: tuesdayDiscountedAmount,
    discountRate: 1 - tuesdayDiscountedAmount / originalTotal,
  };
}

// 재고 부족 상품 목록 생성
function getLowStockItems() {
  return PRODUCT_LIST.filter(
    (product) =>
      product.quantity < QUANTITY_THRESHOLDS.LOW_STOCK_WARNING &&
      product.quantity > 0
  ).map((product) => product.name);
}

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

// 장바구니 총액 및 할인 계산
function handleCalculateCartStuff() {
  try {
    // 기본 계산
    const cartTotal = calculateCartTotals();
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
    doRenderBonusPoints();
  } catch (error) {
    console.error('🚨 장바구니 계산 중 오류 발생:', error);
    alert('장바구니 계산 중 문제가 발생했습니다.');
  }
}

// ==========================================
// 포인트 계산 시스템
// ==========================================

// 보너스 포인트 계산 및 렌더링

// 상품별 보너스 포인트 체크
const PRODUCT_BONUS_CHECK = {
  [PRODUCT_ONE]: 'hasKeyboard',
  [PRODUCT_TWO]: 'hasMouse',
  [PRODUCT_THREE]: 'hasMonitorArm',
};

// 장바구니에 있는 상품들 찾기
function parseCartProducts() {
  const cartItems = Array.from(cartDisplay.children);

  return cartItems
    .map((cartItem) => {
      return PRODUCT_LIST.find((product) => product.id === cartItem.id);
    })
    .filter((product) => product);
}

// 기본 포인트 계산
function calculateBasePoints(totalAmount) {
  const basePoints = Math.floor(totalAmount / POINTS_CONFIG.BASE_POINT_RATE);
  return basePoints > 0 ? basePoints : 0;
}

// 화요일 포인트 계산
function calculateTuesdayPoints(basePoints) {
  const isTuesday = new Date().getDay() === WEEKDAYS.TUESDAY;

  if (!isTuesday || basePoints <= 0) {
    return { points: basePoints, detail: [] };
  }

  return {
    points: basePoints * POINTS_CONFIG.TUESDAY_MULTIPLIER,
    detail: ['화요일 2배'],
  };
}

// 상품 조합 체크
function checkProductCombinations(cartProducts) {
  const productFlags = {
    hasKeyboard: false,
    hasMouse: false,
    hasMonitorArm: false,
  };

  cartProducts.forEach((product) => {
    const flagName = PRODUCT_BONUS_CHECK[product.id];
    if (flagName) {
      productFlags[flagName] = true;
    }
  });

  return productFlags;
}

// 조합 보너스 포인트 계산
function calculateComboBonus(productFlags) {
  const { hasKeyboard, hasMouse, hasMonitorArm } = productFlags;
  let bonusPoints = 0;
  const bonusDetails = [];

  // 키보드 마우스 세트 보너스
  if (hasKeyboard && hasMouse) {
    bonusPoints += POINTS_CONFIG.COMBO_BONUS.KEYBOARD_MOUSE;
    bonusDetails.push(
      `키보드+마우스 세트 +${POINTS_CONFIG.COMBO_BONUS.KEYBOARD_MOUSE}p`
    );
  }

  // 풀세트 구매 보너스
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    bonusPoints += POINTS_CONFIG.COMBO_BONUS.FULL_SET;
    bonusDetails.push(`풀세트 구매 +${POINTS_CONFIG.COMBO_BONUS.FULL_SET}p`);
  }

  return { points: bonusPoints, details: bonusDetails };
}

// 대량 구매 포인트 계산
function calculateBulkBonus(itemCount) {
  const bulkBonusRules = [
    {
      threshold: QUANTITY_THRESHOLDS.BULK_DISCOUNT_MINIMUM,
      points: POINTS_CONFIG.BULK_BONUS.THIRTY_PLUS,
      label: `대량구매(${QUANTITY_THRESHOLDS.BULK_DISCOUNT_MINIMUM}개+)`,
    },
    {
      threshold: QUANTITY_THRESHOLDS.MEDIUM_BULK_MINIMUM,
      points: POINTS_CONFIG.BULK_BONUS.TWENTY_PLUS,
      label: `대량구매(${QUANTITY_THRESHOLDS.MEDIUM_BULK_MINIMUM}개+)`,
    },
    {
      threshold: QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT_MINIMUM,
      points: POINTS_CONFIG.BULK_BONUS.TEN_PLUS,
      label: `대량구매(${QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT_MINIMUM}개+)`,
    },
  ];

  // 조건에 맞는 첫 번째 룰 찾기
  const applicableRule = bulkBonusRules.find(
    (rule) => itemCount >= rule.threshold
  );

  if (!applicableRule) {
    return { points: 0, details: [] };
  }

  return {
    points: applicableRule.points,
    details: [`${applicableRule.label} +${applicableRule.points}p`],
  };
}

// 전체 포인트 계산
function calculateTotalBonusPoints() {
  if (cartDisplay.children.length === 0) {
    return { totalPoints: 0, pointsDetail: [] };
  }

  const cartProducts = parseCartProducts();

  // 기본 포인트
  const basePoints = calculateBasePoints(totalAmount);
  let pointsDetail = basePoints > 0 ? [`기본: ${basePoints}p`] : [];

  // 화요일 포인트
  const tuesdayResult = calculateTuesdayPoints(basePoints);
  let finalPoints = tuesdayResult.points;
  pointsDetail = pointsDetail.concat(tuesdayResult.detail);

  // 조합 보너스
  const productFlags = checkProductCombinations(cartProducts);
  const comboBonus = calculateComboBonus(productFlags);
  finalPoints += comboBonus.points;
  pointsDetail = pointsDetail.concat(comboBonus.details);

  // 대량구매 보너스
  const bulkBonus = calculateBulkBonus(itemCount);
  finalPoints += bulkBonus.points;
  pointsDetail = pointsDetail.concat(bulkBonus.details);

  return {
    totalPoints: finalPoints,
    pointsDetail,
  };
}

// ui 업데이트
function updatePointsDisplay(bonusPoints, pointsDetail) {
  const loyaltyPointsElement = document.getElementById('loyalty-points');
  if (!loyaltyPointsElement) return;

  if (bonusPoints > 0) {
    loyaltyPointsElement.innerHTML =
      `<div>적립 포인트: <span class="font-bold">${bonusPoints}p</span></div>` +
      `<div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>`;
    loyaltyPointsElement.style.display = 'block';
  } else {
    loyaltyPointsElement.textContent = '적립 포인트: 0p';
    loyaltyPointsElement.style.display = 'block';
  }
}

const doRenderBonusPoints = function () {
  try {
    const result = calculateTotalBonusPoints();

    bonusPoints = result.totalPoints;

    //  UI 업데이트
    updatePointsDisplay(result.totalPoints, result.pointsDetail);

    // 빈 장바구니일 때 숨기기
    if (cartDisplay.children.length === 0) {
      const loyaltyPointsElement = document.getElementById('loyalty-points');
      if (loyaltyPointsElement) {
        loyaltyPointsElement.style.display = 'none';
      }
    }
  } catch (error) {
    console.error('🚨 포인트 계산 중 오류 발생:', error);
    bonusPoints = 0;
    updatePointsDisplay(0, []);
  }
};

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
// 애플리케이션 시작점
// ==========================================

// 애플리케이션 초기화
main();

// ==========================================
// 이벤트 리스너들
// ==========================================

// 장바구니에 상품 추가 이벤트
addButton.addEventListener('click', function () {
  const selItem = productSelect.value;

  // 선택된 상품 유효성 검사
  let hasItem = false;
  for (let idx = 0; idx < PRODUCT_LIST.length; idx++) {
    if (PRODUCT_LIST[idx].id === selItem) {
      hasItem = true;
      break;
    }
  }
  if (!selItem || !hasItem) {
    return;
  }

  // 추가할 상품 정보 조회
  let itemToAdd = null;
  for (let j = 0; j < PRODUCT_LIST.length; j++) {
    if (PRODUCT_LIST[j].id === selItem) {
      itemToAdd = PRODUCT_LIST[j];
      break;
    }
  }

  // 재고 확인 및 장바구니 추가
  if (itemToAdd && itemToAdd.quantity > 0) {
    const item = document.getElementById(itemToAdd['id']);

    if (item) {
      // 기존 아이템 수량 증가
      const qtyElem = item.querySelector('.quantity-number');
      const newQty =
        parseInt(qtyElem['textContent']) +
        QUANTITY_THRESHOLDS.DEFAULT_QUANTITY_INCREMENT;
      if (newQty <= itemToAdd.quantity + parseInt(qtyElem.textContent)) {
        qtyElem.textContent = newQty;
        itemToAdd['quantity']--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      // 새 아이템 추가
      const newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className =
        'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';
      newItem.innerHTML = `
        <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
          <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
        </div>
        <div>
          <h3 class="text-base font-normal mb-1 tracking-tight">${itemToAdd.onSale && itemToAdd.suggestSale ? '⚡💝' : itemToAdd.onSale ? '⚡' : itemToAdd.suggestSale ? '💝' : ''}${itemToAdd.name}</h3>
          <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
          <p class="text-xs text-black mb-3">${itemToAdd.onSale || itemToAdd.suggestSale ? `<span class="line-through text-gray-400">₩${itemToAdd.originalPrice.toLocaleString()}</span> <span class="${itemToAdd.onSale && itemToAdd.suggestSale ? 'text-purple-600' : itemToAdd.onSale ? 'text-red-500' : 'text-blue-500'}">₩${itemToAdd.price.toLocaleString()}</span>` : `₩${itemToAdd.price.toLocaleString()}`}</p>
          <div class="flex items-center gap-4">
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="-1">−</button>
            <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">${QUANTITY_THRESHOLDS.INITIAL_CART_QUANTITY}</span>
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="1">+</button>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg mb-2 tracking-tight tabular-nums">${itemToAdd.onSale || itemToAdd.suggestSale ? `<span class="line-through text-gray-400">₩${itemToAdd.originalPrice.toLocaleString()}</span> <span class="${itemToAdd.onSale && itemToAdd.suggestSale ? 'text-purple-600' : itemToAdd.onSale ? 'text-red-500' : 'text-blue-500'}">₩${itemToAdd.price.toLocaleString()}</span>` : `₩${itemToAdd.price.toLocaleString()}`}</div>
          <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${itemToAdd.id}">Remove</a>
        </div>
      `;
      cartDisplay.appendChild(newItem);
      itemToAdd.quantity--;
    }

    // UI 업데이트
    handleCalculateCartStuff();
    lastSelectedProduct = selItem;
  }
});

// 장바구니 수량 변경 및 삭제 이벤트
cartDisplay.addEventListener('click', function (event) {
  const target = event.target;

  if (
    target.classList.contains('quantity-change') ||
    target.classList.contains('remove-item')
  ) {
    const prodId = target.dataset.productId;
    const itemElem = document.getElementById(prodId);
    let prod = null;

    // 상품 정보 조회
    for (let prdIdx = 0; prdIdx < PRODUCT_LIST.length; prdIdx++) {
      if (PRODUCT_LIST[prdIdx].id === prodId) {
        prod = PRODUCT_LIST[prdIdx];
        break;
      }
    }

    if (target.classList.contains('quantity-change')) {
      // 수량 변경 처리
      const qtyChange = parseInt(target.dataset.change);
      const qtyElem = itemElem.querySelector('.quantity-number');
      const currentQty = parseInt(qtyElem.textContent);
      const newQty = currentQty + qtyChange;

      if (newQty > 0 && newQty <= prod.quantity + currentQty) {
        qtyElem.textContent = newQty;
        prod.quantity -= qtyChange;
      } else if (newQty <= 0) {
        prod.quantity += currentQty;
        itemElem.remove();
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (target.classList.contains('remove-item')) {
      // 아이템 제거 처리
      const qtyElem = itemElem.querySelector('.quantity-number');
      const remQty = parseInt(qtyElem.textContent);
      prod.quantity += remQty;
      itemElem.remove();
    }

    // 재고 부족 상품 체크 (미사용 코드)
    if (prod && prod.quantity < QUANTITY_THRESHOLDS.LOW_STOCK_WARNING) {
    }

    // UI 업데이트
    handleCalculateCartStuff();
    updateProductOptions();
  }
});
