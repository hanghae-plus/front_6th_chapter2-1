// App 컴포넌트 - 모든 컴포넌트를 조합하는 최종 컴포넌트
import { createHeader } from './Header.js';
import { createProductSelector } from './ProductSelector.js';
import { createCartDisplay } from './CartDisplay.js';
import { createOrderSummary } from './OrderSummary.js';
import { createHelpModal } from './HelpModal.js';
import { createLayout } from './Layout.js';

export function createApp() {
  const root = document.getElementById('app');

  // 각 컴포넌트 생성
  const header = createHeader();
  const productSelector = createProductSelector();
  const cartDisplay = createCartDisplay();
  const orderSummary = createOrderSummary();
  const helpModal = createHelpModal();
  const layout = createLayout();

  // 레이아웃 구성
  layout.leftColumn.appendChild(productSelector.container);
  layout.leftColumn.appendChild(cartDisplay);
  layout.container.appendChild(layout.leftColumn);
  layout.container.appendChild(orderSummary);

  // DOM에 추가
  root.appendChild(header);
  root.appendChild(layout.container);
  root.appendChild(helpModal.toggle);
  root.appendChild(helpModal.overlay);

  return {
    root,
    header,
    productSelector,
    cartDisplay,
    orderSummary,
    helpModal,
    layout,
  };
}
