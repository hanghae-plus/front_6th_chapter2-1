class AppState {
  constructor() {
    this.totalQuantity = 0;
    this.lastSelectedProductId = null;
    this.totalPrice = 0;
  }

  updateState(newState) {
    Object.assign(this, newState);
  }

  getState() {
    return {
      totalQuantity: this.totalQuantity,
      lastSelectedProductId: this.lastSelectedProductId,
      totalPrice: this.totalPrice,
    };
  }
}

export default AppState;
