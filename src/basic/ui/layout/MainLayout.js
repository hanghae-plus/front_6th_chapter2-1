import { Header } from '../components/Header.js';
import { ProductSelector } from '../components/ProductSelector.js';
import { CartDisplay } from '../components/CartDisplay.js';
import { OrderSummary } from '../components/OrderSummary.js';
import { ManualToggle, ManualOverlay } from '../components/ManualOverlay.js';

export const MainLayout = ({
  itemCount = 0,
  products = [],
  stockStatus = '',
  cartItems = [],
  cartTotal = 0,
  loyaltyPoints = 0,
  discountInfo = '',
  isTuesday = false,
} = {}) => {
  return /* HTML */ `
    ${Header({ itemCount })}
    <div
      class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden"
    >
      <div class="bg-white border border-gray-200 p-8 overflow-y-auto">
        ${ProductSelector({ products, stockStatus })}
        ${CartDisplay({ cartItems })}
      </div>
      ${OrderSummary({ cartTotal, loyaltyPoints, discountInfo, isTuesday })}
    </div>
    ${ManualToggle()} ${ManualOverlay()}
  `;
};

export const createMainLayout = (props = {}) => {
  const root = document.getElementById('app');
  root.innerHTML = MainLayout(props);

  // DOM 요소들을 참조하여 반환 (이벤트 핸들러에서 사용)
  return {
    root,
    productSelector: {
      container: document.querySelector('#product-select').parentElement,
      selector: document.getElementById('product-select'),
      addButton: document.getElementById('add-to-cart'),
      statusDisplay: document.getElementById('stock-status'),
    },
    cartDisplay: {
      container: document.getElementById('cart-items'),
    },
    orderSummary: {
      container: document.querySelector('.bg-black'),
    },
    manualOverlay: {
      toggle: document.getElementById('manual-toggle'),
      overlay: document.getElementById('manual-overlay'),
      column: document.getElementById('manual-column'),
    },
  };
};
