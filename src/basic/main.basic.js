import App from './App.js';
import { createTimerManager } from './components/TimerManager.js';
import CartItem from './components/cart/CartItem.js';
import ProductPrice from './components/cart/ProductPrice.js';
import { DISCOUNT_RATE_TUESDAY } from './data/discount.data.js';
import { PRODUCT_LIST } from './data/product.data.js';
import { MIN_QUANTITY_FOR_DISCOUNT } from './data/quantity.data.js';
import { useDiscount, useOrderSummary, usePoint, useStock } from './hooks/index.js';
import {
  hasValidProduct,
  isExistingCartItem,
  isQuantityChangeButton,
  isQuantityValid,
  isRemoveButton,
  parseQuantityFromElement,
} from './utils/cart.util.js';
import { isProductDiscountEligible } from './utils/discount.util.js';
import { createProductName, findProductById } from './utils/product.util.js';
import { validateStockAvailability } from './utils/stock.util.js';

// ============================================================================
// 애플리케이션 상태 관리
// ============================================================================
class AppState {
  constructor() {
    this.totalQuantity = 0;
    this.lastSelectedProductId = null;
    this.totalPrice = 0;
  }

  updateState(newState) {
    Object.assign(this, newState);
  }

  getState() {
    return {
      totalQuantity: this.totalQuantity,
      lastSelectedProductId: this.lastSelectedProductId,
      totalPrice: this.totalPrice,
    };
  }
}

// ============================================================================
// DOM 요소 관리
// ============================================================================
class DOMManager {
  constructor() {
    this.elements = {
      stockStatus: null,
      productSelect: null,
      addToCartButton: null,
      cartItemsContainer: null,
    };
  }

  initialize() {
    this.elements = {
      stockStatus: document.querySelector('#stock-status'),
      productSelect: document.querySelector('#product-select'),
      addToCartButton: document.querySelector('#add-to-cart'),
      cartItemsContainer: document.querySelector('#cart-items'),
    };
  }

  getElement(name) {
    return this.elements[name];
  }

  getAllElements() {
    return this.elements;
  }
}

// ============================================================================
// 전역 인스턴스 (최소화된 전역 상태)
// ============================================================================
const appState = new AppState();
const domManager = new DOMManager();

// ============================================================================
// 비즈니스 로직 레이어 (Hook 기반)
// ============================================================================

/**
 * 장바구니 계산과 관련된 모든 비즈니스 로직을 처리
 */
const useCartCalculation = cartItemsContainer => {
  const discountData = useDiscount(cartItemsContainer);
  const orderData = useOrderSummary(cartItemsContainer);
  const pointData = usePoint(cartItemsContainer);
  const stockData = useStock();

  return {
    // 할인 정보
    isBulkDiscount: discountData.isBulkDiscount,
    isTuesday: discountData.isTuesday,
    totalQuantity: discountData.totalQuantity,

    // 주문 정보
    subTotal: orderData.subTotal,
    totalPrice: orderData.totalPrice,
    totalDiscountRate: orderData.totalDiscountRate,
    orderList: orderData.orderList,
    itemDiscounts: orderData.itemDiscounts,
    originalTotalPrice: orderData.originalTotalPrice,

    // 포인트 정보
    totalPoint: pointData.totalPoint,
    pointsDetail: pointData.pointsDetail,
    shouldShowPoints: pointData.shouldShowPoints,

    // 재고 정보
    stockStatusMessage: stockData.stockStatusMessage,
  };
};

// ============================================================================
// UI 레이어 (DOM 조작 함수들)
// ============================================================================

/**
 * 아이템 카운트 표시 업데이트
 */
const updateItemCountDisplay = totalQuantity => {
  const itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    itemCountElement.textContent = `🛍️ ${totalQuantity} items in cart`;
  }
};

/**
 * 주문 요약 표시 업데이트
 */
const updateOrderSummaryDisplay = (orderList, subTotal, itemDiscounts, isTuesday, totalPrice) => {
  const summaryDetailsElement = document.getElementById('summary-details');
  if (!summaryDetailsElement) return;

  if (subTotal <= 0) {
    summaryDetailsElement.innerHTML = '';
    return;
  }

  // 개별 상품 정보
  const productDetails = orderList
    .map(
      item => `
    <div class="flex justify-between text-xs tracking-wide text-gray-400">
      <span>${item.name} x ${item.quantity}</span>
      <span>₩${item.totalPrice.toLocaleString()}</span>
    </div>
  `
    )
    .join('');

  // 소계
  const subtotalSection = `
    <div class="border-t border-white/10 my-3"></div>
    <div class="flex justify-between text-sm tracking-wide">
      <span>Subtotal</span>
      <span>₩${subTotal.toLocaleString()}</span>
    </div>
  `;

  // 할인 정보
  const discountDetails = generateDiscountDetailsHTML(itemDiscounts, isTuesday, totalPrice);

  // 배송 정보
  const shippingSection = `
    <div class="flex justify-between text-sm tracking-wide text-gray-400">
      <span>Shipping</span>
      <span>Free</span>
    </div>
  `;

  summaryDetailsElement.innerHTML =
    productDetails + subtotalSection + discountDetails + shippingSection;
};

/**
 * 할인 상세 정보 HTML 생성
 */
const generateDiscountDetailsHTML = (itemDiscounts, isTuesday, totalPrice) => {
  let discountHTML = '';

  // 개별 할인 정보
  if (itemDiscounts.length > 0) {
    discountHTML += itemDiscounts
      .map(
        item => `
      <div class="flex justify-between text-sm tracking-wide text-green-400">
        <span class="text-xs">${item.name} (${MIN_QUANTITY_FOR_DISCOUNT}개↑)</span>
        <span class="text-xs">-${item.discount}%</span>
      </div>
    `
      )
      .join('');
  }

  // 화요일 특별 할인
  if (isTuesday && totalPrice > 0) {
    discountHTML += `
      <div class="flex justify-between text-sm tracking-wide text-purple-400">
        <span class="text-xs">🌟 화요일 추가 할인</span>
        <span class="text-xs">-${DISCOUNT_RATE_TUESDAY}%</span>
      </div>
    `;
  }

  return discountHTML;
};

/**
 * 총액 표시 업데이트
 */
const updateTotalPriceDisplay = totalPrice => {
  const cartTotalElement = document.getElementById('cart-total');
  const totalPriceDiv = cartTotalElement?.querySelector('.text-2xl');
  if (totalPriceDiv) {
    totalPriceDiv.textContent = `₩${Math.round(totalPrice).toLocaleString()}`;
  }
};

/**
 * 포인트 표시 업데이트
 */
const updateLoyaltyPointsDisplay = (totalPoint, pointsDetail, shouldShowPoints) => {
  const loyaltyPointsElement = document.getElementById('loyalty-points');
  if (!loyaltyPointsElement) return;

  if (!shouldShowPoints) {
    loyaltyPointsElement.style.display = 'none';
    return;
  }

  if (totalPoint > 0) {
    loyaltyPointsElement.innerHTML = `
      <div>적립 포인트: <span class="font-bold">${totalPoint}p</span></div>
      <div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>
    `;
  } else {
    loyaltyPointsElement.textContent = '적립 포인트: 0p';
  }
  loyaltyPointsElement.style.display = 'block';
};

/**
 * 할인 정보 표시 업데이트
 */
const updateDiscountInfoDisplay = (originalTotalPrice, totalDiscountRate) => {
  const discountInfoElement = document.getElementById('discount-info');
  if (!discountInfoElement) return;

  discountInfoElement.innerHTML = '';

  if (totalDiscountRate <= 0 || originalTotalPrice <= 0) return;

  const finalPrice = originalTotalPrice * (1 - totalDiscountRate);
  const savedAmount = originalTotalPrice - finalPrice;
  discountInfoElement.innerHTML = `
    <div class="bg-green-500/20 rounded-lg p-3">
      <div class="flex justify-between items-center mb-1">
        <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
        <span class="text-sm font-medium text-green-400">${(totalDiscountRate * 100).toFixed(1)}%</span>
      </div>
      <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
    </div>
  `;
};

/**
 * 재고 상태 표시 업데이트
 */
const updateStockStatusDisplay = stockStatusMessage => {
  const stockStatusElement = domManager.getElement('stockStatus');
  if (stockStatusElement) {
    stockStatusElement.textContent = stockStatusMessage;
  }
};

/**
 * 화요일 특별 할인 표시 업데이트
 */
const updateTuesdaySpecialDisplay = shouldShowTuesdaySpecial => {
  const tuesdaySpecialElement = document.getElementById('tuesday-special');
  if (tuesdaySpecialElement) {
    if (shouldShowTuesdaySpecial) {
      tuesdaySpecialElement.classList.remove('hidden');
    } else {
      tuesdaySpecialElement.classList.add('hidden');
    }
  }
};

/**
 * 할인 시각적 표시 업데이트
 */
const updateCartItemVisualDiscount = (cartItem, quantity) => {
  const priceElements = cartItem.querySelectorAll('.text-lg, .text-xs');
  priceElements.forEach(element => {
    if (element.classList.contains('text-lg')) {
      element.style.fontWeight = isProductDiscountEligible(quantity) ? 'bold' : 'normal';
    }
  });
};

// ============================================================================
// 메인 계산 및 UI 업데이트 함수
// ============================================================================

/**
 * 메인 장바구니 계산 및 UI 업데이트
 */
const calculateCartAndUpdateUI = () => {
  const cartItemsContainer = domManager.getElement('cartItemsContainer');

  // 비즈니스 로직 계산 (Hook 사용)
  const cartData = useCartCalculation(cartItemsContainer);

  // 상태 업데이트
  appState.updateState({
    totalQuantity: cartData.totalQuantity,
    totalPrice: cartData.totalPrice,
  });

  // UI 업데이트 (UI 레이어)
  updateItemCountDisplay(cartData.totalQuantity);
  updateOrderSummaryDisplay(
    cartData.orderList,
    cartData.subTotal,
    cartData.itemDiscounts,
    cartData.isTuesday,
    cartData.totalPrice
  );
  updateTotalPriceDisplay(cartData.totalPrice);
  updateLoyaltyPointsDisplay(cartData.totalPoint, cartData.pointsDetail, cartData.shouldShowPoints);
  updateDiscountInfoDisplay(cartData.originalTotalPrice, cartData.totalDiscountRate);
  updateStockStatusDisplay(cartData.stockStatusMessage);
  updateTuesdaySpecialDisplay(cartData.isTuesday);

  // 할인 시각적 표시 업데이트
  if (cartItemsContainer) {
    [...cartItemsContainer.children].forEach(cartItem => {
      const quantity = parseQuantityFromElement(cartItem.querySelector('.quantity-number'));
      updateCartItemVisualDiscount(cartItem, quantity);
    });
  }
};

/**
 * 실시간 가격 업데이트
 */
const updatePricesInCart = () => {
  const cartItemsContainer = domManager.getElement('cartItemsContainer');
  if (!cartItemsContainer) return;

  const cartItems = [...cartItemsContainer.children];

  // 각 장바구니 아이템의 가격 및 이름 업데이트
  cartItems.forEach(cartItem => {
    const itemId = cartItem.id;
    const product = findProductById(itemId, PRODUCT_LIST);

    if (product) {
      const priceDiv = cartItem.querySelector('.text-lg');
      const nameDiv = cartItem.querySelector('h3');

      if (priceDiv) priceDiv.innerHTML = ProductPrice(product);
      if (nameDiv) nameDiv.textContent = createProductName(product);
    }
  });

  calculateCartAndUpdateUI();
};

// ============================================================================
// 이벤트 핸들러 함수들
// ============================================================================

/**
 * 상품 추가 처리
 */
const handleAddToCart = () => {
  const productSelectElement = domManager.getElement('productSelect');
  const cartItemsContainer = domManager.getElement('cartItemsContainer');

  if (!productSelectElement || !cartItemsContainer) return;

  const selectedProductId = productSelectElement.value;

  // 유효한 상품인지 확인
  const productToAdd = findProductById(selectedProductId, PRODUCT_LIST);
  if (!selectedProductId || !hasValidProduct(productToAdd)) {
    return;
  }

  const existingCartItem = isExistingCartItem(productToAdd.id);

  if (existingCartItem) {
    // 기존 아이템 수량 증가
    const quantityElement = existingCartItem.querySelector('.quantity-number');
    const currentQuantity = parseQuantityFromElement(quantityElement);
    const newQuantity = currentQuantity + 1;

    if (validateStockAvailability(productToAdd, newQuantity, currentQuantity)) {
      quantityElement.textContent = newQuantity;
      productToAdd.q--;
    } else {
      alert('재고가 부족합니다.');
    }
  } else {
    // 새 아이템 추가
    const newCartItem = CartItem(productToAdd);
    cartItemsContainer.innerHTML += newCartItem;
    productToAdd.q--;
  }

  calculateCartAndUpdateUI();
  appState.updateState({ lastSelectedProductId: selectedProductId });
};

/**
 * 장바구니 아이템 액션 처리
 */
const handleCartItemAction = event => {
  const targetElement = event.target;

  if (!isQuantityChangeButton(targetElement) && !isRemoveButton(targetElement)) {
    return;
  }

  const productId = targetElement.dataset.productId;
  const cartItemElement = document.getElementById(productId);
  const product = findProductById(productId, PRODUCT_LIST);

  if (isQuantityChangeButton(targetElement)) {
    handleQuantityChange(targetElement, cartItemElement, product);
  } else if (isRemoveButton(targetElement)) {
    handleItemRemove(cartItemElement, product);
  }

  calculateCartAndUpdateUI();
};

/**
 * 수량 변경 처리
 */
const handleQuantityChange = (targetElement, cartItemElement, product) => {
  const quantityChange = parseInt(targetElement.dataset.change);
  const quantityElement = cartItemElement.querySelector('.quantity-number');
  const currentQuantity = parseQuantityFromElement(quantityElement);
  const newQuantity = currentQuantity + quantityChange;

  if (
    isQuantityValid(newQuantity) &&
    validateStockAvailability(product, newQuantity, currentQuantity)
  ) {
    quantityElement.textContent = newQuantity;
    product.q -= quantityChange;
  } else if (!isQuantityValid(newQuantity)) {
    product.q += currentQuantity;
    cartItemElement.remove();
  } else {
    alert('재고가 부족합니다.');
  }
};

/**
 * 아이템 삭제 처리
 */
const handleItemRemove = (cartItemElement, product) => {
  const quantityElement = cartItemElement.querySelector('.quantity-number');
  const removedQuantity = parseQuantityFromElement(quantityElement);
  product.q += removedQuantity;
  cartItemElement.remove();
};

// ============================================================================
// 애플리케이션 초기화
// ============================================================================
const initializeApp = () => {
  // 앱 진입점
  const root = document.getElementById('app');
  new App(root);

  // DOM 요소 초기화
  domManager.initialize();

  // 초기 장바구니 계산
  calculateCartAndUpdateUI();

  // 타이머 매니저 생성 및 모든 타이머 시작
  const timerManager = createTimerManager(updatePricesInCart, {
    lastSelectedProductId: appState.getState().lastSelectedProductId,
    cartItemsContainer: domManager.getElement('cartItemsContainer'),
  });

  timerManager.startAll();

  // 이벤트 리스너 설정
  const { addToCartButton, cartItemsContainer } = domManager.getAllElements();

  if (addToCartButton) {
    addToCartButton.addEventListener('click', handleAddToCart);
  }

  if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', handleCartItemAction);
  }
};

// ============================================================================
// 애플리케이션 시작
// ============================================================================
initializeApp();
