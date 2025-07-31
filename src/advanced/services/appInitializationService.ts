// ==========================================
// 애플리케이션 초기화 서비스 (TypeScript)
// ==========================================

import type { DOMElements } from '../types';

/**
 * DOM 요소 캐시 초기화
 */
export function initializeDomElements(): DOMElements {
  return {
    loyaltyPoints: document.getElementById('loyalty-points'),
    summaryDetails: document.getElementById('summary-details'),
    tuesdaySpecial: document.getElementById('tuesday-special'),
    discountInfo: document.getElementById('discount-info'),
  };
}

/**
 * 레이아웃 구성에 필요한 타입들
 */
interface LayoutComponents {
  root: HTMLElement;
  gridContainer: HTMLElement;
  leftColumn: HTMLElement;
  selectorContainer: HTMLElement;
}

interface ProductSelectorComponents {
  productSelect: HTMLSelectElement;
  addButton: HTMLButtonElement;
  stockInfo: HTMLElement;
}

interface CartDisplayComponents {
  cartDisplay: HTMLElement;
}

interface HelpModalComponents {
  manualToggle: HTMLElement;
  manualOverlay: HTMLElement;
}

interface SetupLayoutResult extends LayoutComponents, ProductSelectorComponents, CartDisplayComponents, HelpModalComponents {}

/**
 * 레이아웃 구성
 */
export function setupLayout(
  layout: LayoutComponents,
  productSelector: ProductSelectorComponents,
  cartDisplay: CartDisplayComponents,
  orderSummary: HTMLElement,
  helpModal: HelpModalComponents,
): SetupLayoutResult {
  const { root, gridContainer, leftColumn, selectorContainer } = layout;
  const { productSelect, addButton, stockInfo } = productSelector;
  const { cartDisplay: cartDisplayElement } = cartDisplay;
  const { manualToggle, manualOverlay } = helpModal;

  // 상품 선택 영역 구성
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';
  selectorContainer.appendChild(productSelect);
  selectorContainer.appendChild(addButton);
  selectorContainer.appendChild(stockInfo);

  // 좌측 컬럼 구성
  leftColumn.className = 'bg-white border border-gray-200 p-8 overflow-y-auto';
  leftColumn.appendChild(selectorContainer);
  leftColumn.appendChild(cartDisplayElement);

  // 메인 그리드 구성
  gridContainer.className =
    'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';
  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(orderSummary);

  // DOM 요소 연결
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);

  return {
    root,
    gridContainer,
    leftColumn,
    selectorContainer,
    productSelect,
    addButton,
    stockInfo,
    cartDisplay: cartDisplayElement,
    manualToggle,
    manualOverlay,
  };
}