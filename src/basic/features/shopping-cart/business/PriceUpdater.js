/**
 * Price Update Feature
 * Handles price updates and sale displays in cart items
 */

export class PriceUpdater {
  constructor() {
    this.cartDisplayElement = null;
    this.productList = [];
    this.onCalculate = null;
  }

  /**
   * Update prices in cart based on sales and discounts
   * @param {HTMLElement} cartDisplayElement - Cart display container
   * @param {Array} productList - Product list
   * @param {Function} onCalculate - Callback for recalculation
   */
  updatePricesInCart(cartDisplayElement, productList, onCalculate) {
    this.cartDisplayElement = cartDisplayElement;
    this.productList = productList;
    this.onCalculate = onCalculate;

    if (!this.cartDisplayElement || !this.cartDisplayElement.children) {
      return;
    }

    const cartItems = Array.from(this.cartDisplayElement.children);

    // Update each cart item's price display
    cartItems.forEach((cartItem) => {
      this.updateCartItemPrice(cartItem);
    });

    // Trigger recalculation
    if (this.onCalculate) {
      this.onCalculate();
    }
  }

  /**
   * Update individual cart item price display
   * @param {HTMLElement} cartItem - Cart item element
   */
  updateCartItemPrice(cartItem) {
    const itemId = cartItem.id;
    const product = this.findProductById(itemId);

    if (!product) return;

    const priceDiv = cartItem.querySelector(".text-lg");
    const nameDiv = cartItem.querySelector("h3");

    if (!priceDiv || !nameDiv) return;

    // Update price display based on sale status
    this.updatePriceDisplay(priceDiv, product);

    // Update name with sale indicators
    this.updateNameDisplay(nameDiv, product);
  }

  /**
   * Update price display with sale formatting
   * @param {HTMLElement} priceDiv - Price display element
   * @param {Object} product - Product data
   */
  updatePriceDisplay(priceDiv, product) {
    if (product.onSale && product.suggestSale) {
      // Both flash sale and suggest sale
      priceDiv.innerHTML =
        `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> ` +
        `<span class="text-purple-600">₩${product.val.toLocaleString()}</span>`;
    } else if (product.onSale) {
      // Flash sale only
      priceDiv.innerHTML =
        `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> ` +
        `<span class="text-red-500">₩${product.val.toLocaleString()}</span>`;
    } else if (product.suggestSale) {
      // Suggest sale only
      priceDiv.innerHTML =
        `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> ` +
        `<span class="text-blue-500">₩${product.val.toLocaleString()}</span>`;
    } else {
      // Regular price
      priceDiv.textContent = `₩${product.val.toLocaleString()}`;
    }
  }

  /**
   * Update name display with sale indicators
   * @param {HTMLElement} nameDiv - Name display element
   * @param {Object} product - Product data
   */
  updateNameDisplay(nameDiv, product) {
    let displayName = product.name;

    if (product.onSale && product.suggestSale) {
      displayName = `⚡💝${product.name}`;
    } else if (product.onSale) {
      displayName = `⚡${product.name}`;
    } else if (product.suggestSale) {
      displayName = `💝${product.name}`;
    }

    nameDiv.textContent = displayName;
  }

  /**
   * Apply flash sale to a product
   * @param {string} productId - Product ID
   * @param {number} discountRate - Discount rate (0-1)
   * @returns {boolean} Whether sale was applied successfully
   */
  applyFlashSale(productId, discountRate) {
    const product = this.findProductById(productId);

    if (!product || product.q <= 0 || product.onSale) {
      return false;
    }

    const saleRate = 1 - discountRate;
    product.val = Math.round(product.originalVal * saleRate);
    product.onSale = true;

    return true;
  }

  /**
   * Apply suggest sale to a product
   * @param {string} productId - Product ID
   * @param {number} discountRate - Discount rate (0-1)
   * @returns {boolean} Whether sale was applied successfully
   */
  applySuggestSale(productId, discountRate) {
    const product = this.findProductById(productId);

    if (!product || product.q <= 0 || product.suggestSale) {
      return false;
    }

    const saleRate = 1 - discountRate;
    product.val = Math.round(product.val * saleRate);
    product.suggestSale = true;

    return true;
  }

  /**
   * Reset all sales on products
   */
  resetAllSales() {
    this.productList.forEach((product) => {
      product.val = product.originalVal;
      product.onSale = false;
      product.suggestSale = false;
    });
  }

  /**
   * Get current sale status
   * @returns {Object} Sale status information
   */
  getSaleStatus() {
    const flashSaleProducts = this.productList.filter((p) => p.onSale);
    const suggestSaleProducts = this.productList.filter((p) => p.suggestSale);
    const comboSaleProducts = this.productList.filter(
      (p) => p.onSale && p.suggestSale
    );

    return {
      flashSaleProducts,
      suggestSaleProducts,
      comboSaleProducts,
      totalSaleProducts: flashSaleProducts.length + suggestSaleProducts.length,
    };
  }

  findProductById(productId) {
    return this.productList.find((p) => p.id === productId);
  }
}

export default PriceUpdater;
