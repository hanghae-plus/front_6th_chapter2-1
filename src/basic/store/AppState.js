/**
 * 애플리케이션의 전역 상태를 관리하는 클래스
 */
export class AppState {
  constructor() {
    // UI 참조들
    this.stockInfo = null;
    this.header = null;
    this.selectorContainer = null;
    this.cartDisplay = null;

    // 장바구니 상태
    this.itemCount = 0;
    this.totalAmount = 0;
    this.lastSelectedProduct = null;

    // 상태 변경 리스너들
    this.listeners = {
      itemCount: [],
      totalAmount: [],
      lastSelectedProduct: [],
    };
  }

  // UI 참조 설정 메서드들
  setStockInfo(element) {
    this.stockInfo = element;
  }

  setHeader(element) {
    this.header = element;
  }

  setSelectorContainer(element) {
    this.selectorContainer = element;
  }

  setCartDisplay(element) {
    this.cartDisplay = element;
  }

  // 상태 업데이트 메서드들
  setItemCount(count) {
    const oldValue = this.itemCount;
    this.itemCount = count;
    this.notifyListeners("itemCount", count, oldValue);
  }

  setTotalAmount(amount) {
    const oldValue = this.totalAmount;
    this.totalAmount = amount;
    this.notifyListeners("totalAmount", amount, oldValue);
  }

  setLastSelectedProduct(productId) {
    const oldValue = this.lastSelectedProduct;
    this.lastSelectedProduct = productId;
    this.notifyListeners("lastSelectedProduct", productId, oldValue);
  }

  // 상태 조회 메서드들
  getItemCount() {
    return this.itemCount;
  }

  getTotalAmount() {
    return this.totalAmount;
  }

  getLastSelectedProduct() {
    return this.lastSelectedProduct;
  }

  getStockInfo() {
    return this.stockInfo;
  }

  getHeader() {
    return this.header;
  }

  getSelectorContainer() {
    return this.selectorContainer;
  }

  getCartDisplay() {
    return this.cartDisplay;
  }

  // 리스너 관리
  addListener(property, callback) {
    if (this.listeners[property]) {
      this.listeners[property].push(callback);
    }
  }

  removeListener(property, callback) {
    if (this.listeners[property]) {
      const index = this.listeners[property].indexOf(callback);
      if (index > -1) {
        this.listeners[property].splice(index, 1);
      }
    }
  }

  notifyListeners(property, newValue, oldValue) {
    if (this.listeners[property]) {
      this.listeners[property].forEach(callback => {
        callback(newValue, oldValue);
      });
    }
  }

  // 상태 초기화
  reset() {
    this.itemCount = 0;
    this.totalAmount = 0;
    this.lastSelectedProduct = null;
  }
}
