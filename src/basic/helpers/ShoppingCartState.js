import { getProductList } from '../constants/Products.js';
import { StockCalculator } from './StockCalculator.js';

export class ShoppingCartState {
  constructor() {
    this.productList = [];
    this.totalAmount = 0;
    this.itemCount = 0;
    this.bonusPoints = 0;
    this.lastSelectedProduct = null;
  }

  initializeProducts() {
    this.productList = getProductList().map(product => ({
      id: product.id,
      name: product.name,
      val: product.price,
      originalVal: product.price,
      q: product.stock,
      onSale: false,
      suggestSale: false,
    }));
  }

  getProduct(id) {
    return this.productList.find(product => product.id === id);
  }

  getTotalStock() {
    const stockSummary = StockCalculator.getStockSummary(this.productList);
    return stockSummary.totalStock;
  }

  getLowStockItems() {
    return this.productList
      .filter(product => product.q < 5 && product.q > 0)
      .map(product => product.name);
  }
}
