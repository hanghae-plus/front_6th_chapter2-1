import {
  PRODUCT_IDS,
  PRODUCT_NAMES,
  PRODUCT_PRICES,
  INITIAL_STOCK,
  DISCOUNT_THRESHOLDS,
  DISCOUNT_RATES,
} from '../constants/index.js';

export const productStore = {
  products: [],
  selectedProductId: null,
  lowStockProducts: [],
  outOfStockProducts: [],
  totalStock: 0,
};

export const productStoreActions = {
  getProducts() {
    return productStore.products;
  },

  getProductById(productId) {
    return productStore.products.find((product) => product.id === productId);
  },

  setProducts(products) {
    productStore.products = products.map((product) => ({
      ...product,
      originalQuantity: product.quantity,
      originalPrice: product.price,
    }));
    this.updateDerivedState();
  },

  initializeProducts() {
    const products = [
      {
        id: PRODUCT_IDS.KEYBOARD,
        name: PRODUCT_NAMES[PRODUCT_IDS.KEYBOARD],
        price: PRODUCT_PRICES[PRODUCT_IDS.KEYBOARD],
        originalPrice: PRODUCT_PRICES[PRODUCT_IDS.KEYBOARD],
        quantity: INITIAL_STOCK[PRODUCT_IDS.KEYBOARD],
        onSale: false,
        suggestSale: false,
      },
      {
        id: PRODUCT_IDS.MOUSE,
        name: PRODUCT_NAMES[PRODUCT_IDS.MOUSE],
        price: PRODUCT_PRICES[PRODUCT_IDS.MOUSE],
        originalPrice: PRODUCT_PRICES[PRODUCT_IDS.MOUSE],
        quantity: INITIAL_STOCK[PRODUCT_IDS.MOUSE],
        onSale: false,
        suggestSale: false,
      },
      {
        id: PRODUCT_IDS.MONITOR_ARM,
        name: PRODUCT_NAMES[PRODUCT_IDS.MONITOR_ARM],
        price: PRODUCT_PRICES[PRODUCT_IDS.MONITOR_ARM],
        originalPrice: PRODUCT_PRICES[PRODUCT_IDS.MONITOR_ARM],
        quantity: INITIAL_STOCK[PRODUCT_IDS.MONITOR_ARM],
        onSale: false,
        suggestSale: false,
      },
      {
        id: PRODUCT_IDS.LAPTOP_CASE,
        name: PRODUCT_NAMES[PRODUCT_IDS.LAPTOP_CASE],
        price: PRODUCT_PRICES[PRODUCT_IDS.LAPTOP_CASE],
        originalPrice: PRODUCT_PRICES[PRODUCT_IDS.LAPTOP_CASE],
        quantity: INITIAL_STOCK[PRODUCT_IDS.LAPTOP_CASE],
        onSale: false,
        suggestSale: false,
      },
      {
        id: PRODUCT_IDS.SPEAKER,
        name: PRODUCT_NAMES[PRODUCT_IDS.SPEAKER],
        price: PRODUCT_PRICES[PRODUCT_IDS.SPEAKER],
        originalPrice: PRODUCT_PRICES[PRODUCT_IDS.SPEAKER],
        quantity: INITIAL_STOCK[PRODUCT_IDS.SPEAKER],
        onSale: false,
        suggestSale: false,
      },
    ];

    this.setProducts(products);
  },

  decreaseStock(productId, quantity = 1) {
    const product = this.getProductById(productId);
    if (!product || product.quantity < quantity) return false;

    productStore.products = productStore.products.map((p) =>
      p.id === productId ? { ...p, quantity: p.quantity - quantity } : p,
    );

    this.updateDerivedState();
    return true;
  },

  increaseStock(productId, quantity = 1) {
    const product = this.getProductById(productId);
    if (!product) return false;

    productStore.products = productStore.products.map((p) =>
      p.id === productId ? { ...p, quantity: p.quantity + quantity } : p,
    );

    this.updateDerivedState();
    return true;
  },

  applySale(productId, discountRate) {
    const product = this.getProductById(productId);
    if (!product) return false;

    productStore.products = productStore.products.map((p) =>
      p.id === productId
        ? {
            ...p,
            price: Math.round(p.originalPrice * (1 - discountRate)),
            onSale: true,
          }
        : p,
    );

    return true;
  },

  applySuggestSale(productId, discountRate) {
    const product = this.getProductById(productId);
    if (!product) return false;

    productStore.products = productStore.products.map((p) =>
      p.id === productId
        ? {
            ...p,
            price: Math.round(p.price * (1 - discountRate)),
            suggestSale: true,
          }
        : p,
    );

    return true;
  },

  resetSale(productId) {
    const product = this.getProductById(productId);
    if (!product) return false;

    productStore.products = productStore.products.map((p) =>
      p.id === productId
        ? {
            ...p,
            price: p.originalPrice,
            onSale: false,
            suggestSale: false,
          }
        : p,
    );

    return true;
  },

  updateProductPrice(productId, newPrice) {
    const product = this.getProductById(productId);
    if (!product) return false;

    productStore.products = productStore.products.map((p) =>
      p.id === productId ? { ...p, price: newPrice } : p,
    );

    return true;
  },

  updateProductState(productId, updates) {
    const product = this.getProductById(productId);
    if (!product) return false;

    productStore.products = productStore.products.map((p) =>
      p.id === productId ? { ...p, ...updates } : p,
    );

    this.updateDerivedState();
    return true;
  },

  setSelectedProductId(productId) {
    productStore.selectedProductId = productId;
  },

  getSelectedProduct() {
    return this.getProductById(productStore.selectedProductId);
  },

  getLowStockProducts() {
    return productStore.lowStockProducts;
  },

  getOutOfStockProducts() {
    return productStore.outOfStockProducts;
  },

  getTotalStock() {
    return productStore.totalStock;
  },

  calculateItemDiscount(productId, quantity) {
    if (quantity < DISCOUNT_THRESHOLDS.INDIVIDUAL_ITEM) {
      return 0;
    }

    const discountMap = {
      [PRODUCT_IDS.KEYBOARD]: DISCOUNT_RATES.KEYBOARD,
      [PRODUCT_IDS.MOUSE]: DISCOUNT_RATES.MOUSE,
      [PRODUCT_IDS.MONITOR_ARM]: DISCOUNT_RATES.MONITOR_ARM,
      [PRODUCT_IDS.LAPTOP_CASE]: DISCOUNT_RATES.LAPTOP_CASE,
      [PRODUCT_IDS.SPEAKER]: DISCOUNT_RATES.SPEAKER,
    };

    return discountMap[productId] || 0;
  },

  updateDerivedState() {
    // Update low stock products
    productStore.lowStockProducts = productStore.products.filter(
      (product) => product.quantity < DISCOUNT_THRESHOLDS.INDIVIDUAL_ITEM && product.quantity > 0,
    );

    // Update out of stock products
    productStore.outOfStockProducts = productStore.products.filter(
      (product) => product.quantity === 0,
    );

    // Update total stock
    productStore.totalStock = productStore.products.reduce(
      (total, product) => total + product.quantity,
      0,
    );
  },

  reset() {
    productStore.products = productStore.products.map((p) => ({
      ...p,
      quantity: p.originalQuantity,
      price: p.originalPrice,
      onSale: false,
      suggestSale: false,
    }));
    productStore.selectedProductId = null;
    this.updateDerivedState();
  },
};
