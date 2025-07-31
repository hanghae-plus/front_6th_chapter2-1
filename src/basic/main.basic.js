import App from './App.js';
import { createTimerManager } from './components/TimerManager.js';
import CartItem from './components/cart/CartItem.js';
import ProductPrice from './components/cart/ProductPrice.js';
import { TUESDAY_DAY_OF_WEEK } from './data/date.data.js';
import {
  DISCOUNT_RATE_BULK,
  DISCOUNT_RATE_SUPER_SALE,
  DISCOUNT_RATE_TUESDAY,
} from './data/discount.data.js';
import {
  POINT_BONUS_FULL_SET,
  POINT_BONUS_KEYBOARD_MOUSE_SET,
  POINT_BONUS_QUANTITY_TIER1,
  POINT_BONUS_QUANTITY_TIER2,
  POINT_BONUS_QUANTITY_TIER3,
  POINT_MULTIPLIER_TUESDAY,
} from './data/point.data.js';
import { PRODUCT_1, PRODUCT_2, PRODUCT_3, PRODUCT_LIST } from './data/product.data.js';
import {
  MIN_QUANTITY_FOR_BULK_DISCOUNT,
  MIN_QUANTITY_FOR_DISCOUNT,
  MIN_QUANTITY_FOR_POINT_BONUS_TIER1,
  MIN_QUANTITY_FOR_POINT_BONUS_TIER2,
  MIN_QUANTITY_FOR_POINT_BONUS_TIER3,
} from './data/quantity.data.js';
import {
  hasValidProduct,
  isExistingCartItem,
  isQuantityChangeButton,
  isQuantityValid,
  isRemoveButton,
  parseQuantityFromElement,
} from './utils/cart.util.js';
import {
  calculateProductDiscount,
  isBulkDiscountEligible,
  isProductDiscountEligible,
  isTuesday,
} from './utils/discount.util.js';
import { calculateBasePoints } from './utils/point.util.js';
import { createProductName, findProductById } from './utils/product.util.js';
import { isLowStock, isOutOfStock, validateStockAvailability } from './utils/stock.util.js';

// ============================================================================
// 전역 상태 변수
// ============================================================================
let totalQuantity = 0;
let lastSelectedProductId = null;
let totalPrice = 0;

// ============================================================================
// DOM 요소 참조
// ============================================================================
let stockStatusElement;
let productSelectElement;
let addToCartButton;
let cartItemsContainer;

// ============================================================================
// 애플리케이션 초기화
// ============================================================================
function initializeApp() {
  // 상태 초기화
  totalPrice = 0;
  totalQuantity = 0;
  lastSelectedProductId = null;

  // 앱 진입점
  const root = document.getElementById('app');
  new App(root);

  // DOM 요소 참조 설정
  productSelectElement = document.querySelector('#product-select');
  addToCartButton = document.querySelector('#add-to-cart');
  stockStatusElement = document.querySelector('#stock-status');
  cartItemsContainer = document.querySelector('#cart-items');

  // 초기 장바구니 계산
  calculateCartAndUpdateUI();

  // 타이머 매니저 생성 및 모든 타이머 시작
  const timerManager = createTimerManager(updatePricesInCart, {
    lastSelectedProductId,
    cartItemsContainer,
  });

  timerManager.startAll();
}

// ============================================================================
// 장바구니 계산 관련 함수들
// ============================================================================

function calculateCartItemPrice(cartItem) {
  const currentProduct = findProductById(cartItem.id, PRODUCT_LIST);
  const quantityElement = cartItem.querySelector('.quantity-number');
  const quantity = parseQuantityFromElement(quantityElement);
  const itemTotalPrice = currentProduct.val * quantity;
  const discountRate = calculateProductDiscount(currentProduct.id, quantity);

  return {
    product: currentProduct,
    quantity,
    itemTotalPrice,
    discountRate,
    finalPrice: itemTotalPrice * (1 - discountRate),
  };
}

function calculateCartTotals() {
  const cartItems = cartItemsContainer.children;
  let subTotal = 0;
  let totalQuantity = 0;
  let totalDiscountedPrice = 0;
  const itemDiscounts = [];

  // 장바구니 아이템별 계산
  for (let i = 0; i < cartItems.length; i++) {
    const cartItem = cartItems[i];
    const itemCalculation = calculateCartItemPrice(cartItem);

    totalQuantity += itemCalculation.quantity;
    subTotal += itemCalculation.itemTotalPrice;

    // 할인 적용 시각적 표시
    updateCartItemVisualDiscount(cartItem, itemCalculation.quantity);
  }

  // 대량구매 할인 적용 여부 결정
  const isBulkDiscountApplied = isBulkDiscountEligible(totalQuantity);

  if (isBulkDiscountApplied) {
    // 대량구매 할인이 적용되면 개별 상품 할인 무시하고 원가 사용
    totalDiscountedPrice = subTotal;
  } else {
    // 개별 상품 할인 적용
    for (let i = 0; i < cartItems.length; i++) {
      const cartItem = cartItems[i];
      const itemCalculation = calculateCartItemPrice(cartItem);
      totalDiscountedPrice += itemCalculation.finalPrice;

      if (itemCalculation.discountRate > 0) {
        itemDiscounts.push({
          name: itemCalculation.product.name,
          discount: itemCalculation.discountRate * 100,
        });
      }
    }
  }

  return { subTotal, totalQuantity, itemDiscounts, totalDiscountedPrice };
}

function updateCartItemVisualDiscount(cartItem, quantity) {
  const priceElements = cartItem.querySelectorAll('.text-lg, .text-xs');
  priceElements.forEach(element => {
    if (element.classList.contains('text-lg')) {
      element.style.fontWeight = isProductDiscountEligible(quantity) ? 'bold' : 'normal';
    }
  });
}

function applyBulkDiscount(subTotal, totalQuantity) {
  if (isBulkDiscountEligible(totalQuantity)) {
    return {
      finalPrice: (subTotal * (100 - DISCOUNT_RATE_BULK)) / 100,
      discountRate: DISCOUNT_RATE_BULK / 100,
    };
  } else {
    return {
      finalPrice: subTotal,
      discountRate: 0,
    };
  }
}

function applyTuesdayDiscount(totalPrice, originalTotalPrice) {
  const isTuesdayToday = new Date().getDay() === TUESDAY_DAY_OF_WEEK;
  const tuesdaySpecialElement = document.getElementById('tuesday-special');

  if (isTuesdayToday && totalPrice > 0) {
    const discountedPrice = (totalPrice * (100 - DISCOUNT_RATE_TUESDAY)) / 100;
    const totalDiscountRate = 1 - discountedPrice / originalTotalPrice;
    tuesdaySpecialElement.classList.remove('hidden');
    return { finalPrice: discountedPrice, totalDiscountRate, isTuesday: isTuesdayToday };
  } else {
    tuesdaySpecialElement.classList.add('hidden');
    return { finalPrice: totalPrice, totalDiscountRate: 0, isTuesday: isTuesdayToday };
  }
}

// ============================================================================
// 장바구니 계산 및 UI 업데이트
// ============================================================================
function calculateCartAndUpdateUI() {
  // 초기화
  totalPrice = 0;
  totalQuantity = 0;

  // 장바구니 총액 계산
  const {
    subTotal,
    totalQuantity: cartTotalQuantity,
    itemDiscounts,
    totalDiscountedPrice,
  } = calculateCartTotals();
  totalQuantity = cartTotalQuantity;

  // 대량구매 할인 적용 (개별 상품 할인이 적용된 가격에 대해)
  const { finalPrice: bulkDiscountedPrice, discountRate: bulkDiscountRate } = applyBulkDiscount(
    totalDiscountedPrice,
    totalQuantity
  );

  // 화요일 특별 할인 적용
  const { finalPrice, totalDiscountRate, isTuesday } = applyTuesdayDiscount(
    bulkDiscountedPrice,
    subTotal
  );
  totalPrice = finalPrice;

  // 총 할인율 계산 (원가 대비 최종 가격의 할인율)
  const totalDiscountRateCalculated = subTotal > 0 ? (subTotal - totalPrice) / subTotal : 0;

  // ============================================================================
  // UI 업데이트
  // ============================================================================
  updateItemCountDisplay();
  updateOrderSummaryDisplay(cartItemsContainer.children, subTotal, itemDiscounts, isTuesday);
  updateTotalPriceDisplay();
  updateLoyaltyPointsDisplay();
  updateDiscountInfoDisplay(subTotal, totalDiscountRateCalculated);
  updateStockStatusDisplay();
  calculateAndDisplayBonusPoints();
}

// ============================================================================
// UI 업데이트 함수들
// ============================================================================

function updateItemCountDisplay() {
  document.getElementById('item-count').textContent = '🛍️ ' + totalQuantity + ' items in cart';
}

function updateOrderSummaryDisplay(cartItems, subTotal, itemDiscounts, isTuesday) {
  const summaryDetailsElement = document.getElementById('summary-details');
  summaryDetailsElement.innerHTML = '';

  if (subTotal > 0) {
    // 개별 상품 정보
    for (let i = 0; i < cartItems.length; i++) {
      const currentProduct = findProductById(cartItems[i].id, PRODUCT_LIST);
      const quantityElement = cartItems[i].querySelector('.quantity-number');
      const quantity = parseQuantityFromElement(quantityElement);
      const itemTotalPrice = currentProduct.val * quantity;

      summaryDetailsElement.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${currentProduct.name} x ${quantity}</span>
          <span>₩${itemTotalPrice.toLocaleString()}</span>
        </div>
      `;
    }

    // 소계
    summaryDetailsElement.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTotal.toLocaleString()}</span>
      </div>
    `;

    // 할인 정보 표시
    displayDiscountDetails(summaryDetailsElement, totalQuantity, itemDiscounts, isTuesday);

    // 배송 정보
    summaryDetailsElement.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }
}

function displayDiscountDetails(summaryDetailsElement, totalQuantity, itemDiscounts, isTuesday) {
  // 대량구매 할인
  if (isBulkDiscountEligible(totalQuantity)) {
    summaryDetailsElement.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-green-400">
        <span class="text-xs">🎉 대량구매 할인 (${MIN_QUANTITY_FOR_BULK_DISCOUNT}개 이상)</span>
        <span class="text-xs">-${DISCOUNT_RATE_SUPER_SALE}%</span>
      </div>
    `;
  } else if (itemDiscounts.length > 0) {
    itemDiscounts.forEach(item => {
      summaryDetailsElement.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">${item.name} (${MIN_QUANTITY_FOR_DISCOUNT}개↑)</span>
          <span class="text-xs">-${item.discount}%</span>
        </div>
      `;
    });
  }

  // 화요일 특별 할인
  if (isTuesday && totalPrice > 0) {
    summaryDetailsElement.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-purple-400">
        <span class="text-xs">🌟 화요일 추가 할인</span>
        <span class="text-xs">-${DISCOUNT_RATE_TUESDAY}%</span>
      </div>
    `;
  }
}

function updateTotalPriceDisplay() {
  const cartTotalElement = document.getElementById('cart-total');
  const totalPriceDiv = cartTotalElement.querySelector('.text-2xl');
  if (totalPriceDiv) {
    totalPriceDiv.textContent = '₩' + Math.round(totalPrice).toLocaleString();
  }
}

function updateLoyaltyPointsDisplay() {
  const loyaltyPointsElement = document.getElementById('loyalty-points');
  if (loyaltyPointsElement) {
    const basePoints = calculateBasePoints(totalPrice);
    if (basePoints > 0) {
      loyaltyPointsElement.textContent = '적립 포인트: ' + basePoints + 'p';
      loyaltyPointsElement.style.display = 'block';
    } else {
      loyaltyPointsElement.textContent = '적립 포인트: 0p';
      loyaltyPointsElement.style.display = 'block';
    }
  }
}

function updateDiscountInfoDisplay(originalTotalPrice, totalDiscountRate) {
  const discountInfoElement = document.getElementById('discount-info');
  discountInfoElement.innerHTML = '';

  if (totalDiscountRate > 0 && originalTotalPrice > 0) {
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
  }
}

function updateStockStatusDisplay() {
  let stockMessage = '';
  for (let stockIdx = 0; stockIdx < PRODUCT_LIST.length; stockIdx++) {
    const product = PRODUCT_LIST[stockIdx];
    if (isLowStock(product)) {
      if (!isOutOfStock(product)) {
        stockMessage = stockMessage + product.name + ': 재고 부족 (' + product.q + '개 남음)\n';
      } else {
        stockMessage = stockMessage + product.name + ': 품절\n';
      }
    }
  }
  stockStatusElement.textContent = stockMessage;
  updateStockInfoMessage();
}

// ============================================================================
// 보너스 포인트 계산 및 표시
// ============================================================================

function checkProductSetInCart() {
  let hasKeyboard = false;
  let hasMouse = false;
  let hasMonitorArm = false;
  const cartItemNodes = cartItemsContainer.children;

  for (const node of cartItemNodes) {
    const product = findProductById(node.id, PRODUCT_LIST);
    if (!product) continue;

    if (product.id === PRODUCT_1) {
      hasKeyboard = true;
    } else if (product.id === PRODUCT_2) {
      hasMouse = true;
    } else if (product.id === PRODUCT_3) {
      hasMonitorArm = true;
    }
  }

  return { hasKeyboard, hasMouse, hasMonitorArm };
}

function calculateBonusPoints(totalQuantity, hasKeyboard, hasMouse, hasMonitorArm) {
  let bonusPoints = 0;
  const bonusDetails = [];

  // 세트 보너스
  if (hasKeyboard && hasMouse) {
    bonusPoints += POINT_BONUS_KEYBOARD_MOUSE_SET;
    bonusDetails.push(`키보드+마우스 세트 +${POINT_BONUS_KEYBOARD_MOUSE_SET}p`);
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    bonusPoints += POINT_BONUS_FULL_SET;
    bonusDetails.push(`풀세트 구매 +${POINT_BONUS_FULL_SET}p`);
  }

  // 수량별 보너스
  if (totalQuantity >= MIN_QUANTITY_FOR_POINT_BONUS_TIER3) {
    bonusPoints += POINT_BONUS_QUANTITY_TIER3;
    bonusDetails.push(
      `대량구매(${MIN_QUANTITY_FOR_POINT_BONUS_TIER3}개+) +${POINT_BONUS_QUANTITY_TIER3}p`
    );
  } else if (totalQuantity >= MIN_QUANTITY_FOR_POINT_BONUS_TIER2) {
    bonusPoints += POINT_BONUS_QUANTITY_TIER2;
    bonusDetails.push(
      `대량구매(${MIN_QUANTITY_FOR_POINT_BONUS_TIER2}개+) +${POINT_BONUS_QUANTITY_TIER2}p`
    );
  } else if (totalQuantity >= MIN_QUANTITY_FOR_POINT_BONUS_TIER1) {
    bonusPoints += POINT_BONUS_QUANTITY_TIER1;
    bonusDetails.push(
      `대량구매(${MIN_QUANTITY_FOR_POINT_BONUS_TIER1}개+) +${POINT_BONUS_QUANTITY_TIER1}p`
    );
  }

  return { bonusPoints, bonusDetails };
}

function calculateAndDisplayBonusPoints() {
  if (cartItemsContainer.children.length === 0) {
    document.getElementById('loyalty-points').style.display = 'none';
    return;
  }

  // 기본 포인트 계산
  const basePoints = calculateBasePoints(totalPrice);
  let finalPoints = 0;
  const pointsDetail = [];

  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push('기본: ' + basePoints + 'p');
  }

  // 화요일 포인트 배수 적용
  if (isTuesday() && basePoints > 0) {
    finalPoints = basePoints * POINT_MULTIPLIER_TUESDAY;
    pointsDetail.push('화요일 2배');
  }

  // 세트 보너스 확인 및 적용
  const { hasKeyboard, hasMouse, hasMonitorArm } = checkProductSetInCart();
  const { bonusPoints, bonusDetails } = calculateBonusPoints(
    totalQuantity,
    hasKeyboard,
    hasMouse,
    hasMonitorArm
  );

  finalPoints += bonusPoints;
  pointsDetail.push(...bonusDetails);

  // 포인트 표시 업데이트
  const loyaltyPointsElement = document.getElementById('loyalty-points');
  if (loyaltyPointsElement) {
    if (finalPoints > 0) {
      loyaltyPointsElement.innerHTML =
        '<div>적립 포인트: <span class="font-bold">' +
        finalPoints +
        'p</span></div>' +
        '<div class="text-2xs opacity-70 mt-1">' +
        pointsDetail.join(', ') +
        '</div>';
      loyaltyPointsElement.style.display = 'block';
    } else {
      loyaltyPointsElement.textContent = '적립 포인트: 0p';
      loyaltyPointsElement.style.display = 'block';
    }
  }
}

// ============================================================================
// 재고 관련 유틸리티 함수
// ============================================================================
function calculateTotalStock() {
  let totalStock = 0;
  for (let i = 0; i < PRODUCT_LIST.length; i++) {
    const currentProduct = PRODUCT_LIST[i];
    totalStock += currentProduct.q;
  }
  return totalStock;
}

function updateStockInfoMessage() {
  let stockMessage = '';
  const totalStock = calculateTotalStock();

  PRODUCT_LIST.forEach(product => {
    if (isLowStock(product)) {
      if (!isOutOfStock(product)) {
        stockMessage = stockMessage + product.name + ': 재고 부족 (' + product.q + '개 남음)\n';
      } else {
        stockMessage = stockMessage + product.name + ': 품절\n';
      }
    }
  });

  stockStatusElement.textContent = stockMessage;
}

// ============================================================================
// 장바구니 가격 업데이트 (타이머 콜백)
// ============================================================================
function updatePricesInCart() {
  const cartItems = cartItemsContainer.children;

  // 각 장바구니 아이템의 가격 및 이름 업데이트
  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    const product = findProductById(itemId, PRODUCT_LIST);

    if (product) {
      const priceDiv = cartItems[i].querySelector('.text-lg');
      const nameDiv = cartItems[i].querySelector('h3');

      priceDiv.innerHTML = ProductPrice(product);
      nameDiv.textContent = createProductName(product);
    }
  }

  calculateCartAndUpdateUI();
}

// ============================================================================
// 애플리케이션 시작
// ============================================================================
initializeApp();

// ============================================================================
// 이벤트 리스너 설정
// ============================================================================

// 상품 추가 버튼 클릭 이벤트
addToCartButton.addEventListener('click', () => {
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
  lastSelectedProductId = selectedProductId;
});

// 장바구니 아이템 수량 변경 및 삭제 이벤트
cartItemsContainer.addEventListener('click', event => {
  const targetElement = event.target;

  if (isQuantityChangeButton(targetElement) || isRemoveButton(targetElement)) {
    const productId = targetElement.dataset.productId;
    const cartItemElement = document.getElementById(productId);
    const product = findProductById(productId, PRODUCT_LIST);

    if (isQuantityChangeButton(targetElement)) {
      // 수량 변경 처리
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
    } else if (isRemoveButton(targetElement)) {
      // 아이템 삭제 처리
      const quantityElement = cartItemElement.querySelector('.quantity-number');
      const removedQuantity = parseQuantityFromElement(quantityElement);
      product.q += removedQuantity;
      cartItemElement.remove();
    }

    calculateCartAndUpdateUI();
  }
});
