// ============================================
// UI UPDATE FUNCTIONS
// ============================================

import { calculateAllPoints } from './businessLogic.js';
import {
  QUANTITY_THRESHOLDS,
  DISCOUNT_RATES,
  PRODUCT_ONE,
  PRODUCT_TWO,
  PRODUCT_THREE,
  PRODUCT_FOUR,
  PRODUCT_FIVE,
} from './constants.js';
import { getTotalStock, getStockStatusMessage, isTuesdayDay } from './utils.js';

// 전역 변수들 (main.basic.js에서 설정됨)
let productList, productSelector, cartDisplay, stockInfo, totalAmount, itemCount;

// DOM 요소 캐싱
let cachedElements = null;

// DOM 요소 캐싱 초기화
const initializeCachedElements = () => {
  if (cachedElements) return cachedElements;

  cachedElements = {
    itemCount: document.getElementById('item-count'),
    summaryDetails: document.getElementById('summary-details'),
    cartTotal: document.getElementById('cart-total'),
    loyaltyPoints: document.getElementById('loyalty-points'),
    discountInfo: document.getElementById('discount-info'),
    tuesdaySpecial: document.getElementById('tuesday-special'),
  };

  return cachedElements;
};

// 캐시된 DOM 요소 가져오기
const getCachedElement = (key) => {
  const elements = initializeCachedElements();
  return elements[key];
};

// 전역 변수 설정 함수
export function setGlobalVariables(globals) {
  const {
    productList: pl,
    productSelector: ps,
    cartDisplay: cd,
    stockInfo: si,
    totalAmount: ta,
    itemCount: ic,
  } = globals;

  productList = pl;
  productSelector = ps;
  cartDisplay = cd;
  stockInfo = si;
  totalAmount = ta;
  itemCount = ic;
}

// 상품 선택 옵션 업데이트
export function updateSelectOptions() {
  productSelector.innerHTML = '';
  const totalStock = getTotalStock(productList);

  productList.forEach((product) => {
    const option = document.createElement('option');
    option.value = product.id;

    let discountText = '';
    if (product.onSale) discountText += ' ⚡SALE';
    if (product.suggestSale) discountText += ' 💝추천';

    if (product.quantity === 0) {
      option.textContent = `${product.name} - ${product.value}원 (품절)${discountText}`;
      option.disabled = true;
      option.className = 'text-gray-400';
    } else {
      if (product.onSale && product.suggestSale) {
        option.textContent = `⚡💝${product.name} - ${product.originalValue}원 → ${product.value}원 (25% SUPER SALE!)`;
        option.className = 'text-purple-600 font-bold';
      } else if (product.onSale) {
        option.textContent = `⚡${product.name} - ${product.originalValue}원 → ${product.value}원 (20% SALE!)`;
        option.className = 'text-red-500 font-bold';
      } else if (product.suggestSale) {
        option.textContent = `💝${product.name} - ${product.originalValue}원 → ${product.value}원 (5% 추천할인!)`;
        option.className = 'text-blue-500 font-bold';
      } else {
        option.textContent = `${product.name} - ${product.value}원${discountText}`;
      }
    }

    productSelector.appendChild(option);
  });

  // 재고 경고 표시
  if (totalStock < QUANTITY_THRESHOLDS.TOTAL_STOCK_WARNING) {
    productSelector.style.borderColor = 'orange';
  } else {
    productSelector.style.borderColor = '';
  }
}

// 장바구니 계산
export function calculateCart() {
  totalAmount = 0;
  itemCount = 0;

  const cartItems = cartDisplay.children;
  const cartCalculation = calculateCartItems(cartItems);

  // 할인 적용
  const discountCalculation = applyDiscounts(cartCalculation);

  // UI 업데이트
  updateCartUI(discountCalculation);
  updatePointsDisplay();
  updateStockInfo();
}

// 장바구니 아이템 계산
const calculateCartItems = (cartItems) => {
  let subtotal = 0;
  const itemDiscounts = [];

  for (let i = 0; i < cartItems.length; i++) {
    const cartItem = cartItems[i];
    const product = productList.find((p) => p.id === cartItem.id);
    const quantityElement = cartItem.querySelector('.quantity-number');
    const quantity = parseInt(quantityElement.textContent);
    const itemTotal = product.value * quantity;

    itemCount += quantity;
    subtotal += itemTotal;

    // 개별 할인 계산
    const discountRate = getIndividualDiscountRate(product.id, quantity);
    if (discountRate > 0) {
      itemDiscounts.push({
        name: product.name,
        discount: discountRate * 100,
      });
      totalAmount += itemTotal * (1 - discountRate);
    } else {
      totalAmount += itemTotal;
    }

    // 10개 이상 구매 시 굵은 글씨
    updateItemPriceStyle(cartItem, quantity);
  }

  return { subtotal, itemDiscounts, originalTotal: subtotal };
};

// 아이템 가격 스타일 업데이트
const updateItemPriceStyle = (cartItem, quantity) => {
  const priceElements = cartItem.querySelectorAll('.text-lg, .text-xs');
  priceElements.forEach((element) => {
    if (element.classList.contains('text-lg')) {
      element.style.fontWeight =
        quantity >= QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT ? 'bold' : 'normal';
    }
  });
};

// 할인 적용
const applyDiscounts = ({ subtotal, itemDiscounts, originalTotal }) => {
  let discountRate = 0;

  // 대량구매 할인 적용
  if (itemCount >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
    totalAmount = subtotal * 0.75; // 25% 할인
    discountRate = 0.25;
  } else {
    discountRate = (subtotal - totalAmount) / subtotal;
  }

  // 화요일 할인 적용
  const tuesdayDiscountRate = applyTuesdayDiscount(originalTotal);
  if (tuesdayDiscountRate > 0) {
    discountRate = 1 - totalAmount / originalTotal;
  }

  return { subtotal, itemDiscounts, discountRate, originalTotal };
};

// 화요일 할인 적용
const applyTuesdayDiscount = (originalTotal) => {
  const elements = initializeCachedElements();

  if (!elements.tuesdaySpecial) return 0;

  if (isTuesdayDay()) {
    if (totalAmount > 0) {
      totalAmount = totalAmount * 0.9; // 10% 할인
      elements.tuesdaySpecial.classList.remove('hidden');
      return 1 - totalAmount / originalTotal; // 할인율 반환
    } else {
      elements.tuesdaySpecial.classList.add('hidden');
    }
  } else {
    elements.tuesdaySpecial.classList.add('hidden');
  }
  return 0;
};

// 장바구니 UI 업데이트
function updateCartUI(discountCalculation) {
  const { subtotal, itemDiscounts, discountRate, originalTotal } = discountCalculation;

  // 캐시된 DOM 요소 사용
  const elements = initializeCachedElements();

  // 아이템 수 표시
  if (elements.itemCount) {
    elements.itemCount.textContent = `🛍️ ${itemCount} items in cart`;
  }

  // 요약 상세 정보
  if (elements.summaryDetails) {
    elements.summaryDetails.innerHTML = '';

    if (subtotal > 0) {
      // 상품별 정보
      const cartItems = cartDisplay.children;
      for (let i = 0; i < cartItems.length; i++) {
        const cartItem = cartItems[i];
        const product = productList.find((p) => p.id === cartItem.id);
        const quantityElement = cartItem.querySelector('.quantity-number');
        const quantity = parseInt(quantityElement.textContent);
        const itemTotal = product.value * quantity;

        elements.summaryDetails.innerHTML += `
          <div class="flex justify-between text-xs tracking-wide text-gray-400">
            <span>${product.name} x ${quantity}</span>
            <span>₩${itemTotal.toLocaleString()}</span>
          </div>
        `;
      }

      elements.summaryDetails.innerHTML += `
        <div class="border-t border-white/10 my-3"></div>
        <div class="flex justify-between text-sm tracking-wide">
          <span>Subtotal</span>
          <span>₩${subtotal.toLocaleString()}</span>
        </div>
      `;

      // 할인 정보 표시
      if (itemCount >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
        elements.summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
            <span class="text-xs">-25%</span>
          </div>
        `;
      } else if (itemDiscounts.length > 0) {
        itemDiscounts.forEach((item) => {
          elements.summaryDetails.innerHTML += `
            <div class="flex justify-between text-sm tracking-wide text-green-400">
              <span class="text-xs">${item.name} (10개↑)</span>
              <span class="text-xs">-${item.discount}%</span>
            </div>
          `;
        });
      }

      // 화요일 할인 표시
      if (isTuesdayDay() && totalAmount > 0) {
        elements.summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-10%</span>
          </div>
        `;
      }

      elements.summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-gray-400">
          <span>Shipping</span>
          <span>Free</span>
        </div>
      `;
    }
  }

  // 총액 표시
  if (elements.cartTotal) {
    const totalDiv = elements.cartTotal.querySelector('.text-2xl');
    if (totalDiv) {
      totalDiv.textContent = '₩' + Math.round(totalAmount).toLocaleString();
    }
  }

  // 할인 정보 표시
  if (elements.discountInfo) {
    elements.discountInfo.innerHTML = '';

    if (discountRate > 0 && totalAmount > 0) {
      const savedAmount = originalTotal - totalAmount;
      elements.discountInfo.innerHTML = `
        <div class="bg-green-500/20 rounded-lg p-3">
          <div class="flex justify-between items-center mb-1">
            <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
            <span class="text-sm font-medium text-green-400">${(discountRate * 100).toFixed(1)}%</span>
          </div>
          <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
        </div>
      `;
    }
  }
}

// 포인트 표시 업데이트
function updatePointsDisplay() {
  const elements = initializeCachedElements();

  if (!elements.loyaltyPoints) return;

  if (cartDisplay.children.length === 0) {
    elements.loyaltyPoints.style.display = 'none';
    return;
  }

  // cartItems 배열 생성
  const cartItems = Array.from(cartDisplay.children).map((item) => ({
    productId: item.id,
    quantity: parseInt(item.querySelector('.quantity-number').textContent),
  }));

  // calculateAllPoints 함수 사용
  const { finalPoints, pointsDetail } = calculateAllPoints(totalAmount, cartItems, itemCount);

  if (finalPoints > 0) {
    elements.loyaltyPoints.innerHTML = `
      <div>적립 포인트: <span class="font-bold">${finalPoints}p</span></div>
      ${pointsDetail.length > 0 ? `<div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>` : ''}
    `;
    elements.loyaltyPoints.style.display = 'block';
  } else {
    elements.loyaltyPoints.textContent = '적립 포인트: 0p';
    elements.loyaltyPoints.style.display = 'block';
  }
}

// 재고 정보 업데이트
function updateStockInfo() {
  if (!stockInfo) return;

  const stockMessage = getStockStatusMessage(productList);
  stockInfo.textContent = stockMessage;
}

// 장바구니 내 가격 업데이트
export function updatePricesInCart() {
  const cartItems = cartDisplay.children;

  for (let i = 0; i < cartItems.length; i++) {
    const cartItem = cartItems[i];
    const product = productList.find((p) => p.id === cartItem.id);

    if (product) {
      const priceDiv = cartItem.querySelector('.text-lg');
      const nameDiv = cartItem.querySelector('h3');

      if (product.onSale && product.suggestSale) {
        priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalValue.toLocaleString()}</span> <span class="text-purple-600">₩${product.value.toLocaleString()}</span>`;
        nameDiv.textContent = `⚡💝${product.name}`;
      } else if (product.onSale) {
        priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalValue.toLocaleString()}</span> <span class="text-red-500">₩${product.value.toLocaleString()}</span>`;
        nameDiv.textContent = `⚡${product.name}`;
      } else if (product.suggestSale) {
        priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalValue.toLocaleString()}</span> <span class="text-blue-500">₩${product.value.toLocaleString()}</span>`;
        nameDiv.textContent = `💝${product.name}`;
      } else {
        priceDiv.textContent = `₩${product.value.toLocaleString()}`;
        nameDiv.textContent = product.name;
      }
    }
  }

  calculateCart();
}

// businessLogic.js의 isTuesdayDay 함수 사용

// 개별 상품 할인율 계산
function getIndividualDiscountRate(productId, quantity) {
  if (quantity < QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT) {
    return 0;
  }

  // constants.js의 DISCOUNT_RATES 사용
  const discountRates = {
    [PRODUCT_ONE]: DISCOUNT_RATES.KEYBOARD,
    [PRODUCT_TWO]: DISCOUNT_RATES.MOUSE,
    [PRODUCT_THREE]: DISCOUNT_RATES.MONITOR_ARM,
    [PRODUCT_FOUR]: DISCOUNT_RATES.LAPTOP_POUCH,
    [PRODUCT_FIVE]: DISCOUNT_RATES.SPEAKER,
  };

  return discountRates[productId] || 0;
}
