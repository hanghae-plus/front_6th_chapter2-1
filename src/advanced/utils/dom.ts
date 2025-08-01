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
  // React에서는 더 이상 사용하지 않지만 호환성을 위해 유지
  // 빈 객체를 반환하여 오류 방지
  return {
    productSelect: document.createElement('select') as HTMLSelectElement,
    addButton: document.createElement('button') as HTMLButtonElement,
    cartItems: document.createElement('div') as HTMLElement,
    cartTotal: document.createElement('div') as HTMLElement,
    stockInfo: document.createElement('div') as HTMLElement,
    itemCount: document.createElement('div') as HTMLElement,
    loyaltyPoints: document.createElement('div') as HTMLElement,
    discountInfo: document.createElement('div') as HTMLElement,
    tuesdaySpecial: document.createElement('div') as HTMLElement,
    summaryDetails: document.createElement('div') as HTMLElement,
  };
}