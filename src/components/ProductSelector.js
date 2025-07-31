import { createProductOptions } from './ProductOptions.js';
import { handleAddToCart } from '../handlers/cartHandlers.js';

export function createProductSelector() {
  const container = document.createElement('div');
  container.className = 'mb-6 pb-6 border-b border-gray-200';

  const productOptions = createProductOptions();
  const addButton = document.createElement('button');
  addButton.id = 'add-to-cart';
  addButton.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';
  addButton.textContent = 'Add to Cart';

  const stockStatus = document.createElement('div');
  stockStatus.id = 'stock-status';
  stockStatus.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';

  container.appendChild(productOptions);
  container.appendChild(addButton);
  container.appendChild(stockStatus);

  // ProductSelector에 setupEventListeners 메서드 추가
  container.setupEventListeners = function () {
    addButton.addEventListener('click', handleAddToCart);
  };

  return container;
}
