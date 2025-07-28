import { formatPrice } from '../utils/format.js';

export function createPriceDisplay(targetElement, product) {
  if (!targetElement) return;

  const container = document.createElement('span');

  if (product.onSale && product.suggestSale) {
    container.innerHTML = `<span class="line-through text-gray-400">${formatPrice(product.originalVal)}</span> <span class="text-purple-600">${formatPrice(product.val)}</span>`;
  } else if (product.onSale) {
    container.innerHTML = `<span class="line-through text-gray-400">${formatPrice(product.originalVal)}</span> <span class="text-red-500">${formatPrice(product.val)}</span>`;
  } else if (product.suggestSale) {
    container.innerHTML = `<span class="line-through text-gray-400">${formatPrice(product.originalVal)}</span> <span class="text-blue-500">${formatPrice(product.val)}</span>`;
  } else {
    container.textContent = formatPrice(product.val);
  }

  targetElement.innerHTML = '';
  targetElement.appendChild(container);
}
