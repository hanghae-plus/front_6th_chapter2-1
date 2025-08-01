export class CartStore {
  constructor() {
    this.state = {
      cartItems: [],
      totalAmount: 0,
      itemCount: 0,
      discountRate: 0,
      savedAmount: 0,
      lastSelectedProduct: null,
    };
  }

  // 불변성을 유지하는 상태 업데이트
  setState(newState) {
    this.state = { ...this.state, ...newState };
  }

  // 상태 조회
  getState() {
    return this.state;
  }
}

export default CartStore;
