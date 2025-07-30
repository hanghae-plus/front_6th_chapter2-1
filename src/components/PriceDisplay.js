import { formatPrice } from '../utils/format.js';

export function createPriceDisplay(targetElement, product) {
  if (!targetElement) return;

  const container = document.createElement('span');

  if (product.isLightningSale && product.isSuggestSale) {
    container.innerHTML = `<span class="line-through text-gray-400">${formatPrice(product.originalPrice)}</span> <span class="text-purple-600">${formatPrice(product.price)}</span>`;
  } else if (product.isLightningSale) {
    container.innerHTML = `<span class="line-through text-gray-400">${formatPrice(product.originalPrice)}</span> <span class="text-red-500">${formatPrice(product.price)}</span>`;
  } else if (product.isSuggestSale) {
    container.innerHTML = `<span class="line-through text-gray-400">${formatPrice(product.originalPrice)}</span> <span class="text-blue-500">${formatPrice(product.price)}</span>`;
  } else {
    container.textContent = formatPrice(product.price);
  }

  targetElement.innerHTML = '';
  targetElement.appendChild(container);
}
