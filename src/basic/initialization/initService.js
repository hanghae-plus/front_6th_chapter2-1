import { ShoppingCartHeader } from "../components/ShoppingCartHeader.js";
import { ProductDropdown } from "../components/ProductDropdown.js";
import { AddButton } from "../components/AddButton.js";
import { StockStatusDisplay } from "../components/StockStatusDisplay.js";
import { MainGrid } from "../components/MainGrid.js";
import { ProductPanel } from "../components/ProductPanel.js";
import { ProductSelector } from "../components/ProductSelector.js";
import { CartContainer } from "../components/CartContainer.js";
import { OrderSummary } from "../components/OrderSummary.js";
import { HelpButton } from "../components/HelpButton.js";
import { HelpModal } from "../components/HelpModal.js";
import { HelpPanel } from "../components/HelpPanel.js";
import { initializeProductData } from "../domains/product.js";
import {
  handleHelpToggle,
  handleHelpOverlayClick,
} from "../services/event/eventService.js";

// 상품 데이터 초기화
export function initializeAppData(appState) {
  appState.totalAmt = 0;
  appState.itemCnt = 0;
  appState.lastSel = null;
  appState.prodList = initializeProductData();
}

// DOM 구조 생성
export function createDOMStructure(domElements) {
  const root = document.getElementById("app");
  const header = ShoppingCartHeader();

  // 상품 선택 요소들
  domElements.sel = ProductDropdown();
  domElements.addBtn = AddButton();
  domElements.stockInfo = StockStatusDisplay();

  // 레이아웃 요소들
  const gridContainer = MainGrid();
  const leftColumn = ProductPanel();
  const selectorContainer = ProductSelector();

  // 요소들 조립
  selectorContainer.appendChild(domElements.sel);
  selectorContainer.appendChild(domElements.addBtn);
  selectorContainer.appendChild(domElements.stockInfo);
  leftColumn.appendChild(selectorContainer);

  domElements.cartDisp = CartContainer();
  leftColumn.appendChild(domElements.cartDisp);

  // 우측 요약 패널
  const rightColumn = OrderSummary();
  domElements.sum = rightColumn.querySelector("#cart-total");

  // 도움말 모달
  const manualToggle = HelpButton(handleHelpToggle);
  const manualOverlay = HelpModal(handleHelpOverlayClick);
  const manualColumn = HelpPanel();

  // DOM 트리 구성
  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  manualOverlay.appendChild(manualColumn);

  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);
}
