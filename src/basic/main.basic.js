// =============================================================================
// MODULE IMPORTS
// =============================================================================

// 타이머 관리 모듈 import
import {
  startLightningSaleTimer,
  startRecommendationTimer,
  stopAllTimers,
} from './modules/promotion/promotionScheduler.js';

// Product data and constants import
import {
  DISCOUNT_RATES,
  STOCK_WARNING_THRESHOLD,
  LOW_STOCK_THRESHOLD,
  productList,
  findProductById,
  getTotalStock,
} from './modules/data/productData.js';

// Discount service import
import { calculateDiscounts } from './modules/services/discountService.js';

// Loyalty service import
import { calculateLoyaltyPoints } from './modules/services/loyaltyService.js';

// Cart state management import
import {
  getProductSelectElement,
  getCartItemsContainer,
  getCartTotalDisplay,
  getLastSelectedProductId,
  setLastSelectedProductId,
  calculateCartItems,
  updateExistingCartItem,
  handleQuantityChange,
  handleRemoveItem,
  initializeCartState,
} from './modules/cart/cartState.js';

// UI Renderer import
import {
  Header,
  ProductSelector,
  CartDisplay,
  OrderSummary,
  ManualOverlay,
  CartItem,
  updateStockInfo,
  updateItemCountDisplay,
  updateSummaryDetails,
  updateDiscountInfo,
  updateTuesdaySpecialDisplay,
  updateLoyaltyPointsDisplay,
} from './modules/ui/uiRenderer.js';

// 상수 import
import { 
  CURRENCY_SYMBOL, 
  SOLD_OUT_TEXT, 
  ORANGE_COLOR, 
  EMPTY_STRING,
  CSS_CLASSES,
  ERROR_MESSAGES,
  CONSOLE_MESSAGES
} from './constants/ui.js';
import { 
  DISCOUNT_ICONS, 
  DISCOUNT_LABELS, 
  DISCOUNT_TEXTS, 
  DISCOUNT_PERCENTAGES 
} from './constants/discount.js';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

// 중복 코드 제거를 위한 헬퍼 함수들
function getRequiredElement(
  getterFunction,
  errorMessage = ERROR_MESSAGES.PRODUCT_SELECT_NOT_FOUND
) {
  const element = getterFunction();
  if (!element) {
    console.warn(errorMessage);
    return null;
  }
  return element;
}

function getRequiredProduct(productId, errorMessage = ERROR_MESSAGES.PRODUCT_NOT_FOUND) {
  const product = findProductById(productId);
  if (!product) {
    console.warn(errorMessage);
    return null;
  }
  return product;
}

// DOM 요소 캐싱을 위한 전역 변수
let cachedElements = {};

// 캐시된 DOM 요소 가져오기
function getCachedElement(selector, container = document) {
  const cacheKey = `${selector}_${container === document ? 'doc' : container.id || 'unknown'}`;
  if (!cachedElements[cacheKey]) {
    cachedElements[cacheKey] = container.querySelector(selector);
  }
  return cachedElements[cacheKey];
}

// 캐시 초기화
function clearElementCache() {
  cachedElements = {};
}

// 이전 상태를 저장하기 위한 변수들
let previousCartState = {
  totalQuantity: 0,
  subtotal: 0,
  totalAmount: 0,
  discountRate: 0,
  finalPoints: 0,
  items: []
};

// 상태 변경 감지 함수
function hasCartStateChanged(newState) {
  return (
    previousCartState.totalQuantity !== newState.totalQuantity ||
    previousCartState.subtotal !== newState.subtotal ||
    previousCartState.totalAmount !== newState.totalAmount ||
    previousCartState.discountRate !== newState.discountRate ||
    previousCartState.finalPoints !== newState.finalPoints ||
    JSON.stringify(previousCartState.items) !== JSON.stringify(newState.items)
  );
}

// 상태 업데이트
function updatePreviousCartState(newState) {
  previousCartState = { ...newState };
}

// =============================================================================
// DISCOUNT & STYLING UTILITIES
// =============================================================================

function getDiscountIcon(product) {
  return `${product.isFlashSale ? DISCOUNT_ICONS.FLASH_SALE : ''}${product.isRecommended ? DISCOUNT_ICONS.RECOMMENDATION : ''}`;
}

function getDiscountClassName(product) {
  if (product.isFlashSale && product.isRecommended) {
    return CSS_CLASSES.PURPLE_BOLD;
  } else if (product.isFlashSale) {
    return CSS_CLASSES.RED_BOLD;
  } else if (product.isRecommended) {
    return CSS_CLASSES.BLUE_BOLD;
  }
  return EMPTY_STRING;
}

function formatPrice(price) {
  return CURRENCY_SYMBOL + price.toLocaleString();
}

// =============================================================================
// PRODUCT SELECTOR FUNCTIONS
// =============================================================================

function createProductOption(product) {
  const option = document.createElement('option');
  option.value = product.id;

  const discountText =
    getDiscountIcon(product) +
    (product.isFlashSale ? DISCOUNT_TEXTS.SALE : '') +
    (product.isRecommended ? DISCOUNT_TEXTS.RECOMMEND : '');

  if (product.stockQuantity === 0) {
    option.textContent = `${product.name} - ${product.price}원 (${SOLD_OUT_TEXT})${discountText}`;
    option.disabled = true;
    option.className = CSS_CLASSES.GRAY;
  } else {
    const discountIcon = getDiscountIcon(product);
    const className = getDiscountClassName(product);

    if (product.isFlashSale || product.isRecommended) {
      const discountPercent =
        product.isFlashSale && product.isRecommended
          ? DISCOUNT_PERCENTAGES.SUPER_SALE
          : product.isFlashSale
            ? DISCOUNT_PERCENTAGES.FLASH_SALE
            : DISCOUNT_PERCENTAGES.RECOMMENDATION;
      const discountLabel =
        product.isFlashSale && product.isRecommended
          ? DISCOUNT_LABELS.SUPER_SALE
          : product.isFlashSale
            ? DISCOUNT_LABELS.SALE
            : DISCOUNT_LABELS.RECOMMEND;
      option.textContent = `${discountIcon}${product.name} - ${product.originalPrice}원 → ${product.price}원 (${discountPercent}% ${discountLabel})`;
      option.className = className;
    } else {
      option.textContent = `${product.name} - ${product.price}원${discountText}`;
    }
  }

  return option;
}

// 성능 최적화된 상품 옵션 업데이트
function updateSelectOptions() {
  const productSelectElement = getRequiredElement(
    getProductSelectElement,
    'Product select element not found'
  );
  if (!productSelectElement) return 0;

  const totalStock = getTotalStock();

  // DocumentFragment 사용으로 DOM 조작 최적화
  const fragment = document.createDocumentFragment();
  productList.forEach((product) => {
    const option = createProductOption(product);
    fragment.appendChild(option);
  });

  // 한 번의 DOM 조작으로 모든 옵션 추가
  productSelectElement.innerHTML = '';
  productSelectElement.appendChild(fragment);

  // 캐시 초기화 (DOM이 변경되었으므로)
  clearElementCache();

  if (totalStock < LOW_STOCK_THRESHOLD) {
    productSelectElement.style.borderColor = ORANGE_COLOR;
  } else {
    productSelectElement.style.borderColor = EMPTY_STRING;
  }

  return totalStock;
}

// =============================================================================
// CART DISPLAY UPDATE FUNCTIONS
// =============================================================================

function updatePricesInCart() {
  const cartItemsContainer = getRequiredElement(
    getCartItemsContainer,
    'Cart items container not found'
  );
  if (!cartItemsContainer) return;

  const cartItems = cartItemsContainer.children;

  for (let i = 0; i < cartItems.length; i++) {
    const itemElement = cartItems[i];
    const product = getRequiredProduct(
      itemElement.id,
      `Product with id ${itemElement.id} not found`
    );

    if (product) {
      updateCartItemDisplay(itemElement, product);
    }
  }

  updateCartCalculations();
}

function updateCartItemDisplay(itemElement, product) {
  const priceDiv = getCachedElement('.text-lg', itemElement);
  const nameDiv = getCachedElement('h3', itemElement);

  if (priceDiv) {
    updatePriceDisplay(priceDiv, product);
  }

  if (nameDiv) {
    nameDiv.textContent = getDiscountIcon(product) + product.name;
  }
}

// 성능 최적화된 가격 표시 업데이트
function updatePriceDisplay(priceDiv, product) {
  // 기존 내용을 한 번에 업데이트
  if (!product.isFlashSale && !product.isRecommended) {
    priceDiv.textContent = formatPrice(product.price);
    return;
  }

  // 할인가 표시를 위한 최적화된 DOM 조작
  const originalPriceSpan = document.createElement('span');
  originalPriceSpan.className = CSS_CLASSES.LINE_THROUGH;
  originalPriceSpan.textContent = formatPrice(product.originalPrice);

  const currentPriceSpan = document.createElement('span');
  currentPriceSpan.className = getDiscountClassName(product);
  currentPriceSpan.textContent = formatPrice(product.price);

  // DocumentFragment 사용으로 DOM 조작 최적화
  const fragment = document.createDocumentFragment();
  fragment.appendChild(originalPriceSpan);
  fragment.appendChild(document.createTextNode(' '));
  fragment.appendChild(currentPriceSpan);

  priceDiv.innerHTML = '';
  priceDiv.appendChild(fragment);
}

// =============================================================================
// EVENT HANDLERS
// =============================================================================

// 장바구니에 상품 추가 - 메인 함수
function insertProductToCart() {
  const elements = validateRequiredElements();
  if (!elements) return null;
  
  const product = validateSelectedProduct(elements.productSelect);
  if (!product) return null;
  
  addProductToCart(product, elements.cartContainer);
  updateCartCalculations();
  setLastSelectedProductId(product.id);
}

// 필수 DOM 요소 검증
function validateRequiredElements() {
  const productSelectElement = getRequiredElement(
    getProductSelectElement,
    'Product select element not found'
  );
  const cartItemsContainer = getRequiredElement(
    getCartItemsContainer,
    'Cart items container not found'
  );
  const cartTotalDisplay = getRequiredElement(
    getCartTotalDisplay,
    'Cart total display not found'
  );

  if (!productSelectElement || !cartItemsContainer || !cartTotalDisplay) {
    return null;
  }

  return {
    productSelect: productSelectElement,
    cartContainer: cartItemsContainer,
    totalDisplay: cartTotalDisplay
  };
}

// 선택된 상품 검증
function validateSelectedProduct(productSelectElement) {
  const selectedProduct = getRequiredProduct(
    productSelectElement.value,
    ERROR_MESSAGES.SELECTED_PRODUCT_NOT_FOUND
  );
  
  if (!selectedProduct || selectedProduct.stockQuantity <= 0) {
    return null;
  }
  
  return selectedProduct;
}

// 장바구니에 상품 추가
function addProductToCart(product, cartItemsContainer) {
  const existingCartItem = document.getElementById(product.id);
  
  if (existingCartItem) {
    updateExistingCartItem(existingCartItem, product);
  } else {
    const cartItemElement = CartItem(product);
    cartItemsContainer.appendChild(cartItemElement);
    product.stockQuantity--;
  }
}

// 장바구니 아이템 클릭 이벤트 처리 - 메인 함수
function handleCartItemClick(event) {
  const action = determineCartAction(event.target);
  if (!action) return;
  
  const productId = event.target.dataset.productId;
  const product = getRequiredProduct(
    productId,
    `Product with id ${productId} not found`
  );
  if (!product) return;
  
  executeCartAction(action, productId, product);
  handleStockWarning(product);
  updateCartCalculations();
  updateSelectOptions();
}

// 이벤트에서 액션 결정
function determineCartAction(target) {
  if (target.classList.contains('quantity-change')) {
    return createQuantityChangeAction(target);
  }
  if (target.classList.contains('remove-item')) {
    return createRemoveItemAction();
  }
  return null;
}

// 수량 변경 액션 생성
function createQuantityChangeAction(target) {
  return { 
    type: 'quantity-change', 
    amount: parseInt(target.dataset.change) 
  };
}

// 아이템 제거 액션 생성
function createRemoveItemAction() {
  return { type: 'remove-item' };
}

// 장바구니 액션 실행
function executeCartAction(action, productId, product) {
  switch (action.type) {
    case 'quantity-change':
      handleQuantityChange(productId, action.amount);
      break;
    case 'remove-item':
      handleRemoveItem(productId);
      break;
  }
}

// 재고 경고 처리
function handleStockWarning(product) {
  if (product.stockQuantity < STOCK_WARNING_THRESHOLD) {
    console.warn(
      CONSOLE_MESSAGES.STOCK_WARNING(product.name, product.stockQuantity)
    );

    if (product.stockQuantity <= 2) {
      console.log(CONSOLE_MESSAGES.STOCK_CRITICAL(product.name));
    }
  }
}

// =============================================================================
// TIMER MANAGEMENT
// =============================================================================

// 타이머 정리 함수 (모듈 함수 래핑)
function cleanupTimers() {
  stopAllTimers();
}

// 타이머 관련 로직 분리
function startPromotionalTimers() {
  startLightningSaleTimer(productList, updateSelectOptions, updatePricesInCart);
  startRecommendationTimer(
    productList,
    getLastSelectedProductId,
    updateSelectOptions,
    updatePricesInCart
  );
}

// =============================================================================
// APP INITIALIZATION
// =============================================================================

// 초기화 함수
function initializeApp() {
  const rootElement = document.getElementById('app');
  
  const components = createAppComponents();
  const layout = createAppLayout(components);
  
  appendComponentsToDOM(rootElement, components, layout);
  initializeAppState();
}

// 앱 컴포넌트 생성
function createAppComponents() {
  return {
    header: Header(),
    productSelector: ProductSelector(),
    cartDisplay: CartDisplay(),
    orderSummary: OrderSummary(),
    manualOverlay: ManualOverlay(),
  };
}

// 앱 레이아웃 생성
function createAppLayout(components) {
  const gridContainer = createGridContainer();
  const leftColumn = createLeftColumn(components.productSelector, components.cartDisplay);
  
  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(components.orderSummary);
  
  return gridContainer;
}

// 그리드 컨테이너 생성
function createGridContainer() {
  const gridContainer = document.createElement('div');
  gridContainer.className = 'grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6';
  return gridContainer;
}

// 좌측 컬럼 생성
function createLeftColumn(productSelector, cartDisplay) {
  const leftColumn = document.createElement('div');
  leftColumn.className = 'space-y-6';
  leftColumn.appendChild(productSelector);
  leftColumn.appendChild(cartDisplay);
  return leftColumn;
}

// DOM에 컴포넌트 추가
function appendComponentsToDOM(rootElement, components, layout) {
  rootElement.appendChild(components.header);
  rootElement.appendChild(layout);
  
  // ManualOverlay는 객체를 반환하므로 개별 요소를 추가
  const { manualToggle, manualOverlay } = components.manualOverlay;
  rootElement.appendChild(manualToggle);
  rootElement.appendChild(manualOverlay);
}

// 앱 상태 초기화
function initializeAppState() {
  updateSelectOptions();
}

// 이벤트 리스너 설정
function setupEventListeners() {
  setupCartItemEventListeners();
  setupAddToCartEventListeners();
}

// 장바구니 아이템 이벤트 리스너 설정
function setupCartItemEventListeners() {
  const cartItemsContainer = getCartItemsContainer();
  if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', handleCartItemClick);
  }
}

// 장바구니 추가 이벤트 리스너 설정
function setupAddToCartEventListeners() {
  const addBtn = document.getElementById('add-to-cart');
  if (addBtn) {
    addBtn.addEventListener('click', insertProductToCart);
  }
}

// =============================================================================
// CALCULATION FUNCTIONS
// =============================================================================

function calculateCartItemsData(cartItems) {
  const cartData = calculateCartItems(cartItems);
  return {
    items: cartData.items,
    subtotal: cartData.subtotal,
    totalQuantity: cartData.totalQuantity
  };
}

// 할인 데이터 계산
function calculateDiscountData(cartData) {
  return calculateDiscounts(cartData);
}

// 적립 포인트 계산
function calculateLoyaltyData(cartData, discountData, cartItems) {
  const { totalQuantity } = cartData;
  const { totalAmount } = discountData;
  const productIds = Array.from(cartItems).map(item => item.id);
  return calculateLoyaltyPoints(
    totalAmount,
    totalQuantity,
    productIds
  );
}

// 장바구니 요약 계산 - 메인 함수
function calculateCartSummary(cartItems) {
  const cartData = calculateCartItemsData(cartItems);
  const discountData = calculateDiscountData(cartData);
  const loyaltyData = calculateLoyaltyData(cartData, discountData, cartItems);

  return {
    ...cartData,
    discountData,
    loyaltyData
  };
}

// 장바구니 계산 업데이트 - 메인 함수
function updateCartCalculations() {
  const cartItemsContainer = getRequiredElement(
    getCartItemsContainer,
    ERROR_MESSAGES.CART_ITEMS_NOT_FOUND
  );
  const cartTotalDisplay = getRequiredElement(
    getCartTotalDisplay,
    ERROR_MESSAGES.CART_TOTAL_NOT_FOUND
  );
  if (!cartItemsContainer || !cartTotalDisplay) return null;

  const cartItems = cartItemsContainer.children;
  const summary = calculateCartSummary(cartItems);
  
  updateCartUI(summary, cartItems, cartTotalDisplay);
}

// 성능 최적화된 대량 구매 아이템 스타일링
function updateBulkItemStyling(items) {
  // 변경된 아이템만 스타일링
  items.forEach(({ product, quantity }) => {
    const itemElement = document.getElementById(product.id);
    if (!itemElement) return;

    const priceElements = itemElement.querySelectorAll('.text-lg');
    const isBulkPurchase = quantity >= DISCOUNT_RATES.INDIVIDUAL_DISCOUNT_THRESHOLD;
    
    // 현재 스타일과 비교하여 변경이 있을 때만 업데이트
    priceElements.forEach((elem) => {
      const currentWeight = elem.style.fontWeight;
      const newWeight = isBulkPurchase ? 'bold' : 'normal';
      
      if (currentWeight !== newWeight) {
        elem.style.fontWeight = newWeight;
      }
    });
  });
}

// 성능 최적화된 UI 업데이트 함수
function updateCartUI(summary, cartItems, cartTotalDisplay) {
  const { items, subtotal, totalQuantity, discountData, loyaltyData } = summary;
  const { totalAmount: calculatedTotalAmount, itemDiscounts, discountRate } = discountData;
  const { finalPoints, pointsDetail } = loyaltyData;

  // 새로운 상태 객체 생성
  const newCartState = {
    totalQuantity,
    subtotal,
    totalAmount: calculatedTotalAmount,
    discountRate,
    finalPoints,
    items: items.map(item => ({ id: item.product.id, quantity: item.quantity }))
  };

  // 상태 변경이 있을 때만 UI 업데이트
  if (hasCartStateChanged(newCartState)) {
    // Update visual styling for bulk items
    updateBulkItemStyling(items);

    // Update UI components
    updateItemCountDisplay(totalQuantity);
    updateSummaryDetails(cartItems, subtotal, itemDiscounts);
    updateDiscountInfo(discountRate, calculatedTotalAmount, subtotal);
    updateTuesdaySpecialDisplay();

    // Update total display (캐시된 요소 사용)
    updateTotalDisplay(cartTotalDisplay, calculatedTotalAmount);

    // Update loyalty points display
    updateLoyaltyPointsDisplay(finalPoints, pointsDetail);

    // Update stock information
    updateStockInfo();

    // 상태 업데이트
    updatePreviousCartState(newCartState);
  }
}

// 성능 최적화된 총액 표시 업데이트
function updateTotalDisplay(cartTotalDisplay, calculatedTotalAmount) {
  const totalDiv = getCachedElement('.text-2xl', cartTotalDisplay);
  if (totalDiv) {
    const formattedAmount = formatPrice(Math.round(calculatedTotalAmount));
    if (totalDiv.textContent !== formattedAmount) {
      totalDiv.textContent = formattedAmount;
    }
  }
}

// =============================================================================
// MAIN APPLICATION LOGIC
// =============================================================================

// 최종 main 함수
function main() {
  // 기존 타이머 정리
  cleanupTimers();

  // 초기화 함수들 호출
  initializeCartState();
  initializeApp();
  setupEventListeners();
  startPromotionalTimers();
}

// 앱 정리 함수
function cleanupApp() {
  cleanupTimers();
  clearElementCache();
}

// =============================================================================
// EVENT LISTENERS & APP STARTUP
// =============================================================================

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', cleanupApp);

main();
