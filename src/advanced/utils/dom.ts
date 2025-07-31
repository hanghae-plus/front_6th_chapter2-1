// utils/dom.ts
import type { Elements } from '../types/index.js';

export function createElement(tag: string, className?: string, innerHTML?: string): HTMLElement {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (innerHTML) element.innerHTML = innerHTML;
  return element;
}

export function showElement(element: HTMLElement): void {
  if (element) element.classList.remove('hidden');
}

export function hideElement(element: HTMLElement): void {
  if (element) element.classList.add('hidden');
}

export function toggleElement(element: HTMLElement): void {
  if (element) element.classList.toggle('hidden');
}

export function initializeDOMElements(): Elements {
  return {
    productSelect: document.getElementById('product-select') as HTMLSelectElement,
    addButton: document.getElementById('add-to-cart') as HTMLButtonElement,
    cartItems: document.getElementById('cart-items') as HTMLElement,
    cartTotal: document.getElementById('cart-total') as HTMLElement,
    stockInfo: document.getElementById('stock-status') as HTMLElement,
    itemCount: document.getElementById('item-count') as HTMLElement,
    loyaltyPoints: document.getElementById('loyalty-points') as HTMLElement,
    discountInfo: document.getElementById('discount-info') as HTMLElement,
    tuesdaySpecial: document.getElementById('tuesday-special') as HTMLElement,
    summaryDetails: document.getElementById('summary-details') as HTMLElement,
  };
}