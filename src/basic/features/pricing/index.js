/**
 * 가격 계산 기능
 */

/**
 * 장바구니 소계 및 개별 할인 계산
 * @param {Object} appState - AppState 인스턴스
 * @param {Object} legacyVars - 레거시 변수들
 * @returns {Object} 계산 결과
 */
export function calculateCartSubtotal(appState, legacyVars) {
  var cartItems = appState.elements.cartDisplay.children;
  var subTotal = 0;
  var itemDiscounts = [];
  
  // AppState 값 초기화
  appState.totalAmount = 0;
  appState.itemCount = 0;
  
  // 레거시 변수 동기화
  legacyVars.totalAmt = 0;
  legacyVars.itemCnt = 0;
  
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      var curItem = findProductById(appState.products, cartItems[i].id);
      
      var qtyElem = cartItems[i].querySelector('.quantity-number');
      var quantity = parseInt(qtyElem.textContent);
      var itemTotal = curItem.val * quantity;
      var discount = 0;
      
      // AppState 업데이트
      appState.itemCount += quantity;
      
      // 레거시 변수 동기화
      legacyVars.itemCnt += quantity;
      subTotal += itemTotal;
      
      // DOM 스타일 업데이트
      var itemDiv = cartItems[i];
      var priceElems = itemDiv.querySelectorAll('.text-lg, .text-xs');
      priceElems.forEach(function (elem) {
        if (elem.classList.contains('text-lg')) {
          elem.style.fontWeight = quantity >= 10 ? 'bold' : 'normal';
        }
      });
      
      // 개별 할인 계산 (상수 사용)
      if (quantity >= appState.CONSTANTS.BULK_DISCOUNT_THRESHOLD) {
        if (curItem.id === appState.PRODUCT_IDS.KEYBOARD) {
          discount = appState.CONSTANTS.KEYBOARD_DISCOUNT;
        } else if (curItem.id === appState.PRODUCT_IDS.MOUSE) {
          discount = appState.CONSTANTS.MOUSE_DISCOUNT;
        } else if (curItem.id === appState.PRODUCT_IDS.MONITOR_ARM) {
          discount = appState.CONSTANTS.MONITOR_ARM_DISCOUNT;
        } else if (curItem.id === appState.PRODUCT_IDS.LAPTOP_POUCH) {
          discount = appState.CONSTANTS.LAPTOP_POUCH_DISCOUNT;
        } else if (curItem.id === appState.PRODUCT_IDS.SPEAKER) {
          discount = appState.CONSTANTS.SPEAKER_DISCOUNT;
        }
        if (discount > 0) {
          itemDiscounts.push({name: curItem.name, discount: discount * 100});
        }
      }
      
      var finalItemTotal = itemTotal * (1 - discount);
      appState.totalAmount += finalItemTotal;
      
      // 레거시 변수 동기화
      legacyVars.totalAmt += finalItemTotal;
    })();
  }
  
  return {
    subTotal: subTotal,
    itemDiscounts: itemDiscounts
  };
}

/**
 * 최종 할인 계산 (대량구매, 화요일)
 * @param {Object} appState - AppState 인스턴스
 * @param {Object} legacyVars - 레거시 변수들
 * @param {number} subTotal - 소계
 * @returns {Object} 할인 정보
 */
export function calculateFinalDiscount(appState, legacyVars, subTotal) {
  var discountRate = 0;
  var originalTotal = subTotal;
  
  // 대량구매 할인
  if (appState.itemCount >= appState.CONSTANTS.BULK_QUANTITY_THRESHOLD) {
    appState.totalAmount = subTotal * (1 - appState.CONSTANTS.BULK_QUANTITY_DISCOUNT_RATE);
    legacyVars.totalAmt = appState.totalAmount; // 레거시 동기화
    discountRate = appState.CONSTANTS.BULK_QUANTITY_DISCOUNT_RATE;
  } else {
    discountRate = (subTotal - appState.totalAmount) / subTotal;
  }
  
  // 화요일 할인
  const today = new Date();
  var isTuesday = today.getDay() === appState.CONSTANTS.TUESDAY_DAY_OF_WEEK;
  var tuesdaySpecial = document.getElementById('tuesday-special');
  
  if (isTuesday) {
    if (appState.totalAmount > 0) {
      appState.totalAmount = appState.totalAmount * (1 - appState.CONSTANTS.TUESDAY_DISCOUNT_RATE);
      legacyVars.totalAmt = appState.totalAmount; // 레거시 동기화
      discountRate = 1 - (appState.totalAmount / originalTotal);
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  } else {
    tuesdaySpecial.classList.add('hidden');
  }
  
  return {
    discountRate: discountRate,
    originalTotal: originalTotal,
    isTuesday: isTuesday
  };
}

/**
 * 장바구니 UI 업데이트
 * @param {Object} appState - AppState 인스턴스
 * @param {Object} legacyVars - 레거시 변수들
 * @param {number} subTotal - 소계
 * @param {Array} itemDiscounts - 개별 할인 정보
 * @param {Object} discountInfo - 할인 정보
 */
export function updateCartUI(appState, legacyVars, subTotal, itemDiscounts, discountInfo) {
  var cartItems = appState.elements.cartDisplay.children;
  
  // 아이템 개수 업데이트 (AppState 사용)
  document.getElementById('item-count').textContent = '🛍️ ' + appState.itemCount + ' items in cart';
  
  // 요약 정보 업데이트
  var summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';
  
  if (subTotal > 0) {
    // 개별 아이템 표시
    for (let i = 0; i < cartItems.length; i++) {
      var curItem = findProductById(appState.products, cartItems[i].id);
      var qtyElem = cartItems[i].querySelector('.quantity-number');
      var q = parseInt(qtyElem.textContent);
      var itemTotal = curItem.val * q;
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${q}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    }
    
    // 소계 표시
    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTotal.toLocaleString()}</span>
      </div>
    `;
    
    // 할인 정보 표시
    if (appState.itemCount >= appState.CONSTANTS.BULK_QUANTITY_THRESHOLD) {
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
    
    // 화요일 할인 표시
    if (discountInfo.isTuesday) {
      if (legacyVars.totalAmt > 0) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-10%</span>
          </div>
        `;
      }
    }
    
    // 배송 정보 표시
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }
  
  // 총액 업데이트 (AppState 사용)
  var totalDiv = appState.elements.sum.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = '₩' + Math.round(appState.totalAmount).toLocaleString();
  }
  
  // 기본 포인트 표시 업데이트 (AppState 사용)
  var loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    var points = Math.floor(appState.totalAmount * appState.CONSTANTS.POINTS_RATE * 1000);
    if (points > 0) {
      loyaltyPointsDiv.textContent = '적립 포인트: ' + points + 'p';
      loyaltyPointsDiv.style.display = 'block';
    } else {
      loyaltyPointsDiv.textContent = '적립 포인트: 0p';
      loyaltyPointsDiv.style.display = 'block';
    }
  }
  
  // 할인 정보 표시
  var discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';
  
  if (discountInfo.discountRate > 0 && appState.totalAmount > 0) {
    var savedAmount = discountInfo.originalTotal - appState.totalAmount;
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discountInfo.discountRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }
  
  // 아이템 카운트 변경 표시 (AppState 사용)
  var itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    var previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = '🛍️ ' + appState.itemCount + ' items in cart';
    if (previousCount !== appState.itemCount) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }
}

/**
 * 상품 ID로 상품 찾기 (내부 함수)
 * @param {Array} products - 상품 배열
 * @param {string} productId - 찾을 상품 ID
 * @returns {Object|null} 찾은 상품 객체 또는 null
 */
function findProductById(products, productId) {
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === productId) {
      return products[i];
    }
  }
  return null;
}