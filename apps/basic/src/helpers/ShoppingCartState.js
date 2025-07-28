import { getProductList } from '../constants/Products.js';
import { STOCK_CONSTANTS } from '../constants/UIConstants.js';
import { StockCalculator } from './StockCalculator.js';

export class ShoppingCartState {
  constructor() {
    this.availableProducts = [];
    this.cartTotalAmount = 0;
    this.totalItemCount = 0;
    this.earnedLoyaltyPoints = 0;
    this.lastSelectedProduct = null;
  }

  initializeAvailableProducts() {
    this.availableProducts = getProductList().map(product => ({
      id: product.id,
      name: product.name,
      val: product.price,
      originalVal: product.price,
      q: product.stock,
      onSale: false,
      suggestSale: false
    }));
  }

  getProductById(productId) {
    return this.availableProducts.find(product => product.id === productId);
  }

  getTotalAvailableStock() {
    const stockSummary = StockCalculator.getStockSummary(
      this.availableProducts
    );
    return stockSummary.totalStock;
  }

  getLowStockProductNames() {
    return this.availableProducts
      .filter(
        product =>
          product.q < STOCK_CONSTANTS.LOW_STOCK_THRESHOLD &&
          product.q > STOCK_CONSTANTS.OUT_OF_STOCK_QUANTITY
      )
      .map(product => product.name);
  }
}
