import { findProductById, calculateTotalStock } from '../../shared/utils/product-utils.js';
import { calculateCartSubtotal, calculateFinalDiscount, updateCartUI } from '../pricing/index.js';

/**
 * 이벤트 핸들러 기능
 */

/**
 * 상품 선택 옵션 업데이트
 * @param {Object} appState - AppState 인스턴스
 * @param {Object} legacyVars - 레거시 변수들
 */
export function onUpdateSelectOptions(appState, legacyVars) {
  var totalStock;
  var opt;
  var discountText;
  appState.elements.productSelect.innerHTML = '';
  legacyVars.sel.innerHTML = ''; // 레거시 동기화
  
  totalStock = calculateTotalStock(appState.products);
  for (var i = 0; i < appState.products.length; i++) {
    (function() {
      var item = appState.products[i];
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
      appState.elements.productSelect.appendChild(opt);
      legacyVars.sel.appendChild(opt); // 레거시 동기화
    })();
  }
  if (totalStock < appState.CONSTANTS.STOCK_WARNING_THRESHOLD) {
    appState.elements.productSelect.style.borderColor = 'orange';
    legacyVars.sel.style.borderColor = 'orange'; // 레거시 동기화
  } else {
    appState.elements.productSelect.style.borderColor = '';
    legacyVars.sel.style.borderColor = ''; // 레거시 동기화
  }
}

/**
 * 재고 상태 업데이트
 * @param {Object} appState - AppState 인스턴스
 * @param {Object} legacyVars - 레거시 변수들
 */
export function updateStockStatus(appState, legacyVars) {
  var stockMsg = '';
  
  for (var stockIdx = 0; stockIdx < appState.products.length; stockIdx++) {
    var item = appState.products[stockIdx];
    if (item.q < appState.CONSTANTS.LOW_STOCK_THRESHOLD) {
      if (item.q > 0) {
        stockMsg = stockMsg + item.name + ': 재고 부족 (' + item.q + '개 남음)\n';
      } else {
        stockMsg = stockMsg + item.name + ': 품절\n';
      }
    }
  }
  
  appState.elements.stockInfo.textContent = stockMsg;
  
  // 레거시 변수 동기화
  legacyVars.stockInfo.textContent = stockMsg;
}

/**
 * 장바구니 계산 처리
 * @param {Object} appState - AppState 인스턴스
 * @param {Object} legacyVars - 레거시 변수들
 */
export function handleCalculateCartStuff(appState, legacyVars) {
  // 1. 장바구니 소계 및 개별 할인 계산
  var subtotalResult = calculateCartSubtotal(appState, legacyVars);
  
  // 2. 전체 할인 계산 (대량구매, 화요일)
  var discountResult = calculateFinalDiscount(appState, legacyVars, subtotalResult.subTotal);
  
  // 3. UI 업데이트
  updateCartUI(appState, legacyVars, subtotalResult.subTotal, subtotalResult.itemDiscounts, discountResult);
  
  // 4. 재고 상태 업데이트
  updateStockStatus(appState, legacyVars);
  
  // 5. 포인트 계산
  doRenderBonusPoints(appState, legacyVars);
}

/**
 * 포인트 렌더링
 * @param {Object} appState - AppState 인스턴스
 * @param {Object} legacyVars - 레거시 변수들
 */
export function doRenderBonusPoints(appState, legacyVars) {
  var basePoints;
  var finalPoints;
  var pointsDetail;
  var hasKeyboard;
  var hasMouse;
  var hasMonitorArm;
  var nodes;
  if (legacyVars.cartDisp.children.length === 0) {
    document.getElementById('loyalty-points').style.display = 'none';
    return;
  }
  basePoints = Math.floor(appState.totalAmount / 1000)
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
  nodes = legacyVars.cartDisp.children;
  for (const node of nodes) {
    var product = findProductById(appState.products, node.id);
    if (!product) continue;
    if (product.id === appState.PRODUCT_IDS.KEYBOARD) {
      hasKeyboard = true;
    } else if (product.id === appState.PRODUCT_IDS.MOUSE) {
      hasMouse = true;
    } else if (product.id === appState.PRODUCT_IDS.MONITOR_ARM) {
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
  if (appState.itemCount >= 30) {
    finalPoints = finalPoints + 100;
    pointsDetail.push('대량구매(30개+) +100p');
  } else {
    if (appState.itemCount >= 20) {
      finalPoints = finalPoints + 50;
      pointsDetail.push('대량구매(20개+) +50p');
    } else {
      if (appState.itemCount >= 10) {
        finalPoints = finalPoints + 20;
        pointsDetail.push('대량구매(10개+) +20p');
      }
    }
  }
  legacyVars.bonusPts = finalPoints;
  var ptsTag = document.getElementById('loyalty-points');
  if (ptsTag) {
    if (legacyVars.bonusPts > 0) {
      ptsTag.innerHTML = '<div>적립 포인트: <span class="font-bold">' + legacyVars.bonusPts + 'p</span></div>' +
        '<div class="text-2xs opacity-70 mt-1">' + pointsDetail.join(', ') + '</div>';
      ptsTag.style.display = 'block';
    } else {
      ptsTag.textContent = '적립 포인트: 0p';
      ptsTag.style.display = 'block'
    }
  }
}

/**
 * 장바구니 가격 업데이트
 * @param {Object} appState - AppState 인스턴스
 * @param {Object} legacyVars - 레거시 변수들
 */
export function doUpdatePricesInCart(appState, legacyVars) {
  var cartItems = legacyVars.cartDisp.children;
  
  // 장바구니의 각 아이템에 대해 가격과 이름 업데이트
  for (var i = 0; i < cartItems.length; i++) {
    var itemId = cartItems[i].id;
    var product = findProductById(appState.products, itemId);
    
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
  handleCalculateCartStuff(appState, legacyVars);
}

/**
 * 총 재고 조회
 * @param {Object} appState - AppState 인스턴스
 * @returns {number} 총 재고 수
 */
export function onGetStockTotal(appState) {
  return calculateTotalStock(appState.products);
}







 