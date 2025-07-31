import { renderCartSummaryUI } from './components/CartSummary.js';
import { calculateCartSummary } from './hooks/useCartSummary.js';
import { getProducts, setProducts } from './hooks/useProducts.js';

// 항상 최신 products를 인자로 받아 UI를 갱신하는 함수
function handleCalculateCartStuff(cartDisp, stockInfo, sum, productsArg) {
  const productsToUse = productsArg || getProducts();
  const summary = calculateCartSummary(productsToUse, cartDisp.children, new Date());
  renderCartSummaryUI(summary, { cartDisp, stockInfo, sum, products: productsToUse });
}

// window에 등록하여 cartEvents 등에서 호출 가능하게 함 (products 인자 추가)
window.handleCalculateCartStuff = handleCalculateCartStuff;
import { renderHeader } from './components/Header.js';
import { renderManualOverlay } from './components/ManualOverlay.js';
import { renderOrderSummary } from './components/OrderSummary.js';
import { bindCartEvents } from './events/cartEvents.js';
import { bindManualOverlayEvents } from './events/manualOverlayEvents.js';
import { bindPromotionEvents } from './events/promotionEvents.js';
import { createElement } from './utils/dom.js';
import { htmlToElement } from './utils/htmlToElement.js';

// 헤더 영역을 생성하여 반환
function createHeader() {
  return htmlToElement(renderHeader());
}

// 상품 선택 셀렉트, 장바구니 추가 버튼, 재고 표시 영역을 생성하여 반환
import { UI_CLASSNAMES, UI_IDS } from './utils/constants.js';

function createProductSelector() {
  const selectorContainer = createElement('div');
  selectorContainer.className = UI_CLASSNAMES.SELECTOR_CONTAINER;
  const sel = createElement('select');
  sel.id = 'product-select';
  sel.className = UI_CLASSNAMES.SELECT;
  const addBtn = createElement('button');
  addBtn.id = 'add-to-cart';
  addBtn.innerHTML = 'Add to Cart';
  addBtn.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';
  const stockInfo = createElement('div');
  stockInfo.id = 'stock-status';
  stockInfo.className = UI_CLASSNAMES.STOCK_INFO;
  selectorContainer.appendChild(sel);
  selectorContainer.appendChild(addBtn);
  selectorContainer.appendChild(stockInfo);
  return { selectorContainer, sel, addBtn, stockInfo };
}

// 왼쪽 컬럼(상품 선택/버튼/재고 + 장바구니 목록) 생성하여 반환
function createLeftColumn() {
  const leftColumn = createElement('div');
  leftColumn.className = 'bg-white border border-gray-200 p-8 overflow-y-auto';
  const { selectorContainer, sel, addBtn, stockInfo } = createProductSelector();
  leftColumn.appendChild(selectorContainer);
  const cartDisp = createElement('div');
  cartDisp.id = UI_IDS.CART_ITEMS;
  leftColumn.appendChild(cartDisp);
  return { leftColumn, sel, addBtn, stockInfo, cartDisp };
}

// 오른쪽 컬럼(주문 요약 영역) 생성하여 반환
function createRightColumn() {
  const rightColumnEl = htmlToElement(renderOrderSummary());
  const sum = rightColumnEl.querySelector(`#${UI_IDS.CART_TOTAL}`);
  return { rightColumnEl, sum };
}

// 매뉴얼 오버레이(버튼, 오버레이 div) 생성하여 반환
function createManualOverlay() {
  const { manualToggleHtml, manualOverlayHtml } = renderManualOverlay();
  const manualToggleBtn = htmlToElement(manualToggleHtml);
  const manualOverlayDiv = htmlToElement(manualOverlayHtml);
  return { manualToggleBtn, manualOverlayDiv };
}

// 전체 UI를 조립하여 DOM에 추가하고, 주요 엘리먼트 참조 반환
function setupUI() {
  const root = document.getElementById('app');
  const headerEl = createHeader();
  const gridContainer = createElement('div');
  gridContainer.className = 'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';
  const { leftColumn, sel, addBtn, stockInfo, cartDisp } = createLeftColumn();
  const { rightColumnEl, sum } = createRightColumn();
  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumnEl);
  const { manualToggleBtn, manualOverlayDiv } = createManualOverlay();
  root.appendChild(headerEl);
  root.appendChild(gridContainer);
  root.appendChild(manualToggleBtn);
  root.appendChild(manualOverlayDiv);
  return { sel, addBtn, stockInfo, cartDisp, sum, manualToggleBtn, manualOverlayDiv };
}

function main() {
  const { sel, addBtn, stockInfo, cartDisp, sum, manualToggleBtn, manualOverlayDiv } = setupUI();
  bindManualOverlayEvents(manualToggleBtn, manualOverlayDiv);
  // cartEvents에서 products를 갱신할 수 있도록 setter/getter 제공
  const getLastSel = bindCartEvents(sel, addBtn, stockInfo, cartDisp, sum, {
    setProducts,
    getProducts,
    handleCalculateCartStuff,
  });
  bindPromotionEvents(sel, cartDisp, stockInfo, sum, getLastSel);
}

main();
