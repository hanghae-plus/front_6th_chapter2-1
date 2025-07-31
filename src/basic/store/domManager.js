class DOMManager {
  constructor() {
    this.elements = {
      stockStatus: null,
      productSelect: null,
      addToCartButton: null,
      cartItemsContainer: null,
    };
  }

  initialize() {
    this.elements = {
      stockStatus: document.querySelector('#stock-status'),
      productSelect: document.querySelector('#product-select'),
      addToCartButton: document.querySelector('#add-to-cart'),
      cartItemsContainer: document.querySelector('#cart-items'),
    };
  }

  getElement(name) {
    return this.elements[name];
  }

  getAllElements() {
    return this.elements;
  }
}

export default DOMManager;
