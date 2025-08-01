import { initializeAppData } from './shared/core/state.js';
import { createDOMStructure } from './shared/core/dom.js';
import { initializeEvents } from './shared/core/events.js';
import {
  getProducts,
  getLastSelectedProductId,
} from './shared/core/business-state.js';
import {
  CartController,
  ProductController,
  LightningSaleService,
  SuggestedSaleService,
} from './features/index.js';

function main() {
  // 앱 데이터 초기화
  initializeAppData();

  // DOM 구조 생성
  createDOMStructure();

  // 초기 UI 업데이트
  ProductController.updateSelectOptions();
  CartController.updateCartDisplay();

  // 이벤트 핸들러 초기화
  initializeEvents();

  // 프로모션 시스템
  LightningSaleService.startLightningSaleSystem(getProducts, () => {
    ProductController.updateSelectOptions();
    CartController.updateCartPrices();
  });

  SuggestedSaleService.startSuggestedSaleSystem(
    getProducts,
    getLastSelectedProductId,
    () => {
      ProductController.updateSelectOptions();
      CartController.updateCartPrices();
    }
  );
}

main();
