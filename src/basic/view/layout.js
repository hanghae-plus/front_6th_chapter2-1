import {
  createAddCartButton,
  createCartDisplay,
  createGridContainer,
  createHeader,
  createLeftColumn,
  createManualColumn,
  createManualOverlay,
  createManualToggle,
  createProductSelector,
  createRightColumn,
  createSelectorContainer,
  createStockInfo,
} from './elements';

/** 레이아웃을 그립니다. */
export const renderLayout = () => {
  const root = document.getElementById('app');

  const header = createHeader();

  const gridContainer = createGridContainer();
  const leftColumn = createLeftColumn();
  const rightColumn = createRightColumn();

  const selectorContainer = createSelectorContainer();
  const productSelector = createProductSelector();
  const addCartButton = createAddCartButton();
  const stockInfo = createStockInfo();

  const cartDisplay = createCartDisplay();
  const cartSummary = rightColumn.querySelector('#cart-total');

  const manualToggle = createManualToggle();
  const manualOverlay = createManualOverlay();
  const manualColumn = createManualColumn();
  bindManualToggle({ toggleButton: manualToggle, overlay: manualOverlay, column: manualColumn });

  selectorContainer.appendChild(productSelector);
  selectorContainer.appendChild(addCartButton);
  selectorContainer.appendChild(stockInfo);

  leftColumn.appendChild(selectorContainer);
  leftColumn.appendChild(cartDisplay);

  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);

  manualOverlay.appendChild(manualColumn);

  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);

  return {
    productSelector,
    addCartButton,
    stockInfo,
    cartDisplay,
    cartSummary,
  };
};

export function bindManualToggle({ toggleButton, overlay, column }) {
  toggleButton.onclick = () => {
    overlay.classList.toggle('hidden');
    column.classList.toggle('translate-x-full');
  };

  overlay.onclick = (e) => {
    if (e.target === overlay) {
      overlay.classList.add('hidden');
      column.classList.add('translate-x-full');
    }
  };
}
