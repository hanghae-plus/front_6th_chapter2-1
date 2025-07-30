const DOMElements = {};

const cacheDOMElements = () => {
  DOMElements.itemCount = document.getElementById('item-count');
  DOMElements.productSelect = document.getElementById('product-select');
  DOMElements.stockStatus = document.getElementById('stock-status');
  DOMElements.cartItems = document.getElementById('cart-items');
  DOMElements.addToCart = document.getElementById('add-to-cart');

  DOMElements.summaryDetails = document.getElementById('summary-details');
  DOMElements.discountInfo = document.getElementById('discount-info');
  DOMElements.totalAmount = document.querySelector('#cart-total .text-2xl');
  DOMElements.loyaltyPoints = document.getElementById('loyalty-points');
  DOMElements.tuesdaySpecial = document.getElementById('tuesday-special');

  DOMElements.manualToggle = document.getElementById('manual-toggle');
  DOMElements.manualOverlay = document.getElementById('manual-overlay');
  DOMElements.manualColumn = document.getElementById('manual-column');
  DOMElements.manualCloseBtn = document.getElementById('manual-close-btn');
};

export { DOMElements, cacheDOMElements };
