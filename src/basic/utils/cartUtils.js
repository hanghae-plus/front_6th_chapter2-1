import { PRODUCT_IDS, STOCK_THRESHOLDS, DAYS_OF_WEEK } from '../constants.js';
import { renderBonusPoints } from './pointUtils.js';
import { updateStockInfo } from './stockUtils.js';
import { updateItemCount } from '../components/Header.js';

// ===== 장바구니 관련 공통 함수들 =====

/**
 * 장바구니 아이템의 수량을 가져오는 함수
 * @param {Element} cartItem - 장바구니 아이템 요소
 * @returns {number} 수량
 */
export function getCartItemQuantity(cartItem) {
  const qtyElem = cartItem.querySelector('.quantity-number');
  return qtyElem ? parseInt(qtyElem.textContent) : 0;
}

/**
 * 장바구니 아이템의 수량을 설정하는 함수
 * @param {Element} cartItem - 장바구니 아이템 요소
 * @param {number} quantity - 설정할 수량
 */
export function setCartItemQuantity(cartItem, quantity) {
  const qtyElem = cartItem.querySelector('.quantity-number');
  if (qtyElem) {
    qtyElem.textContent = quantity;
  }
}

/**
 * 장바구니에 상품이 이미 있는지 확인하는 함수
 * @param {Element} cartDisplay - 장바구니 표시 영역
 * @param {string} productId - 상품 ID
 * @returns {Element|null} 장바구니 아이템 요소 또는 null
 */
export function findCartItem(cartDisplay, productId) {
  return document.getElementById(productId);
}

/**
 * 수량 변경이 유효한지 확인하는 함수
 * @param {number} newQuantity - 새로운 수량
 * @param {number} availableStock - 사용 가능한 재고
 * @param {number} currentQuantity - 현재 수량
 * @returns {boolean} 유효성 여부
 */
export function isValidQuantityChange(newQuantity, availableStock, currentQuantity) {
  if (newQuantity <= 0) return true; // 삭제는 항상 허용
  return newQuantity <= availableStock + currentQuantity;
}

// 장바구니 계산 및 업데이트
export function calculateCart(productList, cartDisplay) {
  let cartItems = cartDisplay.children;
  let subTot = 0;
  let itemCount = 0;
  let totalAmount = 0;
  let itemDiscounts = [];

  // 장바구니 아이템 계산
  for (let i = 0; i < cartItems.length; i++) {
    let curItem;
    for (let j = 0; j < productList.length; j++) {
      if (productList[j].id === cartItems[i].id) {
        curItem = productList[j];
        break;
      }
    }
    const qtyElem = cartItems[i].querySelector('.quantity-number');
    let q = parseInt(qtyElem.textContent);
    let itemTot = curItem.val * q;
    let disc = 0;
    itemCount += q;
    subTot += itemTot;

    const itemDiv = cartItems[i];
    const priceElems = itemDiv.querySelectorAll('.text-lg, .text-xs');
    priceElems.forEach(function (elem) {
      if (elem.classList.contains('text-lg')) {
        elem.style.fontWeight = q >= 10 ? 'bold' : 'normal';
      }
    });

    // 개별 상품 할인 적용
    if (q >= 10) {
      disc = calculateItemDiscount(curItem.id);
      if (disc > 0) {
        itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
      }
    }
    totalAmount += itemTot * (1 - disc);
  }

  // 대량구매 할인 적용
  let discRate = 0;
  let originalTotal = subTot;
  if (itemCount >= 30) {
    totalAmount = (subTot * 75) / 100;
    discRate = 25 / 100;
  } else {
    discRate = (subTot - totalAmount) / subTot;
  }

  // 화요일 특별 할인
  const today = new Date();
  let isTuesday = today.getDay() === DAYS_OF_WEEK.TUESDAY;
  let tuesdaySpecial = document.getElementById('tuesday-special');
  if (isTuesday) {
    if (totalAmount > 0) {
      totalAmount = (totalAmount * 90) / 100;
      discRate = 1 - totalAmount / originalTotal;
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  } else {
    tuesdaySpecial.classList.add('hidden');
  }

  // 아이템 카운트 업데이트
  updateItemCount(itemCount);

  // 주문 요약 업데이트
  updateOrderSummary(cartItems, productList, subTot, itemCount, itemDiscounts, isTuesday);

  // 총액 업데이트
  updateTotalAmount(totalAmount);

  // 포인트 계산 및 업데이트
  updateLoyaltyPoints(totalAmount);

  // 할인 정보 업데이트
  updateDiscountInfo(discRate, originalTotal, totalAmount);

  // 재고 정보 업데이트
  updateStockInfo(productList, document.getElementById('stock-status'));

  // 보너스 포인트 계산 및 렌더링
  renderBonusPoints(productList, cartDisplay, totalAmount, itemCount);

  return { totalAmount, itemCount, subTot };
}

// 개별 상품 할인율 계산
function calculateItemDiscount(productId) {
  if (productId === PRODUCT_IDS.KEYBOARD) {
    return 10 / 100;
  } else if (productId === PRODUCT_IDS.MOUSE) {
    return 15 / 100;
  } else if (productId === PRODUCT_IDS.MONITOR_ARM) {
    return 20 / 100;
  } else if (productId === PRODUCT_IDS.LAPTOP_CASE) {
    return 5 / 100;
  } else if (productId === PRODUCT_IDS.SPEAKER) {
    return 25 / 100;
  }
  return 0;
}

// 주문 요약 업데이트
function updateOrderSummary(cartItems, productList, subTot, itemCount, itemDiscounts, isTuesday) {
  const summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';

  if (subTot > 0) {
    for (let i = 0; i < cartItems.length; i++) {
      let curItem;
      for (let j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          curItem = productList[j];
          break;
        }
      }
      const qtyElem = cartItems[i].querySelector('.quantity-number');
      const q = parseInt(qtyElem.textContent);
      const itemTotal = curItem.val * q;
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${q}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    }

    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTot.toLocaleString()}</span>
      </div>
    `;

    if (itemCount >= 30) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      itemDiscounts.forEach(function (item) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }

    if (isTuesday) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-purple-400">
          <span class="text-xs">🌟 화요일 추가 할인</span>
          <span class="text-xs">-10%</span>
        </div>
      `;
    }

    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }
}

// 총액 업데이트
function updateTotalAmount(totalAmount) {
  const totalDiv = document.querySelector('#cart-total .text-2xl');
  if (totalDiv) {
    totalDiv.textContent = '₩' + Math.round(totalAmount).toLocaleString();
  }
}

// 포인트 계산 및 업데이트
function updateLoyaltyPoints(totalAmount) {
  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    const points = Math.floor(totalAmount / 1000);
    if (points > 0) {
      loyaltyPointsDiv.textContent = '적립 포인트: ' + points + 'p';
      loyaltyPointsDiv.style.display = 'block';
    } else {
      loyaltyPointsDiv.textContent = '적립 포인트: 0p';
      loyaltyPointsDiv.style.display = 'block';
    }
  }
}

// 할인 정보 업데이트
function updateDiscountInfo(discRate, originalTotal, totalAmount) {
  const discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';

  if (discRate > 0 && totalAmount > 0) {
    const savedAmount = originalTotal - totalAmount;
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }
}
