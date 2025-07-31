// components/LeftColumn.ts
import { createElement } from '../utils/dom.js';
import { ProductContainer } from './ProductContainer.js';

export function LeftColumn(): HTMLElement {
  const column = createElement(
    'div',
    'bg-white border border-gray-200 p-8 overflow-y-auto',
  );

  const container = ProductContainer();
  column.appendChild(container);

  const cart = createElement('div');
  cart.id = 'cart-items';
  column.appendChild(cart);

  return column;
}