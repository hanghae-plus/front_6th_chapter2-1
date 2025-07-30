import { PRODUCT_LIST } from "../data/product.js";

export class ProductStore {
  constructor() {
    this.state = {
      products: [...PRODUCT_LIST], // 깊은 복사로 초기화
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

export default ProductStore;
