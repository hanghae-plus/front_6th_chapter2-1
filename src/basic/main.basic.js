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

// 중복 코드 제거를 위한 헬퍼 함수들
function getRequiredElement(
  getterFunction,
  errorMessage = 'Required element not found'
) {
  const element = getterFunction();
  if (!element) {
    console.warn(errorMessage);
    return null;
  }
  return element;
}

function getRequiredProduct(productId, errorMessage = 'Product not found') {
  const product = findProductById(productId);
  if (!product) {
    console.warn(errorMessage);
    return null;
  }
  return product;
}

function getDiscountIcon(product) {
  return `${product.isFlashSale ? '⚡' : ''}${product.isRecommended ? '💝' : ''}`;
}

function getDiscountClassName(product) {
  if (product.isFlashSale && product.isRecommended) {
    return 'text-purple-600 font-bold';
  } else if (product.isFlashSale) {
    return 'text-red-500 font-bold';
  } else if (product.isRecommended) {
    return 'text-blue-500 font-bold';
  }
  return '';
}

function formatPrice(price) {
  return '₩' + price.toLocaleString();
}

function createProductOption(product) {
  const option = document.createElement('option');
  option.value = product.id;

  const discountText =
    getDiscountIcon(product) +
    (product.isFlashSale ? 'SALE' : '') +
    (product.isRecommended ? '추천' : '');

  if (product.stockQuantity === 0) {
    option.textContent = `${product.name} - ${product.price}원 (품절)${discountText}`;
    option.disabled = true;
    option.className = 'text-gray-400';
  } else {
    const discountIcon = getDiscountIcon(product);
    const className = getDiscountClassName(product);

    if (product.isFlashSale || product.isRecommended) {
      const discountPercent =
        product.isFlashSale && product.isRecommended
          ? 25
          : product.isFlashSale
            ? 20
            : 5;
      const discountLabel =
        product.isFlashSale && product.isRecommended
          ? 'SUPER SALE!'
          : product.isFlashSale
            ? 'SALE!'
            : '추천할인!';
      option.textContent = `${discountIcon}${product.name} - ${product.originalPrice}원 → ${product.price}원 (${discountPercent}% ${discountLabel})`;
      option.className = className;
    } else {
      option.textContent = `${product.name} - ${product.price}원${discountText}`;
    }
  }

  return option;
}

function updateSelectOptions() {
  const productSelectElement = getRequiredElement(
    getProductSelectElement,
    'Product select element not found'
  );
  if (!productSelectElement) return 0;

  productSelectElement.innerHTML = '';
  const totalStock = getTotalStock();

  productList.forEach((product) => {
    const option = createProductOption(product);
    productSelectElement.appendChild(option);
  });

  if (totalStock < LOW_STOCK_THRESHOLD) {
    productSelectElement.style.borderColor = 'orange';
  } else {
    productSelectElement.style.borderColor = '';
  }

  return totalStock;
}

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
  const priceDiv = itemElement.querySelector('.text-lg');
  const nameDiv = itemElement.querySelector('h3');

  if (priceDiv) {
    updatePriceDisplay(priceDiv, product);
  }

  if (nameDiv) {
    nameDiv.textContent = getDiscountIcon(product) + product.name;
  }
}

function updatePriceDisplay(priceDiv, product) {
  // 기존 내용 제거
  priceDiv.innerHTML = '';

  if (!product.isFlashSale && !product.isRecommended) {
    const priceSpan = document.createElement('span');
    priceSpan.textContent = formatPrice(product.price);
    priceDiv.appendChild(priceSpan);
    return;
  }

  // 할인가 표시
  const originalPriceSpan = document.createElement('span');
  originalPriceSpan.className = 'line-through text-gray-400';
  originalPriceSpan.textContent = formatPrice(product.originalPrice);

  const currentPriceSpan = document.createElement('span');
  currentPriceSpan.className = getDiscountClassName(product);
  currentPriceSpan.textContent = formatPrice(product.price);

  priceDiv.appendChild(originalPriceSpan);
  priceDiv.appendChild(document.createTextNode(' '));
  priceDiv.appendChild(currentPriceSpan);
}

// 이벤트 핸들러 함수들
function insertProductToCart() {
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

  if (!productSelectElement || !cartItemsContainer || !cartTotalDisplay)
    return null;

  const selectedProduct = getRequiredProduct(
    productSelectElement.value,
    'Selected product not found'
  );
  if (!selectedProduct || selectedProduct.stockQuantity <= 0) return null;

  const existingCartItem = document.getElementById(selectedProduct.id);
  if (existingCartItem) {
    updateExistingCartItem(existingCartItem, selectedProduct);
  } else {
    const cartItemElement = CartItem(selectedProduct);
    cartItemsContainer.appendChild(cartItemElement);
    selectedProduct.stockQuantity--;
  }

  updateCartCalculations();
  setLastSelectedProductId(selectedProduct.id);
}

function handleCartItemClick(event) {
  const targetElement = event.target;

  if (
    !targetElement.classList.contains('quantity-change') &&
    !targetElement.classList.contains('remove-item')
  ) {
    return;
  }

  const productId = targetElement.dataset.productId;
  const product = getRequiredProduct(
    productId,
    `Product with id ${productId} not found`
  );

  if (!product) return;

  if (targetElement.classList.contains('quantity-change')) {
    const changeAmount = parseInt(targetElement.dataset.change);
    handleQuantityChange(productId, changeAmount);
  } else if (targetElement.classList.contains('remove-item')) {
    handleRemoveItem(productId);
  }

  // 재고가 부족한 경우 처리 (현재는 빈 블록이지만 향후 확장 가능)
  if (product && product.stockQuantity < STOCK_WARNING_THRESHOLD) {
    // 재고 부족 알림 로직 추가 가능
    console.warn(
      `⚠️ ${product.name}의 재고가 부족합니다. (${product.stockQuantity}개 남음)`
    );

    // 재고가 매우 적을 때 (2개 이하) 사용자에게 알림
    if (product.stockQuantity <= 2) {
      console.log(`🚨 ${product.name}의 재고가 거의 소진되었습니다!`);
    }
  }

  updateCartCalculations();
  updateSelectOptions();
}

// 타이머 정리 함수 (모듈 함수 래핑)
function cleanupTimers() {
  stopAllTimers();
}

// 초기화 함수
function initializeApp() {
  const rootElement = document.getElementById('app');

  // DOM 요소들 생성 (컴포넌트 사용)
  const header = Header();
  const productSelector = ProductSelector();
  const cartDisplay = CartDisplay();
  const orderSummary = OrderSummary();
  const { manualToggle, manualOverlay } = ManualOverlay();

  // 레이아웃 구성
  const gridContainer = document.createElement('div');
  gridContainer.className =
    'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';

  const leftColumn = document.createElement('div');
  leftColumn.className = 'bg-white border border-gray-200 p-8 overflow-y-auto';
  leftColumn.appendChild(productSelector);
  leftColumn.appendChild(cartDisplay);

  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(orderSummary);

  // DOM에 추가
  rootElement.appendChild(header);
  rootElement.appendChild(gridContainer);
  rootElement.appendChild(manualToggle);
  rootElement.appendChild(manualOverlay);

  // 초기 상태 설정
  updateSelectOptions();
  updateCartCalculations();

  // 이벤트 리스너 설정
  const addToCartBtn = document.getElementById('add-to-cart');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', insertProductToCart);
  }
}

function updateCartCalculations() {
  const cartItemsContainer = getRequiredElement(
    getCartItemsContainer,
    'Cart items container not found'
  );
  const cartTotalDisplay = getRequiredElement(
    getCartTotalDisplay,
    'Cart total display not found'
  );
  if (!cartItemsContainer || !cartTotalDisplay) return null;

  const cartItems = cartItemsContainer.children;

  // Calculate cart items and totals
  const cartData = calculateCartItems(cartItems);
  const { items, subtotal, totalQuantity } = cartData;

  // Calculate discounts
  const discountData = calculateDiscounts(cartData);
  const {
    totalAmount: calculatedTotalAmount,
    itemDiscounts,
    discountRate,
  } = discountData;

  // Update global state
  // setTotalAmount(calculatedTotalAmount); // This line was removed from imports
  // setItemCount(totalQuantity); // This line was removed from imports

  // Update visual styling for bulk items
  items.forEach(({ product, quantity }) => {
    const itemElement = document.getElementById(product.id);
    if (itemElement) {
      const priceElements = itemElement.querySelectorAll('.text-lg, .text-xs');
      priceElements.forEach((elem) => {
        if (elem.classList.contains('text-lg')) {
          elem.style.fontWeight =
            quantity >= DISCOUNT_RATES.INDIVIDUAL_DISCOUNT_THRESHOLD
              ? 'bold'
              : 'normal';
        }
      });
    }
  });

  // Update UI
  updateItemCountDisplay(totalQuantity);
  updateSummaryDetails(cartItems, subtotal, itemDiscounts);
  updateDiscountInfo(discountRate, calculatedTotalAmount, subtotal);
  updateTuesdaySpecialDisplay();

  // Update total display
  const totalDiv = cartTotalDisplay.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = formatPrice(Math.round(calculatedTotalAmount));
  }

  // Calculate and display loyalty points
  const { finalPoints, pointsDetail } = calculateLoyaltyPoints(
    calculatedTotalAmount,
    totalQuantity,
    Array.from(cartItems)
  );
  updateLoyaltyPointsDisplay(finalPoints, pointsDetail);

  // Update stock information
  updateStockInfo();
}

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

// 이벤트 리스너 등록 로직 분리
function setupEventListeners() {
  getCartItemsContainer().addEventListener('click', handleCartItemClick);
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

// 앱 정리 함수
function cleanupApp() {
  cleanupTimers();
}

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', cleanupApp);

main();
