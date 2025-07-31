import { PRODUCT_DATA } from '../shared/constants/products';
import { updateProductOptions, updateCartDisplay } from './modules/index';
import {
  createInitialCartState,
  initializeCart,
  getProductInventory,
} from './state/cart.js';
import { createMainLayout } from './ui/index.js';
import {
  setupManualEvents,
  setupAddToCartEvent,
  setupCartItemEvents,
} from './events/index.js';
import {
  generateStockStatus,
  isTuesday,
} from '../shared/utils/cart-helpers.js';
import {
  useLightningSaleEffect,
  useSuggestionSaleEffect,
} from './hooks/useSaleEffects.js';

let cartState = createInitialCartState();
let ui = null;

function main() {
  cartState = initializeCart(cartState, PRODUCT_DATA);

  // 초기 UI 생성
  const productInventory = getProductInventory(cartState);
  const stockStatus = generateStockStatus(productInventory);

  ui = createMainLayout({
    itemCount: 0,
    products: productInventory,
    stockStatus,
    cartItems: [],
    cartTotal: 0,
    loyaltyPoints: 0,
    discountInfo: '',
    isTuesday: isTuesday(),
  });

  // 이벤트 설정
  setupManualEvents(ui);

  // 이벤트 핸들러에서 사용할 UI 요소들 추출
  const productSelector = ui.productSelector.selector;
  const addToCartButton = ui.productSelector.addButton;
  const cartDisplayArea = ui.cartDisplay.container;

  // 기존 모듈 함수들로 추가 UI 업데이트
  updateProductOptions({
    sel: productSelector,
    prodList: getProductInventory(cartState),
  });

  updateCartDisplay({
    cartDisp: cartDisplayArea,
    prodList: getProductInventory(cartState),
  });

  // 사이드 이펙트 설정 (알림)
  useLightningSaleEffect(cartState, ui);
  useSuggestionSaleEffect(cartState, ui);

  // 기존 이벤트 설정 (호환성 유지)
  setupAddToCartEvent({
    addToCartButton,
    productSelector,
    cartDisplayArea,
    getCartState: () => cartState,
    setCartState: newState => {
      cartState = newState;
    },
  });

  setupCartItemEvents({
    cartDisplayArea,
    productSelector,
    getCartState: () => cartState,
    setCartState: newState => {
      cartState = newState;
    },
  });
}

main();
