// 모듈 import
import { appState, PRODUCT_IDS, CONSTANTS } from './entities/app-state/index.js';
import {
  findProductById,
  findAvailableProductExcept,
  calculateTotalStock,
} from './shared/utils/product-utils.js';
import { initializeApplication, initializeProductData } from './features/initialization/index.js';
import { createDOMElements } from './widgets/dom-creator/index.js';
import { setupPromotionTimers } from './features/promotion/index.js';
import {
  calculateCartSubtotal,
  calculateFinalDiscount,
  updateCartUI,
} from './features/pricing/index.js';
import {
  onUpdateSelectOptions,
  updateStockStatus,
  handleCalculateCartStuff,
  doRenderBonusPoints,
  onGetStockTotal,
  doUpdatePricesInCart,
} from './features/events/index.js';
import { setupCartEventHandlers } from './features/cart-management/index.js';

// AppState 참조
const AppState = appState;

// 레거시 변수 객체 (모듈 함수에서 사용)
const legacyVars = {};

function initializeUI() {
  var initStock = calculateTotalStock(AppState.products);
  onUpdateSelectOptions(AppState, legacyVars);
  handleCalculateCartStuff(AppState, legacyVars);
}

function main() {
  initializeApplication(AppState, legacyVars);
  initializeProductData(AppState, legacyVars);
  createDOMElements(AppState, legacyVars);
  setupPromotionTimers(AppState, legacyVars);
  initializeUI();
  setupCartEventHandlers(AppState, legacyVars);
}

main();
