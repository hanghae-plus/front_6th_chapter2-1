// 모듈 import
import { appState } from './entities/app-state/index.js';
import { calculateTotalStock } from './shared/utils/product-utils.js';
import { initializeApplication, initializeProductData } from './features/initialization/index.js';
import { createDOMElements } from './widgets/dom-creator/index.js';
import { setupPromotionTimers } from './features/promotion/index.js';
import { onUpdateSelectOptions, handleCalculateCartStuff } from './features/events/index.js';
import { setupCartEventHandlers } from './features/cart-management/index.js';

// AppState 참조
const AppState = appState;

function initializeUI() {
  var initStock = calculateTotalStock(AppState.products);
  onUpdateSelectOptions(AppState);
  handleCalculateCartStuff(AppState);
}

function main() {
  initializeApplication(AppState);
  initializeProductData(AppState);
  createDOMElements(AppState);
  setupPromotionTimers(AppState);
  initializeUI();
  setupCartEventHandlers(AppState);
}

main();
