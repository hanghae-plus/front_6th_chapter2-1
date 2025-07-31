// utils/dom.js

export function createElement(tag, className, innerHTML) {
  const element = document.createElement(tag)
  if (className) element.className = className
  if (innerHTML) element.innerHTML = innerHTML
  return element
}

export function showElement(element) {
  if (element) element.classList.remove('hidden')
}

export function hideElement(element) {
  if (element) element.classList.add('hidden')
}

export function toggleElement(element) {
  if (element) element.classList.toggle('hidden')
}

export function initializeDOMElements() {
  return {
    productSelect: document.getElementById('product-select'),
    addButton: document.getElementById('add-to-cart'),
    cartItems: document.getElementById('cart-items'),
    cartTotal: document.getElementById('cart-total'),
    stockInfo: document.getElementById('stock-status'),
    itemCount: document.getElementById('item-count'),
    loyaltyPoints: document.getElementById('loyalty-points'),
    discountInfo: document.getElementById('discount-info'),
    tuesdaySpecial: document.getElementById('tuesday-special'),
    summaryDetails: document.getElementById('summary-details'),
  }
}
