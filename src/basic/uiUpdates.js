// ============================================
// UI UPDATE FUNCTIONS
// ============================================

import { QUANTITY_THRESHOLDS } from './constants.js';
import { getTotalStock, getStockStatusMessage, calculatePoints } from './utils.js';

// 전역 변수들 (main.basic.js에서 설정됨)
let productList,
  productSelector,
  cartDisplay,
  summaryElement,
  stockInfo,
  totalAmount,
  itemCount,
  bonusPoints;

// 전역 변수 설정 함수
export function setGlobalVariables(globals) {
  productList = globals.productList;
  productSelector = globals.productSelector;
  cartDisplay = globals.cartDisplay;
  summaryElement = globals.summaryElement;
  stockInfo = globals.stockInfo;
  totalAmount = globals.totalAmount;
  itemCount = globals.itemCount;
  bonusPoints = globals.bonusPoints;
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
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (isTuesday()) {
    if (totalAmount > 0) {
      totalAmount = totalAmount * 0.9; // 10% 할인
      tuesdaySpecial.classList.remove('hidden');
      return 1 - totalAmount / originalTotal; // 할인율 반환
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  } else {
    tuesdaySpecial.classList.add('hidden');
  }
  return 0;
};

// 장바구니 UI 업데이트
function updateCartUI(discountCalculation) {
  const { subtotal, itemDiscounts, discountRate, originalTotal } = discountCalculation;

  // 아이템 수 표시
  document.getElementById('item-count').textContent = `🛍️ ${itemCount} items in cart`;

  // 요약 상세 정보
  const summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';

  if (subtotal > 0) {
    // 상품별 정보
    const cartItems = cartDisplay.children;
    for (let i = 0; i < cartItems.length; i++) {
      const cartItem = cartItems[i];
      const product = productList.find((p) => p.id === cartItem.id);
      const quantityElement = cartItem.querySelector('.quantity-number');
      const quantity = parseInt(quantityElement.textContent);
      const itemTotal = product.value * quantity;

      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${product.name} x ${quantity}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    }

    // 소계
    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subtotal.toLocaleString()}</span>
      </div>
    `;

    // 할인 정보
    if (itemCount >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      itemDiscounts.forEach((item) => {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }

    // 화요일 할인
    if (isTuesday() && totalAmount > 0) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-purple-400">
          <span class="text-xs">🌟 화요일 추가 할인</span>
          <span class="text-xs">-10%</span>
        </div>
      `;
    }

    // 배송비
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }

  // 총액 표시
  const totalDiv = summaryElement.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = `₩${Math.round(totalAmount).toLocaleString()}`;
  }

  // 할인 정보 표시
  const discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';

  if (discountRate > 0 && totalAmount > 0) {
    const savedAmount = originalTotal - totalAmount;
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
}

// 포인트 표시 업데이트
function updatePointsDisplay() {
  const loyaltyPointsDiv = document.getElementById('loyalty-points');

  if (cartDisplay.children.length === 0) {
    loyaltyPointsDiv.style.display = 'none';
    return;
  }

  // 장바구니 아이템 정보 수집
  const cartItems = Array.from(cartDisplay.children)
    .map((node) => {
      const product = productList.find((p) => p.id === node.id);
      return product ? { id: product.id, name: product.name } : null;
    })
    .filter(Boolean);

  // 포인트 계산
  const { finalPoints, pointsDetail } = calculatePoints(totalAmount, cartItems, itemCount);
  bonusPoints = finalPoints;

  if (loyaltyPointsDiv) {
    if (bonusPoints > 0) {
      loyaltyPointsDiv.innerHTML = `
        <div>적립 포인트: <span class="font-bold">${bonusPoints}p</span></div>
        <div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>
      `;
    } else {
      loyaltyPointsDiv.innerHTML = '<div>적립 포인트: <span class="font-bold">0p</span></div>';
    }
    loyaltyPointsDiv.style.display = 'block';
  }
}

// 재고 정보 업데이트
function updateStockInfo() {
  stockInfo.textContent = getStockStatusMessage(productList);
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

// 화요일 체크 함수
function isTuesday() {
  return new Date().getDay() === 2;
}

// 개별 상품 할인율 계산
function getIndividualDiscountRate(productId, quantity) {
  if (quantity < QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT) {
    return 0;
  }

  const discountRates = {
    p1: 0.1, // 10%
    p2: 0.15, // 15%
    p3: 0.2, // 20%
    p4: 0.05, // 5%
    p5: 0.25, // 25%
  };

  return discountRates[productId] || 0;
}
