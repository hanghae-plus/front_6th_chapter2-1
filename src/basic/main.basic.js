

// 모듈 import
import { appState, PRODUCT_IDS, CONSTANTS } from './entities/app-state/index.js';
import { findProductById, findAvailableProductExcept, calculateTotalStock } from './shared/utils/product-utils.js';
import { initializeApplication, initializeProductData } from './features/initialization/index.js';
import { createDOMElements } from './widgets/dom-creator/index.js';
import { setupPromotionTimers } from './features/promotion/index.js';
import { calculateCartSubtotal, calculateFinalDiscount, updateCartUI } from './features/pricing/index.js';
import { onUpdateSelectOptions, updateStockStatus, handleCalculateCartStuff, doRenderBonusPoints, onGetStockTotal, doUpdatePricesInCart } from './features/events/index.js';

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

function setupPromotionTimersLegacy() {
  setupPromotionTimers(AppState, legacyVars);
}

function onUpdateSelectOptionsLegacy() {
  onUpdateSelectOptions(AppState, legacyVars);
}

function updateStockStatusLegacy() {
  updateStockStatus(AppState, legacyVars);
}

function handleCalculateCartStuffLegacy() {
  handleCalculateCartStuff(AppState, legacyVars);
}

function doRenderBonusPointsLegacy() {
  doRenderBonusPoints(AppState, legacyVars);
}

function onGetStockTotalLegacy() {
  return onGetStockTotal(AppState);
}

function doUpdatePricesInCartLegacy() {
  doUpdatePricesInCart(AppState, legacyVars);
}

function initializeUI() {
  var initStock = calculateTotalStockLegacy();
  onUpdateSelectOptionsLegacy();
  handleCalculateCartStuffLegacy();
}

function main() {
  initializeApplicationLegacy();
  initializeProductDataLegacy();
  createDOMElementsLegacy();
  setupPromotionTimersLegacy();
  initializeUI();
};
var sum
function calculateCartSubtotalLegacy() {
  return calculateCartSubtotal(AppState, legacyVars);
}

function calculateFinalDiscountLegacy(subTotal) {
  return calculateFinalDiscount(AppState, legacyVars, subTotal);
}

function updateCartUILegacy(subTotal, itemDiscounts, discountInfo) {
  updateCartUI(AppState, legacyVars, subTotal, itemDiscounts, discountInfo);
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
    
    handleCalculateCartStuffLegacy();
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
    handleCalculateCartStuffLegacy();
    onUpdateSelectOptionsLegacy();
  }
});