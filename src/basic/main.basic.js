

// 모듈 import
import { appState, PRODUCT_IDS, CONSTANTS } from './entities/app-state/index.js';
import { findProductById, findAvailableProductExcept, calculateTotalStock } from './shared/utils/product-utils.js';
import { initializeApplication, initializeProductData } from './features/initialization/index.js';
import { createDOMElements } from './widgets/dom-creator/index.js';

// 레거시 호환성을 위한 AppState 참조
const AppState = appState;

// AppState에 상수 추가 (레거시 호환성)
AppState.PRODUCT_IDS = PRODUCT_IDS;
AppState.CONSTANTS = CONSTANTS;

// 상품 검색 유틸리티 함수들 (모듈 함수 사용)
function findProductByIdLegacy(productId) {
  return findProductById(AppState.products, productId);
}

function findAvailableProductExceptLegacy(excludeId) {
  return findAvailableProductExcept(AppState.products, excludeId);
}

function calculateTotalStockLegacy() {
  return calculateTotalStock(AppState.products);
}

// 레거시 호환성을 위한 전역 변수들 (점진적 제거 예정)
var prodList
var bonusPts = 0
var stockInfo
var itemCnt
var lastSel
var sel
var addBtn
var totalAmt = 0
var cartDisp
// 레거시 변수 객체 (모듈 함수에서 사용)
const legacyVars = {
  prodList,
  bonusPts,
  stockInfo,
  itemCnt,
  lastSel,
  sel,
  addBtn,
  totalAmt,
  cartDisp
};

function initializeApplicationLegacy() {
  initializeApplication(AppState, legacyVars);
}

function initializeProductDataLegacy() {
  initializeProductData(AppState, legacyVars);
}

function createDOMElementsLegacy() {
  createDOMElements(AppState, legacyVars);
  
  // 레거시 변수 동기화
  sel = legacyVars.sel;
  addBtn = legacyVars.addBtn;
  stockInfo = legacyVars.stockInfo;
  cartDisp = legacyVars.cartDisp;
  sum = legacyVars.sum;
}

function setupPromotionTimers() {
  var lightningDelay = Math.random() * 10000;
  setTimeout(() => {
    setInterval(function () {
      var luckyIdx = Math.floor(Math.random() * prodList.length);
      var luckyItem = prodList[luckyIdx];
      if (luckyItem.q > 0 && !luckyItem.onSale) {
        luckyItem.val = Math.round(luckyItem.originalVal * 80 / 100);
        luckyItem.onSale = true;
        alert('⚡번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        onUpdateSelectOptions();
        doUpdatePricesInCart();
      }
    }, 30000);
  }, lightningDelay);
  setTimeout(function () {
    setInterval(function () {
      if (cartDisp.children.length === 0) {
      }
      if (lastSel) {
        var suggest = findAvailableProductExceptLegacy(lastSel);
        if (suggest) {
          alert('💝 ' + suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.val = Math.round(suggest.val * (100 - 5) / 100);
          suggest.suggestSale = true;
          onUpdateSelectOptions();
          doUpdatePricesInCart();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

function initializeUI() {
  var initStock = calculateTotalStockLegacy();
  onUpdateSelectOptions();
  handleCalculateCartStuff();
}

function main() {
  initializeApplicationLegacy();
  initializeProductDataLegacy();
  createDOMElementsLegacy();
  setupPromotionTimers();
  initializeUI();
};
var sum
function onUpdateSelectOptions() {
  var totalStock;
  var opt;
  var discountText;
  AppState.elements.productSelect.innerHTML = '';
  sel.innerHTML = ''; // 레거시 동기화
  
  totalStock = calculateTotalStockLegacy();
  for (var i = 0; i < AppState.products.length; i++) {
    (function() {
      var item = AppState.products[i];
      opt = document.createElement("option")
      opt.value = item.id;
      discountText = '';
      if (item.onSale) discountText += ' ⚡SALE';
      if (item.suggestSale) discountText += ' 💝추천';
      if (item.q === 0) {
        opt.textContent = item.name + ' - ' + item.val + '원 (품절)' + discountText
        opt.disabled = true
        opt.className = 'text-gray-400';
      } else {
        if (item.onSale && item.suggestSale) {
          opt.textContent = '⚡💝' + item.name + ' - ' + item.originalVal + '원 → ' + item.val + '원 (25% SUPER SALE!)';
          opt.className = 'text-purple-600 font-bold';
        } else if (item.onSale) {
          opt.textContent = '⚡' + item.name + ' - ' + item.originalVal + '원 → ' + item.val + '원 (20% SALE!)';
          opt.className = 'text-red-500 font-bold';
        } else if (item.suggestSale) {
          opt.textContent = '💝' + item.name + ' - ' + item.originalVal + '원 → ' + item.val + '원 (5% 추천할인!)';
          opt.className = 'text-blue-500 font-bold';
        } else {
          opt.textContent = item.name + ' - ' + item.val + '원' + discountText;
        }
      }
      AppState.elements.productSelect.appendChild(opt);
      sel.appendChild(opt); // 레거시 동기화
    })();
  }
  if (totalStock < AppState.CONSTANTS.STOCK_WARNING_THRESHOLD) {
    AppState.elements.productSelect.style.borderColor = 'orange';
    sel.style.borderColor = 'orange'; // 레거시 동기화
  } else {
    AppState.elements.productSelect.style.borderColor = '';
    sel.style.borderColor = ''; // 레거시 동기화
  }
}
function calculateCartSubtotal() {
  var cartItems = AppState.elements.cartDisplay.children;
  var subTotal = 0;
  var itemDiscounts = [];
  
  // AppState 값 초기화
  AppState.totalAmount = 0;
  AppState.itemCount = 0;
  
  // 레거시 변수 동기화
  totalAmt = 0;
  itemCnt = 0;
  
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      var curItem = findProductByIdLegacy(cartItems[i].id);
      
      var qtyElem = cartItems[i].querySelector('.quantity-number');
      var quantity = parseInt(qtyElem.textContent);
      var itemTotal = curItem.val * quantity;
      var discount = 0;
      
      // AppState 업데이트
      AppState.itemCount += quantity;
      
      // 레거시 변수 동기화
      itemCnt += quantity;
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
      if (quantity >= AppState.CONSTANTS.BULK_DISCOUNT_THRESHOLD) {
        if (curItem.id === AppState.PRODUCT_IDS.KEYBOARD) {
          discount = AppState.CONSTANTS.KEYBOARD_DISCOUNT;
        } else if (curItem.id === AppState.PRODUCT_IDS.MOUSE) {
          discount = AppState.CONSTANTS.MOUSE_DISCOUNT;
        } else if (curItem.id === AppState.PRODUCT_IDS.MONITOR_ARM) {
          discount = AppState.CONSTANTS.MONITOR_ARM_DISCOUNT;
        } else if (curItem.id === AppState.PRODUCT_IDS.LAPTOP_POUCH) {
          discount = AppState.CONSTANTS.LAPTOP_POUCH_DISCOUNT;
        } else if (curItem.id === AppState.PRODUCT_IDS.SPEAKER) {
          discount = AppState.CONSTANTS.SPEAKER_DISCOUNT;
        }
        if (discount > 0) {
          itemDiscounts.push({name: curItem.name, discount: discount * 100});
        }
      }
      
      var finalItemTotal = itemTotal * (1 - discount);
      AppState.totalAmount += finalItemTotal;
      
      // 레거시 변수 동기화
      totalAmt += finalItemTotal;
    })();
  }
  
  return {
    subTotal: subTotal,
    itemDiscounts: itemDiscounts
  };
}

function calculateFinalDiscount(subTotal) {
  var discountRate = 0;
  var originalTotal = subTotal;
  
  // 대량구매 할인
  if (AppState.itemCount >= AppState.CONSTANTS.BULK_QUANTITY_THRESHOLD) {
    AppState.totalAmount = subTotal * (1 - AppState.CONSTANTS.BULK_QUANTITY_DISCOUNT_RATE);
    totalAmt = AppState.totalAmount; // 레거시 동기화
    discountRate = AppState.CONSTANTS.BULK_QUANTITY_DISCOUNT_RATE;
  } else {
    discountRate = (subTotal - AppState.totalAmount) / subTotal;
  }
  
  // 화요일 할인
  const today = new Date();
  var isTuesday = today.getDay() === AppState.CONSTANTS.TUESDAY_DAY_OF_WEEK;
  var tuesdaySpecial = document.getElementById('tuesday-special');
  
  if (isTuesday) {
    if (AppState.totalAmount > 0) {
      AppState.totalAmount = AppState.totalAmount * (1 - AppState.CONSTANTS.TUESDAY_DISCOUNT_RATE);
      totalAmt = AppState.totalAmount; // 레거시 동기화
      discountRate = 1 - (AppState.totalAmount / originalTotal);
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

function updateCartUI(subTotal, itemDiscounts, discountInfo) {
  var cartItems = AppState.elements.cartDisplay.children;
  
  // 아이템 개수 업데이트 (AppState 사용)
  document.getElementById('item-count').textContent = '🛍️ ' + AppState.itemCount + ' items in cart';
  
  // 요약 정보 업데이트
  var summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';
  
  if (subTotal > 0) {
    // 개별 아이템 표시
    for (let i = 0; i < cartItems.length; i++) {
      var curItem = findProductByIdLegacy(cartItems[i].id);
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
    if (AppState.itemCount >= AppState.CONSTANTS.BULK_QUANTITY_THRESHOLD) {
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
      if (totalAmt > 0) {
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
  var totalDiv = AppState.elements.sum.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = '₩' + Math.round(AppState.totalAmount).toLocaleString();
  }
  
  // 기본 포인트 표시 업데이트 (AppState 사용)
  var loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    var points = Math.floor(AppState.totalAmount * AppState.CONSTANTS.POINTS_RATE * 1000);
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
  
  if (discountInfo.discountRate > 0 && AppState.totalAmount > 0) {
    var savedAmount = discountInfo.originalTotal - AppState.totalAmount;
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
    itemCountElement.textContent = '🛍️ ' + AppState.itemCount + ' items in cart';
    if (previousCount !== AppState.itemCount) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }
}

function updateStockStatus() {
  var stockMsg = '';
  
  for (var stockIdx = 0; stockIdx < AppState.products.length; stockIdx++) {
    var item = AppState.products[stockIdx];
    if (item.q < AppState.CONSTANTS.LOW_STOCK_THRESHOLD) {
      if (item.q > 0) {
        stockMsg = stockMsg + item.name + ': 재고 부족 (' + item.q + '개 남음)\n';
      } else {
        stockMsg = stockMsg + item.name + ': 품절\n';
      }
    }
  }
  
  AppState.elements.stockInfo.textContent = stockMsg;
  
  // 레거시 변수 동기화
  stockInfo.textContent = stockMsg;
}

function handleCalculateCartStuff() {
  // 1. 장바구니 소계 및 개별 할인 계산
  var subtotalResult = calculateCartSubtotal();
  
  // 2. 전체 할인 계산 (대량구매, 화요일)
  var discountResult = calculateFinalDiscount(subtotalResult.subTotal);
  
  // 3. UI 업데이트
  updateCartUI(subtotalResult.subTotal, subtotalResult.itemDiscounts, discountResult);
  
  // 4. 재고 상태 업데이트
  updateStockStatus();
  
  // 5. 포인트 계산
  doRenderBonusPoints();
}
var doRenderBonusPoints = function() {
  var basePoints;
  var finalPoints;
  var pointsDetail;
  var hasKeyboard;
  var hasMouse;
  var hasMonitorArm;
  var nodes;
  if (cartDisp.children.length === 0) {
    document.getElementById('loyalty-points').style.display = 'none';
    return;
  }
  basePoints = Math.floor(totalAmt / 1000)
  finalPoints = 0;
  pointsDetail = [];
  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push('기본: ' + basePoints + 'p');
  }
  if (new Date().getDay() === 2) {
    if (basePoints > 0) {
      finalPoints = basePoints * 2;
      pointsDetail.push('화요일 2배');
    }
  }
  hasKeyboard = false;
  hasMouse = false;
  hasMonitorArm = false;
  nodes = cartDisp.children;
  for (const node of nodes) {
    var product = findProductByIdLegacy(node.id);
    if (!product) continue;
    if (product.id === AppState.PRODUCT_IDS.KEYBOARD) {
      hasKeyboard = true;
    } else if (product.id === AppState.PRODUCT_IDS.MOUSE) {
      hasMouse = true;
    } else if (product.id === AppState.PRODUCT_IDS.MONITOR_ARM) {
      hasMonitorArm = true;
    }
  }
  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + 50;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + 100;
    pointsDetail.push('풀세트 구매 +100p');
  }
  if (itemCnt >= 30) {
    finalPoints = finalPoints + 100;
    pointsDetail.push('대량구매(30개+) +100p');
  } else {
    if (itemCnt >= 20) {
      finalPoints = finalPoints + 50;
      pointsDetail.push('대량구매(20개+) +50p');
    } else {
      if (itemCnt >= 10) {
        finalPoints = finalPoints + 20;
        pointsDetail.push('대량구매(10개+) +20p');
      }
    }
  }
  bonusPts = finalPoints;
  var ptsTag = document.getElementById('loyalty-points');
  if (ptsTag) {
    if (bonusPts > 0) {
      ptsTag.innerHTML = '<div>적립 포인트: <span class="font-bold">' + bonusPts + 'p</span></div>' +
        '<div class="text-2xs opacity-70 mt-1">' + pointsDetail.join(', ') + '</div>';
      ptsTag.style.display = 'block';
    } else {
      ptsTag.textContent = '적립 포인트: 0p';
      ptsTag.style.display = 'block'
    }
  }
}
function onGetStockTotal() {
  return calculateTotalStockLegacy();
}
function doUpdatePricesInCart() {
  var cartItems = cartDisp.children;
  
  // 장바구니의 각 아이템에 대해 가격과 이름 업데이트
  for (var i = 0; i < cartItems.length; i++) {
    var itemId = cartItems[i].id;
    var product = findProductByIdLegacy(itemId);
    
    if (product) {
      var priceDiv = cartItems[i].querySelector('.text-lg');
      var nameDiv = cartItems[i].querySelector('h3');
      
      // 세일 상태에 따른 가격 및 이름 표시
      if (product.onSale && product.suggestSale) {
        // 번개세일 + 추천할인
        priceDiv.innerHTML = '<span class="line-through text-gray-400">₩' + product.originalVal.toLocaleString() + '</span> <span class="text-purple-600">₩' + product.val.toLocaleString() + '</span>';
        nameDiv.textContent = '⚡💝' + product.name;
      } else if (product.onSale) {
        // 번개세일만
        priceDiv.innerHTML = '<span class="line-through text-gray-400">₩' + product.originalVal.toLocaleString() + '</span> <span class="text-red-500">₩' + product.val.toLocaleString() + '</span>';
        nameDiv.textContent = '⚡' + product.name;
      } else if (product.suggestSale) {
        // 추천할인만
        priceDiv.innerHTML = '<span class="line-through text-gray-400">₩' + product.originalVal.toLocaleString() + '</span> <span class="text-blue-500">₩' + product.val.toLocaleString() + '</span>';
        nameDiv.textContent = '💝' + product.name;
      } else {
        // 일반 가격
        priceDiv.textContent = '₩' + product.val.toLocaleString();
        nameDiv.textContent = product.name;
      }
    }
  }
  
  // 전체 계산 업데이트
  handleCalculateCartStuff();
}
main();

// 장바구니 추가 버튼 이벤트 핸들러
addBtn.addEventListener("click", function () {
  var selItem = sel.value;
  var hasItem = findProductByIdLegacy(selItem) !== null;
  
  if (!selItem || !hasItem) {
    return;
  }
  
  var itemToAdd = findProductByIdLegacy(selItem);
  if (itemToAdd && itemToAdd.q > 0) {
    var item = document.getElementById(itemToAdd.id);
    
    if (item) {
      // 기존 아이템 수량 증가
      var qtyElem = item.querySelector('.quantity-number');
      var newQty = parseInt(qtyElem.textContent) + 1;
      
      if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
        qtyElem.textContent = newQty;
        itemToAdd.q--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      // 새 아이템 추가
      var newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className = 'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';
      
      var saleIcon = '';
      var priceClass = '';
      var priceHTML = '';
      
      if (itemToAdd.onSale && itemToAdd.suggestSale) {
        saleIcon = '⚡💝';
        priceClass = 'text-purple-600';
      } else if (itemToAdd.onSale) {
        saleIcon = '⚡';
        priceClass = 'text-red-500';
      } else if (itemToAdd.suggestSale) {
        saleIcon = '💝';
        priceClass = 'text-blue-500';
      }
      
      if (itemToAdd.onSale || itemToAdd.suggestSale) {
        priceHTML = '<span class="line-through text-gray-400">₩' + itemToAdd.originalVal.toLocaleString() + '</span> <span class="' + priceClass + '">₩' + itemToAdd.val.toLocaleString() + '</span>';
      } else {
        priceHTML = '₩' + itemToAdd.val.toLocaleString();
      }
      
      newItem.innerHTML = `
        <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
          <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
        </div>
        <div>
          <h3 class="text-base font-normal mb-1 tracking-tight">${saleIcon}${itemToAdd.name}</h3>
          <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
          <p class="text-xs text-black mb-3">${priceHTML}</p>
          <div class="flex items-center gap-4">
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="-1">−</button>
            <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="1">+</button>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg mb-2 tracking-tight tabular-nums">${priceHTML}</div>
          <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${itemToAdd.id}">Remove</a>
        </div>
      `;
      
      cartDisp.appendChild(newItem);
      itemToAdd.q--;
    }
    
    handleCalculateCartStuff();
    lastSel = selItem;
  }
});

// 장바구니 아이템 수량 변경 및 삭제 이벤트 핸들러
cartDisp.addEventListener("click", function (event) {
  var target = event.target;
  
  if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
    var productId = target.dataset.productId;
    var itemElement = document.getElementById(productId);
    var product = findProductByIdLegacy(productId);
    
    if (target.classList.contains('quantity-change')) {
      // 수량 변경 처리
      var quantityChange = parseInt(target.dataset.change);
      var quantityElement = itemElement.querySelector('.quantity-number');
      var currentQuantity = parseInt(quantityElement.textContent);
      var newQuantity = currentQuantity + quantityChange;
      
      if (newQuantity > 0 && newQuantity <= product.q + currentQuantity) {
        quantityElement.textContent = newQuantity;
        product.q -= quantityChange;
      } else if (newQuantity <= 0) {
        // 수량이 0 이하가 되면 아이템 제거
        product.q += currentQuantity;
        itemElement.remove();
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (target.classList.contains('remove-item')) {
      // 아이템 완전 제거
      var quantityElement = itemElement.querySelector('.quantity-number');
      var removeQuantity = parseInt(quantityElement.textContent);
      product.q += removeQuantity;
      itemElement.remove();
    }
    
    // UI 업데이트
    handleCalculateCartStuff();
    onUpdateSelectOptions();
  }
});