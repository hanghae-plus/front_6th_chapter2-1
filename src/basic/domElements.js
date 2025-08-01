// ============================================
// DOM ELEMENTS ABSTRACTION
// ============================================

// DOM 요소 접근 추상화
export const DOMElements = {
  // 장바구니 관련 요소
  getItemCount() {
    return document.getElementById('item-count');
  },

  getSummaryDetails() {
    return document.getElementById('summary-details');
  },

  getCartTotal() {
    return document.getElementById('cart-total');
  },

  getLoyaltyPoints() {
    return document.getElementById('loyalty-points');
  },

  getDiscountInfo() {
    return document.getElementById('discount-info');
  },

  getTuesdaySpecial() {
    return document.getElementById('tuesday-special');
  },

  // 상품 선택 관련 요소
  getProductSelector() {
    return document.getElementById('product-select');
  },

  getAddButton() {
    return document.getElementById('add-to-cart');
  },

  getCartDisplay() {
    return document.getElementById('cart-items');
  },

  getStockInfo() {
    return document.getElementById('stock-status');
  },

  // 특정 상품 요소
  getCartItem(productId) {
    return document.getElementById(productId);
  },

  getQuantityElement(productId) {
    const item = this.getCartItem(productId);
    return item ? item.querySelector('.quantity-number') : null;
  },

  // 추가 DOM 요소 접근 메서드들
  getCartItemPriceElement(productId) {
    const item = this.getCartItem(productId);
    return item ? item.querySelector('.text-lg') : null;
  },

  getCartItemNameElement(productId) {
    const item = this.getCartItem(productId);
    return item ? item.querySelector('h3') : null;
  },

  getCartItemQuantityElement(productId) {
    const item = this.getCartItem(productId);
    return item ? item.querySelector('.quantity-number') : null;
  },

  getCartItems() {
    const cartDisplay = this.getCartDisplay();
    return cartDisplay ? Array.from(cartDisplay.children || []) : [];
  },

  getCartItemQuantity(productId) {
    const quantityElement = this.getQuantityElement(productId);
    return quantityElement ? parseInt(quantityElement.textContent) : 0;
  },

  getProductSelectorOptions() {
    const selector = this.getProductSelector();
    return selector ? Array.from(selector.options) : [];
  },

  getTotalDiv() {
    const cartTotal = this.getCartTotal();
    return cartTotal ? cartTotal.querySelector('.text-2xl') : null;
  },

  // 모든 DOM 요소를 한 번에 가져오기
  getAllElements() {
    return {
      itemCount: this.getItemCount(),
      summaryDetails: this.getSummaryDetails(),
      cartTotal: this.getCartTotal(),
      loyaltyPoints: this.getLoyaltyPoints(),
      discountInfo: this.getDiscountInfo(),
      tuesdaySpecial: this.getTuesdaySpecial(),
      productSelector: this.getProductSelector(),
      addButton: this.getAddButton(),
      cartDisplay: this.getCartDisplay(),
      stockInfo: this.getStockInfo(),
    };
  },
};

// DOM 요소 존재 여부 확인
export const hasElement = (element) => element !== null && element !== undefined;

// 안전한 DOM 조작을 위한 헬퍼 함수들
export const safeSetTextContent = (element, text) => {
  if (hasElement(element)) {
    element.textContent = text;
  }
};

export const safeSetInnerHTML = (element, html) => {
  if (hasElement(element)) {
    element.innerHTML = html;
  }
};

export const safeAddClass = (element, className) => {
  if (hasElement(element)) {
    element.classList.add(className);
  }
};

export const safeRemoveClass = (element, className) => {
  if (hasElement(element)) {
    element.classList.remove(className);
  }
};

export const safeToggleClass = (element, className, condition) => {
  if (hasElement(element)) {
    if (condition) {
      element.classList.remove(className);
    } else {
      element.classList.add(className);
    }
  }
};

// 추가 DOM 조작 헬퍼 함수들
export const safeAppendChild = (parent, child) => {
  if (hasElement(parent) && hasElement(child)) {
    parent.appendChild(child);
  }
};

export const safeRemoveElement = (element) => {
  if (hasElement(element) && element.parentNode) {
    element.parentNode.removeChild(element);
  }
};

export const safeQuerySelector = (element, selector) => {
  return hasElement(element) ? element.querySelector(selector) : null;
};

export const safeQuerySelectorAll = (element, selector) => {
  return hasElement(element) ? Array.from(element.querySelectorAll(selector)) : [];
};

export const safeGetAttribute = (element, attribute) => {
  return hasElement(element) ? element.getAttribute(attribute) : null;
};

export const safeSetAttribute = (element, attribute, value) => {
  if (hasElement(element)) {
    element.setAttribute(attribute, value);
  }
};

export const safeGetValue = (element) => {
  return hasElement(element) ? element.value : null;
};

export const safeSetValue = (element, value) => {
  if (hasElement(element)) {
    element.value = value;
  }
};

export const safeGetTextContent = (element) => {
  return hasElement(element) ? element.textContent : '';
};

export const safeGetInnerHTML = (element) => {
  return hasElement(element) ? element.innerHTML : '';
};

// 특화된 DOM 조작 함수들
export const safeUpdateQuantity = (productId, newQuantity) => {
  const quantityElement = DOMElements.getQuantityElement(productId);
  safeSetTextContent(quantityElement, newQuantity.toString());
};

export const safeUpdateCartItemPrice = (productId, priceHTML) => {
  const priceElement = DOMElements.getCartItemPriceElement(productId);
  safeSetInnerHTML(priceElement, priceHTML);
};

export const safeUpdateCartItemName = (productId, name) => {
  const nameElement = DOMElements.getCartItemNameElement(productId);
  safeSetTextContent(nameElement, name);
};

export const safeClearProductSelector = () => {
  const selector = DOMElements.getProductSelector();
  safeSetInnerHTML(selector, '');
};

export const safeAddProductOption = (option) => {
  const selector = DOMElements.getProductSelector();
  if (hasElement(selector)) {
    selector.appendChild(option);
  }
};

export const safeUpdateTotalDisplay = (total) => {
  const totalDiv = DOMElements.getTotalDiv();
  safeSetTextContent(totalDiv, `₩${Math.round(total).toLocaleString()}`);
};

export const safeUpdateItemCount = (count) => {
  const itemCount = DOMElements.getItemCount();
  safeSetTextContent(itemCount, `🛍️ ${count} items in cart`);
};

export const safeUpdateStockInfo = (message) => {
  const stockInfo = DOMElements.getStockInfo();
  safeSetTextContent(stockInfo, message);
};

export const safeUpdateLoyaltyPoints = (pointsHTML) => {
  const loyaltyPoints = DOMElements.getLoyaltyPoints();
  safeSetInnerHTML(loyaltyPoints, pointsHTML);
};

export const safeUpdateDiscountInfo = (discountHTML) => {
  const discountInfo = DOMElements.getDiscountInfo();
  safeSetInnerHTML(discountInfo, discountHTML);
};

export const safeUpdateSummaryDetails = (summaryHTML) => {
  const summaryDetails = DOMElements.getSummaryDetails();
  safeSetInnerHTML(summaryDetails, summaryHTML);
};

export const safeToggleTuesdaySpecial = (show) => {
  const tuesdaySpecial = DOMElements.getTuesdaySpecial();
  safeToggleClass(tuesdaySpecial, 'hidden', show);
};
