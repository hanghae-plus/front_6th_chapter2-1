/**
 * Product Store - Local State Management
 * Manages product-related state for individual components
 */

class ProductStore {
  constructor() {
    this.point = 0;
    this.amount = 0;
    this.itemCount = 0;
    this.lastSelectedProduct = null;
    this.products = [];
  }

  static createInstance() {
    return new ProductStore();
  }

  // Points management
  getPoint() {
    return this.point;
  }

  setPoint(value) {
    this.point = value;
  }

  // Amount management
  getAmount() {
    return this.amount;
  }

  setAmount(value) {
    this.amount = value;
  }

  // Item count management
  getItemCount() {
    return this.itemCount;
  }

  setItemCount(value) {
    this.itemCount = value;
  }

  // Last selected product management
  getLastSelectedProduct() {
    return this.lastSelectedProduct;
  }

  setLastSelectedProduct(value) {
    this.lastSelectedProduct = value;
  }

  // Products management
  getProducts() {
    return this.products;
  }

  setProducts(value) {
    this.products = value;
  }

  updateProduct(productId, updates) {
    this.products = this.products.map((product) =>
      product.id === productId ? { ...product, ...updates } : product
    );
  }

  // Batch updates for performance
  updateState(updates) {
    Object.keys(updates).forEach((key) => {
      if (this.hasOwnProperty(key)) {
        this[key] = updates[key];
      }
    });
  }

  // Cleanup
  destroyInstance() {
    this.point = 0;
    this.amount = 0;
    this.itemCount = 0;
    this.lastSelectedProduct = null;
    this.products = [];
  }
}

// Utility function for product state updates
export const updateProductState = (productStore, totals) => {
  productStore.setAmount(totals.finalAmount);
  productStore.setItemCount(totals.totalItemCount);
  productStore.setPoint(totals.point);

  return totals;
};

export default ProductStore;
