export class CartStore {
  constructor() {
    this.cartItems = [];
    this.totalAmount = 0;
    this.itemCount = 0;
    this.discountRate = 0;
    this.savedAmount = 0;
    this.lastSelectedProduct = null;
  }

  // 기본 상태 조회 메서드들
  getCartItems() {
    return this.cartItems;
  }

  getTotalAmount() {
    return this.totalAmount;
  }

  getItemCount() {
    return this.itemCount;
  }

  getDiscountRate() {
    return this.discountRate;
  }

  getSavedAmount() {
    return this.savedAmount;
  }

  getLastSelectedProduct() {
    return this.lastSelectedProduct;
  }

  // 기본 상태 설정 메서드들
  setCartItems(items) {
    this.cartItems = items;
  }

  setTotalAmount(amount) {
    this.totalAmount = amount;
  }

  setItemCount(count) {
    this.itemCount = count;
  }

  setDiscountRate(rate) {
    this.discountRate = rate;
  }

  setSavedAmount(amount) {
    this.savedAmount = amount;
  }

  setLastSelectedProduct(productId) {
    this.lastSelectedProduct = productId;
  }

  // 단순한 CRUD 메서드들
  addItem(item) {
    this.cartItems.push(item);
  }

  updateItem(productId, updatedItem) {
    const index = this.cartItems.findIndex(item => item.id === productId);
    if (index !== -1) {
      this.cartItems[index] = updatedItem;
    }
  }

  removeItem(productId) {
    this.cartItems = this.cartItems.filter(item => item.id !== productId);
  }

  clearCart() {
    this.cartItems = [];
    this.totalAmount = 0;
    this.itemCount = 0;
    this.discountRate = 0;
    this.savedAmount = 0;
    this.lastSelectedProduct = null;
  }

  // 아이템 찾기
  findItem(productId) {
    return this.cartItems.find(item => item.id === productId) || null;
  }

  // 전체 상태 업데이트
  updateState(newState) {
    Object.assign(this, newState);
  }
}

export default CartStore;
