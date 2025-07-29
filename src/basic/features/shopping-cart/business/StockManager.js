/**
 * Stock Management Feature
 * Handles stock information and product selector updates
 */

export class StockManager {
  constructor(constants = {}) {
    this.productList = [];
    this.stockInfoElement = null;
    this.productSelector = null;
    this.constants = constants;
  }

  /**
   * Update stock information and product selector
   * @param {Array} products - Product list
   * @param {HTMLElement} stockInfoElement - Stock info display element
   * @param {HTMLElement} productSelector - Product selector element
   * @param {string} lastSelectedProductId - Last selected product ID
   */
  updateStockInfo(
    products,
    stockInfoElement,
    productSelector,
    lastSelectedProductId,
    constants = null
  ) {
    this.productList = products;
    this.stockInfoElement = stockInfoElement;
    this.productSelector = productSelector;

    // Update constants if provided
    if (constants) {
      this.constants = constants;
    }

    // Update ProductSelector with new products data
    this.updateProductSelector(lastSelectedProductId);

    // Update stock information display
    this.updateStockDisplay();

    return this.getStockStatus();
  }

  updateProductSelector(lastSelectedProductId) {
    if (this.productSelector && this.productSelector.updateProducts) {
      this.productSelector.updateProducts(
        this.productList,
        lastSelectedProductId
      );
    }
  }

  updateStockDisplay() {
    if (!this.stockInfoElement) return;

    const totalStock = this.getTotalStock();
    console.log("DEBUG: totalStock", totalStock, "constants", this.constants);
    const isLowStock =
      totalStock < this.constants.STOCK.STOCK_WARNING_THRESHOLD;

    console.log("DEBUG: isLowStock", isLowStock);
    if (isLowStock) {
      const stockMessage = this.generateStockMessage();
      console.log("DEBUG: stockMessage", stockMessage);
      this.stockInfoElement.textContent = stockMessage;
    } else {
      this.stockInfoElement.textContent = "";
    }
  }

  generateStockMessage() {
    // Debug: Check if constants exist
    if (!this.constants || !this.constants.STOCK) {
      console.error("StockManager: constants.STOCK not found");
      return "";
    }

    const lowStockItems = this.productList
      .filter((p) => p.q < this.constants.STOCK.LOW_STOCK_THRESHOLD && p.q > 0)
      .map((p) => `${p.name}: ${p.q}개 남음`)
      .join("\n");

    const outOfStockItems = this.productList
      .filter((p) => p.q === 0)
      .map((p) => `${p.name}: 품절`)
      .join("\n");

    return [lowStockItems, outOfStockItems].filter(Boolean).join("\n");
  }

  getTotalStock() {
    return this.productList.reduce((sum, p) => sum + p.q, 0);
  }

  getStockStatus() {
    const totalStock = this.getTotalStock();
    const isLowStock =
      totalStock < this.constants.STOCK.STOCK_WARNING_THRESHOLD;

    const lowStockProducts = this.productList.filter(
      (p) => p.q < this.constants.STOCK.LOW_STOCK_THRESHOLD && p.q > 0
    );

    const outOfStockProducts = this.productList.filter((p) => p.q === 0);

    return {
      totalStock,
      isLowStock,
      lowStockProducts,
      outOfStockProducts,
    };
  }

  /**
   * Check if product has sufficient stock
   * @param {string} productId - Product ID
   * @param {number} requestedQuantity - Requested quantity
   * @returns {boolean} Whether stock is sufficient
   */
  checkStock(productId, requestedQuantity = 1) {
    const product = this.productList.find((p) => p.id === productId);
    return product ? product.q >= requestedQuantity : false;
  }

  /**
   * Update product stock
   * @param {string} productId - Product ID
   * @param {number} quantityChange - Quantity change (positive or negative)
   * @returns {boolean} Whether update was successful
   */
  updateProductStock(productId, quantityChange) {
    const product = this.productList.find((p) => p.id === productId);

    if (!product) return false;

    const newQuantity = product.q + quantityChange;

    if (newQuantity < 0) return false;

    product.q = newQuantity;
    return true;
  }

  /**
   * Get low stock alert message
   * @returns {string} Alert message for low stock items
   */
  getLowStockAlert() {
    const lowStockItems = this.productList
      .filter((p) => p.q < this.constants.STOCK.LOW_STOCK_THRESHOLD)
      .map((p) => {
        if (p.q === 0) {
          return `${p.name}: 품절`;
        } else {
          return `${p.name}: 재고 부족 (${p.q}개 남음)`;
        }
      });

    return lowStockItems.length > 0 ? lowStockItems.join("\n") : "";
  }
}

export default StockManager;
