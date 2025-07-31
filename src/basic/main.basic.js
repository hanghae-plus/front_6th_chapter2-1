import {
  Header,
  GridContainer,
  LeftColumn,
  RightColumn,
} from './components/layout';
import { ManualToggle, ManualOverlay, ManualColumn } from './components/manual';
import { ProductSelector, CartContainer, OrderSummary } from './components/ui';
import { initProductList } from './data';
import {
  attachCartEventListener,
  attachManualEventListener,
  attachAddToCartEventListener,
} from './eventListeners';
import { lightningTimer, recommendTimer } from './timer';
import { createCartHandlers, createManualHandlers } from './useCartHandlers';
import { initializeCartState } from './useCartState';

// DOM 요소들과 상품 데이터 (상태는 useCartState에서 관리)
let productList;
let stockInfo;
let selectElement;
let addButton;
let sum;
let cartContainer;

// 메인 초기화 함수
function main() {
  // 상품 데이터 초기화
  productList = initProductList();

  // 기본 DOM 구조 생성
  const root = document.getElementById('app');

  // 헤더 생성
  const header = Header({ itemCount: 0 });

  const gridContainer = GridContainer();
  const leftColumn = LeftColumn();
  const rightColumn = RightColumn();

  const orderSummaryElement = OrderSummary();
  rightColumn.appendChild(orderSummaryElement);
  sum = rightColumn.querySelector('#cart-total');

  // 상품 선택 컨테이너
  const selectorContainer = ProductSelector();
  selectElement = selectorContainer.querySelector('#product-select');
  addButton = selectorContainer.querySelector('#add-to-cart');
  stockInfo = selectorContainer.querySelector('#stock-status');

  leftColumn.appendChild(selectorContainer);

  // 장바구니 표시 영역
  cartContainer = CartContainer();
  leftColumn.appendChild(cartContainer);

  // 도움말 모달 생성
  const manualToggle = ManualToggle();
  const manualOverlay = ManualOverlay();
  const manualColumn = ManualColumn();

  // 상태 관리 초기화
  const cartState = initializeCartState({
    productList,
    cartContainer,
    selectElement,
    findProductById,
    sumElement: sum,
    stockInfoElement: stockInfo,
  });

  // 장바구니 핸들러 초기화 (새로운 상태 관리 사용)
  const cartHandlers = createCartHandlers({
    productList,
    cartContainer,
    selectElement,
    findProductById,
    handleCalculateCartStuff: cartState.calculateCartStuff,
    onUpdateSelectOptions: cartState.updateSelectOptions,
    setLastSelectedProductId: cartState.setLastSelectedProductId,
  });

  // 도움말 모달 핸들러 초기화
  const manualHandlers = createManualHandlers(manualOverlay, manualColumn);

  // 이벤트 리스너 연결
  attachAddToCartEventListener(addButton, cartHandlers);
  attachCartEventListener(cartContainer, cartHandlers);
  attachManualEventListener(manualToggle, manualOverlay, manualHandlers);

  // DOM 구조 조립
  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  manualOverlay.appendChild(manualColumn);

  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);

  // 초기 데이터 설정
  let initStock = 0;
  for (let i = 0; i < productList.length; i++) {
    initStock += productList[i].availableStock;
  }

  cartState.updateSelectOptions();
  cartState.calculateCartStuff();

  // 타이머 기반 이벤트 설정
  lightningTimer(
    productList,
    cartState.updateSelectOptions,
    cartState.updatePricesInCart,
  );
  recommendTimer(
    productList,
    cartState.getLastSelectedProductId(),
    cartState.updateSelectOptions,
    cartState.updatePricesInCart,
  );
}

// 애플리케이션 초기화
main();
function findProductById(productId) {
  return productList.find((product) => product.id === productId);
}
