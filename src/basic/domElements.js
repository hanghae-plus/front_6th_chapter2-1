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
