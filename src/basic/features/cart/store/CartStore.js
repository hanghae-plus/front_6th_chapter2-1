/**
 * Cart Store - Local State Management
 * Manages cart-related state for individual components
 */

class CartStore {
  constructor() {
    this.items = [];
    this.totalAmount = 0;
    this.totalItemCount = 0;
  }

  static createInstance() {
    return new CartStore();
  }

  getItems() {
    return this.items;
  }

  setItems(value) {
    this.items = value;
  }

  addItem(item) {
    this.items.push(item);
  }

  removeItem(itemId) {
    this.items = this.items.filter((item) => item.id !== itemId);
  }

  updateItem(itemId, updates) {
    this.items = this.items.map((item) =>
      item.id === itemId ? { ...item, ...updates } : item
    );
  }

  findItem(itemId) {
    return this.items.find((item) => item.id === itemId);
  }

  getTotalAmount() {
    return this.totalAmount;
  }

  setTotalAmount(value) {
    this.totalAmount = value;
  }

  getTotalItemCount() {
    return this.totalItemCount;
  }

  setTotalItemCount(value) {
    this.totalItemCount = value;
  }

  // Batch update for performance
  updateCartState(updates) {
    Object.keys(updates).forEach((key) => {
      if (this.hasOwnProperty(key)) {
        this[key] = updates[key];
      }
    });
  }

  // Calculate totals from items
  calculateTotals() {
    this.totalItemCount = this.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    this.totalAmount = this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return {
      totalItemCount: this.totalItemCount,
      totalAmount: this.totalAmount,
    };
  }

  // Check if cart is empty
  isEmpty() {
    return this.items.length === 0;
  }

  // Clear all items
  clear() {
    this.items = [];
    this.totalAmount = 0;
    this.totalItemCount = 0;
  }

  destroyInstance() {
    this.items = [];
    this.totalAmount = 0;
    this.totalItemCount = 0;
  }
}

// Utility function for cart state updates
export const updateCartState = (
  cartStore,
  items,
  totalAmount,
  totalItemCount
) => {
  cartStore.setItems(items);
  cartStore.setTotalAmount(totalAmount);
  cartStore.setTotalItemCount(totalItemCount);
};

export default CartStore;
