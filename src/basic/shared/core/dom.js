import {
  Header,
  MainGrid,
  LeftColumn,
  HelpToggleButton,
  HelpManualOverlay,
} from '../components/index.js';
import {
  ProductPanel,
  ProductSelect,
  AddToCartButton,
  StockInfo,
} from '../../features/product/components/index.js';
import {
  CartContainer,
  OrderSummary,
} from '../../features/cart/components/index.js';
import { initializeDOMReferences } from './dom-refs.js';

// 전체 DOM 구조 생성
export function createDOMStructure() {
  const root = document.getElementById('app');

  // 컴포넌트 생성
  const header = Header();
  const mainGrid = MainGrid();
  const leftColumn = LeftColumn();
  const productPanel = ProductPanel();
  const productSelect = ProductSelect();
  const addToCartButton = AddToCartButton();
  const stockInfo = StockInfo();
  const cartContainer = CartContainer();
  const rightColumn = OrderSummary();
  const helpToggle = HelpToggleButton();
  const { overlay: helpOverlay } = HelpManualOverlay();

  // ProductPanel에 하위 컴포넌트들 조립
  productPanel.appendChild(productSelect);
  productPanel.appendChild(addToCartButton);
  productPanel.appendChild(stockInfo);

  // LeftColumn에 조립
  leftColumn.appendChild(productPanel);
  leftColumn.appendChild(cartContainer);

  // MainGrid에 조립
  mainGrid.appendChild(leftColumn);
  mainGrid.appendChild(rightColumn);

  // 루트에 컴포넌트 조립
  root.appendChild(header);
  root.appendChild(mainGrid);
  root.appendChild(helpToggle);
  root.appendChild(helpOverlay);

  // DOM 요소 참조 설정
  initializeDOMReferences();
}
