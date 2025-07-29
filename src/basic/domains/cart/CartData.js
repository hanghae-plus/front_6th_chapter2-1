/**
 * 장바구니 아이템 데이터 모델
 */
export class CartItem {
  constructor(product, quantity = 1) {
    this.id = product.id;
    this.name = product.name;
    this.price = product.val;
    this.originalPrice = product.originalVal;
    this.quantity = quantity;
    this.onSale = product.onSale;
    this.suggestSale = product.suggestSale;
  }

  /**
   * 아이템 총 가격 계산
   * @returns {number} 총 가격
   */
  getTotalPrice() {
    return this.price * this.quantity;
  }

  /**
   * 아이템 원래 총 가격 계산
   * @returns {number} 원래 총 가격
   */
  getOriginalTotalPrice() {
    return this.originalPrice * this.quantity;
  }

  /**
   * 할인 금액 계산
   * @returns {number} 할인 금액
   */
  getDiscountAmount() {
    return this.getOriginalTotalPrice() - this.getTotalPrice();
  }

  /**
   * 할인율 계산
   * @returns {number} 할인율
   */
  getDiscountRate() {
    const originalTotal = this.getOriginalTotalPrice();
    return originalTotal > 0 ? this.getDiscountAmount() / originalTotal : 0;
  }

  /**
   * 수량 증가
   * @param {number} quantity - 증가할 수량
   */
  increaseQuantity(quantity) {
    this.quantity += quantity;
  }

  /**
   * 수량 감소
   * @param {number} quantity - 감소할 수량
   */
  decreaseQuantity(quantity) {
    this.quantity = Math.max(0, this.quantity - quantity);
  }

  /**
   * 할인 상태 업데이트
   * @param {Object} product - 상품 정보
   */
  updateDiscountStatus(product) {
    this.price = product.val;
    this.originalPrice = product.originalVal;
    this.onSale = product.onSale;
    this.suggestSale = product.suggestSale;
  }
}

/**
 * 장바구니 데이터 모델
 */
export class Cart {
  constructor() {
    this.items = new Map(); // productId -> CartItem
  }

  /**
   * 아이템 추가
   * @param {Product} product - 상품 정보
   * @param {number} quantity - 수량
   * @returns {boolean} 성공 여부
   */
  addItem(product, quantity = 1) {
    if (product.isSoldOut() || product.q < quantity) {
      return false;
    }

    const existingItem = this.items.get(product.id);
    if (existingItem) {
      existingItem.increaseQuantity(quantity);
    } else {
      this.items.set(product.id, new CartItem(product, quantity));
    }

    return true;
  }

  /**
   * 아이템 제거
   * @param {string} productId - 상품 ID
   * @returns {boolean} 성공 여부
   */
  removeItem(productId) {
    return this.items.delete(productId);
  }

  /**
   * 아이템 수량 변경
   * @param {string} productId - 상품 ID
   * @param {number} quantity - 새로운 수량
   * @returns {boolean} 성공 여부
   */
  updateItemQuantity(productId, quantity) {
    const item = this.items.get(productId);
    if (!item) {
      return false;
    }

    if (quantity <= 0) {
      this.removeItem(productId);
    } else {
      item.quantity = quantity;
    }

    return true;
  }

  /**
   * 아이템 조회
   * @param {string} productId - 상품 ID
   * @returns {CartItem|null} 장바구니 아이템 또는 null
   */
  getItem(productId) {
    return this.items.get(productId) || null;
  }

  /**
   * 모든 아이템 조회
   * @returns {CartItem[]} 장바구니 아이템 목록
   */
  getAllItems() {
    return Array.from(this.items.values());
  }

  /**
   * 장바구니 비우기
   */
  clear() {
    this.items.clear();
  }

  /**
   * 장바구니가 비어있는지 확인
   * @returns {boolean} 비어있음 여부
   */
  isEmpty() {
    return this.items.size === 0;
  }

  /**
   * 총 아이템 수량 계산
   * @returns {number} 총 수량
   */
  getTotalQuantity() {
    return Array.from(this.items.values()).reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * 총 가격 계산 (할인 적용 전)
   * @returns {number} 총 가격
   */
  getSubtotal() {
    return Array.from(this.items.values()).reduce((total, item) => total + item.getTotalPrice(), 0);
  }

  /**
   * 원래 총 가격 계산 (할인 적용 전)
   * @returns {number} 원래 총 가격
   */
  getOriginalSubtotal() {
    return Array.from(this.items.values()).reduce(
      (total, item) => total + item.getOriginalTotalPrice(),
      0,
    );
  }
}
