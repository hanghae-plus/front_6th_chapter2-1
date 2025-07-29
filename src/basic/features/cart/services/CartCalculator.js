/**
 * Cart Calculation Feature
 * Handles cart calculations, discounts, and totals
 */

import { calculateItemDiscountRate } from "../utils/discountUtils.js";

export class CartCalculator {
  constructor(constants = {}, products = {}) {
    this.cartItems = [];
    this.productList = [];
    this.subtotal = 0;
    this.totalAmount = 0;
    this.totalItemCount = 0;
    this.itemDiscounts = [];
    this.discountRate = 0;
    this.constants = constants;
    this.products = products;
  }

  /**
   * Calculate cart totals and discounts
   * @param {HTMLCollection} cartElements - DOM cart elements
   * @param {Array} products - Product list
   * @returns {Object} Calculation results
   */
  calculateCart(cartElements, products) {
    this.productList = products;
    this.cartItems = Array.from(cartElements);
    this.reset();

    // Calculate subtotal and item counts
    this.calculateSubtotal();

    // Apply individual item discounts
    this.applyItemDiscounts();

    // Apply bulk and Tuesday discounts
    this.applyGlobalDiscounts();

    // Calculate final discount rate
    this.calculateDiscountRate();

    return this.getResults();
  }

  reset() {
    this.subtotal = 0;
    this.totalAmount = 0;
    this.totalItemCount = 0;
    this.itemDiscounts = [];
    this.discountRate = 0;
  }

  calculateSubtotal() {
    for (let i = 0; i < this.cartItems.length; i++) {
      const cartItem = this.cartItems[i];
      const product = this.findProductById(cartItem.id);

      if (!product) continue;

      const qtyElem = cartItem.querySelector(".quantity-number");
      const quantity = parseInt(qtyElem.textContent);
      const itemTotal = product.val * quantity;

      this.totalItemCount += quantity;
      this.subtotal += itemTotal;

      // Highlight items with quantity discount
      this.highlightDiscountableItems(cartItem, quantity);
    }

    this.totalAmount = this.subtotal;
  }

  applyItemDiscounts() {
    for (let i = 0; i < this.cartItems.length; i++) {
      const cartItem = this.cartItems[i];
      const product = this.findProductById(cartItem.id);

      if (!product) continue;

      const qtyElem = cartItem.querySelector(".quantity-number");
      const quantity = parseInt(qtyElem.textContent);
      const itemTotal = product.val * quantity;

      const discount = this.calculateItemDiscount(product.id, quantity);
      if (discount > 0) {
        this.itemDiscounts.push({
          name: product.name,
          discount: discount * 100,
        });
        this.totalAmount += itemTotal * (1 - discount) - itemTotal;
      }
    }
  }

  applyGlobalDiscounts() {
    const originalTotal = this.subtotal;

    // Bulk discount (30+ items)
    if (
      this.totalItemCount >= this.constants.DISCOUNT.BULK_DISCOUNT_THRESHOLD
    ) {
      this.totalAmount = (this.subtotal * 75) / 100;
    }

    // Tuesday discount
    const isTuesday = new Date().getDay() === 2;
    if (isTuesday && this.totalAmount > 0) {
      this.totalAmount = (this.totalAmount * 90) / 100;
    }
  }

  calculateDiscountRate() {
    this.discountRate =
      this.totalAmount > 0 ? 1 - this.totalAmount / this.subtotal : 0;
  }

  calculateItemDiscount(productId, quantity) {
    return calculateItemDiscountRate(
      productId,
      quantity,
      this.constants,
      this.products
    );
  }

  highlightDiscountableItems(cartItem, quantity) {
    const priceElems = cartItem.querySelectorAll(".text-lg, .text-xs");
    priceElems.forEach((elem) => {
      if (elem.classList.contains("text-lg")) {
        elem.style.fontWeight =
          quantity >= this.constants.DISCOUNT.ITEM_DISCOUNT_MIN_QUANTITY
            ? "bold"
            : "normal";
      }
    });
  }

  findProductById(productId) {
    return this.productList.find((p) => p.id === productId);
  }

  getResults() {
    return {
      subtotal: this.subtotal,
      totalAmount: this.totalAmount,
      totalItemCount: this.totalItemCount,
      itemDiscounts: this.itemDiscounts,
      discountRate: this.discountRate,
      isTuesday: new Date().getDay() === 2,
    };
  }
}

export default CartCalculator;
