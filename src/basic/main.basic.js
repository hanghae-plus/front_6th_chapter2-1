import App from './App.js';
import { createTimerManager } from './components/TimerManager.js';
import { TUESDAY_DAY_OF_WEEK } from './data/date.data.js';
import {
  DISCOUNT_RATE_BULK,
  DISCOUNT_RATE_LIST,
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
  POINT_RATE_BASE,
} from './data/point.data.js';
import {
  PRODUCT_1,
  PRODUCT_2,
  PRODUCT_3,
  PRODUCT_4,
  PRODUCT_5,
  PRODUCT_LIST,
} from './data/product.data.js';
import {
  LOW_STOCK_THRESHOLD,
  MIN_QUANTITY_FOR_BULK_DISCOUNT,
  MIN_QUANTITY_FOR_DISCOUNT,
  MIN_QUANTITY_FOR_POINT_BONUS_TIER1,
  MIN_QUANTITY_FOR_POINT_BONUS_TIER2,
  MIN_QUANTITY_FOR_POINT_BONUS_TIER3,
} from './data/quantity.data.js';

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
// 장바구니 계산 및 UI 업데이트
// ============================================================================
function calculateCartAndUpdateUI() {
  // 초기화
  totalPrice = 0;
  totalQuantity = 0;
  let originalTotalPrice = totalPrice;
  const cartItems = cartItemsContainer.children;
  let subTotal = 0;
  const itemDiscounts = [];

  // 장바구니 아이템별 계산
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      // 현재 아이템 찾기
      let currentProduct;
      for (let j = 0; j < PRODUCT_LIST.length; j++) {
        if (PRODUCT_LIST[j].id === cartItems[i].id) {
          currentProduct = PRODUCT_LIST[j];
          break;
        }
      }

      // 수량 및 가격 계산
      const quantityElement = cartItems[i].querySelector('.quantity-number');
      let quantity;
      let itemTotalPrice;
      let discountRate;

      quantity = parseInt(quantityElement.textContent);
      itemTotalPrice = currentProduct.val * quantity;
      discountRate = 0;
      totalQuantity += quantity;
      subTotal += itemTotalPrice;

      // 할인 적용 시각적 표시
      const itemElement = cartItems[i];
      const priceElements = itemElement.querySelectorAll('.text-lg, .text-xs');
      priceElements.forEach(element => {
        if (element.classList.contains('text-lg')) {
          element.style.fontWeight = quantity >= MIN_QUANTITY_FOR_DISCOUNT ? 'bold' : 'normal';
        }
      });

      // 개별 상품 할인 적용
      if (quantity >= MIN_QUANTITY_FOR_DISCOUNT) {
        if (currentProduct.id === PRODUCT_1) {
          discountRate = DISCOUNT_RATE_LIST[PRODUCT_1] / 100;
        } else if (currentProduct.id === PRODUCT_2) {
          discountRate = DISCOUNT_RATE_LIST[PRODUCT_2] / 100;
        } else if (currentProduct.id === PRODUCT_3) {
          discountRate = DISCOUNT_RATE_LIST[PRODUCT_3] / 100;
        } else if (currentProduct.id === PRODUCT_4) {
          discountRate = DISCOUNT_RATE_LIST[PRODUCT_4] / 100;
        } else if (currentProduct.id === PRODUCT_5) {
          discountRate = DISCOUNT_RATE_LIST[PRODUCT_5] / 100;
        }

        if (discountRate > 0) {
          itemDiscounts.push({ name: currentProduct.name, discount: discountRate * 100 });
        }
      }

      totalPrice += itemTotalPrice * (1 - discountRate);
    })();
  }

  // 대량구매 할인 적용
  let totalDiscountRate = 0;
  originalTotalPrice = subTotal;
  if (totalQuantity >= MIN_QUANTITY_FOR_BULK_DISCOUNT) {
    totalPrice = (subTotal * (100 - DISCOUNT_RATE_BULK)) / 100;
    totalDiscountRate = DISCOUNT_RATE_BULK / 100;
  } else {
    totalDiscountRate = (subTotal - totalPrice) / subTotal;
  }

  // 화요일 특별 할인 적용
  const today = new Date();
  const isTuesday = today.getDay() === TUESDAY_DAY_OF_WEEK;
  const tuesdaySpecialElement = document.getElementById('tuesday-special');

  if (isTuesday) {
    if (totalPrice > 0) {
      totalPrice = (totalPrice * (100 - DISCOUNT_RATE_TUESDAY)) / 100;
      totalDiscountRate = 1 - totalPrice / originalTotalPrice;
      tuesdaySpecialElement.classList.remove('hidden');
    } else {
      tuesdaySpecialElement.classList.add('hidden');
    }
  } else {
    tuesdaySpecialElement.classList.add('hidden');
  }

  // ============================================================================
  // UI 업데이트
  // ============================================================================

  // 아이템 카운트 업데이트
  updateItemCountDisplay();

  // 주문 요약 상세 정보 업데이트
  updateOrderSummaryDisplay(cartItems, subTotal, itemDiscounts, isTuesday);

  // 총액 표시 업데이트
  updateTotalPriceDisplay();

  // 포인트 표시 업데이트
  updateLoyaltyPointsDisplay();

  // 할인 정보 표시 업데이트
  updateDiscountInfoDisplay(originalTotalPrice, totalDiscountRate);

  // 재고 정보 업데이트
  updateStockStatusDisplay();

  // 보너스 포인트 계산 및 표시
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
      let currentProduct;
      for (let j = 0; j < PRODUCT_LIST.length; j++) {
        if (PRODUCT_LIST[j].id === cartItems[i].id) {
          currentProduct = PRODUCT_LIST[j];
          break;
        }
      }

      const quantityElement = cartItems[i].querySelector('.quantity-number');
      const quantity = parseInt(quantityElement.textContent);
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
  if (totalQuantity >= 30) {
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
  if (isTuesday) {
    if (totalPrice > 0) {
      summaryDetailsElement.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-purple-400">
          <span class="text-xs">🌟 화요일 추가 할인</span>
          <span class="text-xs">-${DISCOUNT_RATE_TUESDAY}%</span>
        </div>
      `;
    }
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
    const basePoints = Math.floor(totalPrice / POINT_RATE_BASE);
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

  if (totalDiscountRate > 0 && totalPrice > 0) {
    const savedAmount = originalTotalPrice - totalPrice;
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
    if (product.q < LOW_STOCK_THRESHOLD) {
      if (product.q > 0) {
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
function calculateAndDisplayBonusPoints() {
  let basePoints;
  let finalPoints;
  let pointsDetail;
  let hasKeyboard;
  let hasMouse;
  let hasMonitorArm;
  let cartItemNodes;

  if (cartItemsContainer.children.length === 0) {
    document.getElementById('loyalty-points').style.display = 'none';
    return;
  }

  // 기본 포인트 계산
  basePoints = Math.floor(totalPrice / POINT_RATE_BASE);
  finalPoints = 0;
  pointsDetail = [];

  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push('기본: ' + basePoints + 'p');
  }

  // 화요일 포인트 배수 적용
  if (new Date().getDay() === TUESDAY_DAY_OF_WEEK) {
    if (basePoints > 0) {
      finalPoints = basePoints * POINT_MULTIPLIER_TUESDAY;
      pointsDetail.push('화요일 2배');
    }
  }

  // 세트 보너스 확인
  hasKeyboard = false;
  hasMouse = false;
  hasMonitorArm = false;
  cartItemNodes = cartItemsContainer.children;

  for (const node of cartItemNodes) {
    let product = null;
    for (let pIdx = 0; pIdx < PRODUCT_LIST.length; pIdx++) {
      if (PRODUCT_LIST[pIdx].id === node.id) {
        product = PRODUCT_LIST[pIdx];
        break;
      }
    }

    if (!product) {
      continue;
    }

    if (product.id === PRODUCT_1) {
      hasKeyboard = true;
    } else if (product.id === PRODUCT_2) {
      hasMouse = true;
    } else if (product.id === PRODUCT_3) {
      hasMonitorArm = true;
    }
  }

  // 세트 보너스 적용
  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + POINT_BONUS_KEYBOARD_MOUSE_SET;
    pointsDetail.push('키보드+마우스 세트 +' + POINT_BONUS_KEYBOARD_MOUSE_SET + 'p');
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + POINT_BONUS_FULL_SET;
    pointsDetail.push('풀세트 구매 +' + POINT_BONUS_FULL_SET + 'p');
  }

  // 수량별 보너스 포인트 적용
  if (totalQuantity >= MIN_QUANTITY_FOR_POINT_BONUS_TIER3) {
    finalPoints = finalPoints + POINT_BONUS_QUANTITY_TIER3;
    pointsDetail.push(
      '대량구매(' + MIN_QUANTITY_FOR_POINT_BONUS_TIER3 + '개+) +' + POINT_BONUS_QUANTITY_TIER3 + 'p'
    );
  } else if (totalQuantity >= MIN_QUANTITY_FOR_POINT_BONUS_TIER2) {
    finalPoints = finalPoints + POINT_BONUS_QUANTITY_TIER2;
    pointsDetail.push(
      '대량구매(' + MIN_QUANTITY_FOR_POINT_BONUS_TIER2 + '개+) +' + POINT_BONUS_QUANTITY_TIER2 + 'p'
    );
  } else if (totalQuantity >= MIN_QUANTITY_FOR_POINT_BONUS_TIER1) {
    finalPoints = finalPoints + POINT_BONUS_QUANTITY_TIER1;
    pointsDetail.push(
      '대량구매(' + MIN_QUANTITY_FOR_POINT_BONUS_TIER1 + '개+) +' + POINT_BONUS_QUANTITY_TIER1 + 'p'
    );
  }

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
    if (product.q < LOW_STOCK_THRESHOLD) {
      if (product.q > 0) {
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
  // 장바구니 총 수량 계산
  let totalCount = 0;
  for (let j = 0; j < cartItemsContainer.children.length; j++) {
    totalCount += parseInt(
      cartItemsContainer.children[j].querySelector('.quantity-number').textContent
    );
  }

  const cartItems = cartItemsContainer.children;

  // 각 장바구니 아이템의 가격 및 이름 업데이트
  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    let product = null;

    // 상품 정보 찾기
    for (let productIdx = 0; productIdx < PRODUCT_LIST.length; productIdx++) {
      if (PRODUCT_LIST[productIdx].id === itemId) {
        product = PRODUCT_LIST[productIdx];
        break;
      }
    }

    if (product) {
      const priceDiv = cartItems[i].querySelector('.text-lg');
      const nameDiv = cartItems[i].querySelector('h3');

      // 할인 상태에 따른 가격 및 이름 표시
      if (product.onSale && product.suggestSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-purple-600">₩' +
          product.val.toLocaleString() +
          '</span>';
        nameDiv.textContent = '⚡💝' + product.name;
      } else if (product.onSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-red-500">₩' +
          product.val.toLocaleString() +
          '</span>';
        nameDiv.textContent = '⚡' + product.name;
      } else if (product.suggestSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-blue-500">₩' +
          product.val.toLocaleString() +
          '</span>';
        nameDiv.textContent = '💝' + product.name;
      } else {
        priceDiv.textContent = '₩' + product.val.toLocaleString();
        nameDiv.textContent = product.name;
      }
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
  let isValidProduct = false;
  for (let idx = 0; idx < PRODUCT_LIST.length; idx++) {
    if (PRODUCT_LIST[idx].id === selectedProductId) {
      isValidProduct = true;
      break;
    }
  }

  if (!selectedProductId || !isValidProduct) {
    return;
  }

  // 상품 정보 찾기
  let productToAdd = null;
  for (let j = 0; j < PRODUCT_LIST.length; j++) {
    if (PRODUCT_LIST[j].id === selectedProductId) {
      productToAdd = PRODUCT_LIST[j];
      break;
    }
  }

  if (productToAdd && productToAdd.q > 0) {
    const existingCartItem = document.getElementById(productToAdd['id']);

    if (existingCartItem) {
      // 기존 아이템 수량 증가
      const quantityElement = existingCartItem.querySelector('.quantity-number');
      const newQuantity = parseInt(quantityElement['textContent']) + 1;

      if (newQuantity <= productToAdd.q + parseInt(quantityElement.textContent)) {
        quantityElement.textContent = newQuantity;
        productToAdd['q']--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      // 새 아이템 추가
      const newCartItem = document.createElement('div');
      newCartItem.id = productToAdd.id;
      newCartItem.className =
        'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';

      newCartItem.innerHTML = `
        <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
          <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
        </div>
        <div>
          <h3 class="text-base font-normal mb-1 tracking-tight">${productToAdd.onSale && productToAdd.suggestSale ? '⚡💝' : productToAdd.onSale ? '⚡' : productToAdd.suggestSale ? '💝' : ''}${productToAdd.name}</h3>
          <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
          <p class="text-xs text-black mb-3">${productToAdd.onSale || productToAdd.suggestSale ? '<span class="line-through text-gray-400">₩' + productToAdd.originalVal.toLocaleString() + '</span> <span class="' + (productToAdd.onSale && productToAdd.suggestSale ? 'text-purple-600' : productToAdd.onSale ? 'text-red-500' : 'text-blue-500') + '">₩' + productToAdd.val.toLocaleString() + '</span>' : '₩' + productToAdd.val.toLocaleString()}</p>
          <div class="flex items-center gap-4">
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${productToAdd.id}" data-change="-1">−</button>
            <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${productToAdd.id}" data-change="1">+</button>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg mb-2 tracking-tight tabular-nums">${productToAdd.onSale || productToAdd.suggestSale ? '<span class="line-through text-gray-400">₩' + productToAdd.originalVal.toLocaleString() + '</span> <span class="' + (productToAdd.onSale && productToAdd.suggestSale ? 'text-purple-600' : productToAdd.onSale ? 'text-red-500' : 'text-blue-500') + '">₩' + productToAdd.val.toLocaleString() + '</span>' : '₩' + productToAdd.val.toLocaleString()}</div>
          <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${productToAdd.id}">Remove</a>
        </div>
      `;

      cartItemsContainer.appendChild(newCartItem);
      productToAdd.q--;
    }

    calculateCartAndUpdateUI();
    lastSelectedProductId = selectedProductId;
  }
});

// 장바구니 아이템 수량 변경 및 삭제 이벤트
cartItemsContainer.addEventListener('click', event => {
  const targetElement = event.target;

  if (
    targetElement.classList.contains('quantity-change') ||
    targetElement.classList.contains('remove-item')
  ) {
    const productId = targetElement.dataset.productId;
    const cartItemElement = document.getElementById(productId);

    // 상품 정보 찾기
    let product = null;
    for (let prdIdx = 0; prdIdx < PRODUCT_LIST.length; prdIdx++) {
      if (PRODUCT_LIST[prdIdx].id === productId) {
        product = PRODUCT_LIST[prdIdx];
        break;
      }
    }

    if (targetElement.classList.contains('quantity-change')) {
      // 수량 변경 처리
      const quantityChange = parseInt(targetElement.dataset.change);
      const quantityElement = cartItemElement.querySelector('.quantity-number');
      const currentQuantity = parseInt(quantityElement.textContent);
      const newQuantity = currentQuantity + quantityChange;

      if (newQuantity > 0 && newQuantity <= product.q + currentQuantity) {
        quantityElement.textContent = newQuantity;
        product.q -= quantityChange;
      } else if (newQuantity <= 0) {
        product.q += currentQuantity;
        cartItemElement.remove();
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (targetElement.classList.contains('remove-item')) {
      // 아이템 삭제 처리
      const quantityElement = cartItemElement.querySelector('.quantity-number');
      const removedQuantity = parseInt(quantityElement.textContent);
      product.q += removedQuantity;
      cartItemElement.remove();
    }

    calculateCartAndUpdateUI();
  }
});
