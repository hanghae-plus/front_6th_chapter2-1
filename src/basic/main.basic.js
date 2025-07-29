

// 모듈 import
import { appState, PRODUCT_IDS, CONSTANTS } from './entities/app-state/index.js';
import { findProductById, findAvailableProductExcept, calculateTotalStock } from './shared/utils/product-utils.js';
import { initializeApplication, initializeProductData } from './features/initialization/index.js';
import { createDOMElements } from './widgets/dom-creator/index.js';
import { setupPromotionTimers } from './features/promotion/index.js';
import { calculateCartSubtotal, calculateFinalDiscount, updateCartUI } from './features/pricing/index.js';
import { onUpdateSelectOptions, updateStockStatus, handleCalculateCartStuff, doRenderBonusPoints, onGetStockTotal, doUpdatePricesInCart } from './features/events/index.js';
import { setupCartEventHandlers } from './features/cart-management/index.js';

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
  setupCartEventHandlers(AppState, legacyVars);
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