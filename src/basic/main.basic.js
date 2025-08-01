import {
  Header,
  GridContainer,
  LeftColumn,
  RightColumn,
} from './components/layout';
import { ManualToggle, ManualOverlay, ManualColumn } from './components/manual';
import { ProductSelector, CartContainer, OrderSummary } from './components/ui';
import { initProductList } from './constants/data';
import {
  attachCartEventListener,
  attachManualEventListener,
  attachAddToCartEventListener,
} from './events/eventListeners';
import {
  createCartHandlers,
  createManualHandlers,
} from './hooks/useCartHandlers';
import { initializeCartState } from './hooks/useCartState';
import { lightningTimer, recommendTimer } from './services/timer';

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
  // DOM 구성 요소 생성
  const elements = createDOMElements();

  const { cartState, cartHandlers, manualHandlers } =
    initializeStateAndHandlers(elements);
  attachEventListeners(elements, cartHandlers, manualHandlers);
  assembleDOMStructure(elements);
  initializeInitialState(cartState);
  setupTimers(cartState);
}

// DOM 구성 요소 생성
function createDOMElements() {
  const root = document.getElementById('app');

  // 기본 레이아웃
  const header = Header({ itemCount: 0 });
  const gridContainer = GridContainer();
  const leftColumn = LeftColumn();
  const rightColumn = RightColumn();

  // 오른쪽 컬럼 (주문 요약)
  const orderSummaryElement = OrderSummary();
  rightColumn.appendChild(orderSummaryElement);
  sum = rightColumn.querySelector('#cart-total');

  // 왼쪽 컬럼 (상품 선택 & 장바구니)
  const selectorContainer = ProductSelector();
  selectElement = selectorContainer.querySelector('#product-select');
  addButton = selectorContainer.querySelector('#add-to-cart');
  stockInfo = selectorContainer.querySelector('#stock-status');

  cartContainer = CartContainer();
  leftColumn.appendChild(selectorContainer);
  leftColumn.appendChild(cartContainer);

  // 도움말 모달
  const manualToggle = ManualToggle();
  const manualOverlay = ManualOverlay();
  const manualColumn = ManualColumn();

  return {
    root,
    header,
    gridContainer,
    leftColumn,
    rightColumn,
    manualToggle,
    manualOverlay,
    manualColumn,
    selectorContainer,
    orderSummaryElement,
  };
}

// 상태 및 핸들러 초기화
function initializeStateAndHandlers(elements) {
  // 상태 관리 초기화
  const cartState = initializeCartState({
    productList,
    cartContainer,
    selectElement,
    findProductById,
    sumElement: sum,
    stockInfoElement: stockInfo,
  });

  // 핸들러 초기화
  const cartHandlers = createCartHandlers({
    productList,
    cartContainer,
    selectElement,
    findProductById,
    handleCalculateCartStuff: cartState.calculateCartStuff,
    onUpdateSelectOptions: cartState.updateSelectOptions,
    setLastSelectedProductId: cartState.setLastSelectedProductId,
  });

  const manualHandlers = createManualHandlers(
    elements.manualOverlay,
    elements.manualColumn,
  );

  return { cartState, cartHandlers, manualHandlers };
}

// 이벤트 리스너 연결
function attachEventListeners(elements, cartHandlers, manualHandlers) {
  attachAddToCartEventListener(addButton, cartHandlers);
  attachCartEventListener(cartContainer, cartHandlers);
  attachManualEventListener(
    elements.manualToggle,
    elements.manualOverlay,
    manualHandlers,
  );
}

// DOM 구조 조립
function assembleDOMStructure(elements) {
  const {
    root,
    header,
    gridContainer,
    leftColumn,
    rightColumn,
    manualToggle,
    manualOverlay,
    manualColumn,
  } = elements;

  // 그리드 컨테이너 조립
  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);

  // 모달 조립
  manualOverlay.appendChild(manualColumn);

  // 루트에 최종 조립
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);
}

// 초기 상태 설정
function initializeInitialState(cartState) {
  cartState.updateSelectOptions();
  cartState.calculateCartStuff();
}

// 타이머 설정
function setupTimers(cartState) {
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

// 유틸리티 함수
function findProductById(productId) {
  return productList.find((product) => product.id === productId);
}

// 애플리케이션 초기화
main();
