import { createManual } from '../components/Manual/index.js';
import { createManualToggle } from '../components/ManualToggle.js';
import { createHeader } from '../components/Header.js';
import { createProductSelector } from '../components/ProductSelector.js';
import {
  createGridContainer,
  createLeftColumn,
  createRightColumn,
} from '../components/Layout.js';
import { createCartDisplay } from '../components/CartDisplay/index.js';
import { createOrderSummary } from '../components/OrderSummary/index.js';
import { startLightningSale, startSuggestSale } from '../services/sale.js';
import { getQuantityFromElement } from '../utils/global/index.js';

function main() {
  // 컴포넌트 초기화
  const root = document.getElementById('app');
  const header = createHeader({ itemCount: 0 });
  const gridContainer = createGridContainer();
  const leftColumn = createLeftColumn();
  const rightColumn = createRightColumn();
  const productSelector = createProductSelector();
  const cartDisplay = createCartDisplay();
  const orderSummary = createOrderSummary({
    subTot: 0,
    cartItems: [],
    itemCnt: 0,
    itemDiscounts: [],
    isTuesday: false,
    totalAmt: 0,
    getQuantityFromElement,
  });
  const manual = createManual();
  const manualToggle = createManualToggle();

  // 컴포넌트 조립
  leftColumn.appendChild(productSelector);
  leftColumn.appendChild(cartDisplay);
  rightColumn.appendChild(orderSummary);
  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manual);

  // 리스너 등록
  manualToggle.setupEventListeners();
  manual.setupEventListeners();
  productSelector.setupEventListeners();
  cartDisplay.setupEventListeners();

  // 세일 알림
  startLightningSale();
  startSuggestSale();
}

main();
