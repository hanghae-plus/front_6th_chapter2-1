/**
 * UI Store - Local State Management
 * Manages UI-related state for individual components
 */

class UIStore {
  constructor() {
    this.selectedProductId = null;
    this.stockInfo = "";
    this.discountInfo = "";
    this.isLoading = false;
    this.errorMessage = "";
  }

  static createInstance() {
    return new UIStore();
  }

  getSelectedProductId() {
    return this.selectedProductId;
  }

  setSelectedProductId(value) {
    this.selectedProductId = value;
  }

  getStockInfo() {
    return this.stockInfo;
  }

  setStockInfo(value) {
    this.stockInfo = value;
  }

  getDiscountInfo() {
    return this.discountInfo;
  }

  setDiscountInfo(value) {
    this.discountInfo = value;
  }

  getIsLoading() {
    return this.isLoading;
  }

  setIsLoading(value) {
    this.isLoading = value;
  }

  getErrorMessage() {
    return this.errorMessage;
  }

  setErrorMessage(value) {
    this.errorMessage = value;
  }

  // Clear error message
  clearError() {
    this.errorMessage = "";
  }

  // Batch update for performance
  updateUIState(updates) {
    Object.keys(updates).forEach((key) => {
      const setterName = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
      if (typeof this[setterName] === "function") {
        this[setterName](updates[key]);
      }
    });
  }

  // Reset all UI state
  reset() {
    this.selectedProductId = null;
    this.stockInfo = "";
    this.discountInfo = "";
    this.isLoading = false;
    this.errorMessage = "";
  }

  destroyInstance() {
    this.selectedProductId = null;
    this.stockInfo = "";
    this.discountInfo = "";
    this.isLoading = false;
    this.errorMessage = "";
  }
}

// Utility function for UI state updates
export const updateUIState = (uiStore, updates) => {
  Object.keys(updates).forEach((key) => {
    const setterName = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
    if (typeof uiStore[setterName] === "function") {
      uiStore[setterName](updates[key]);
    }
  });
};

export default UIStore;
