// components/ProductContainer.ts
import { createElement } from '../utils/dom.js';

export function ProductContainer(): HTMLElement {
  const container = createElement('div', 'mb-6 pb-6 border-b border-gray-200');

  const select = createElement(
    'select',
    'w-full p-3 border border-gray-300 rounded-lg text-base mb-3',
  );
  select.id = 'product-select';

  const addButton = createElement(
    'button',
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all',
  );
  addButton.id = 'add-to-cart';
  addButton.textContent = 'Add to Cart';

  const stockInfo = createElement(
    'div',
    'text-xs text-red-500 mt-3 whitespace-pre-line',
  );
  stockInfo.id = 'stock-status';

  container.appendChild(select);
  container.appendChild(addButton);
  container.appendChild(stockInfo);

  return container;
}