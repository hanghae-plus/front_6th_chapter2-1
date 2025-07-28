// Cart Entity
export class CartEntity {
  constructor() {
    this.items = new Map(); // productId -> { quantity, price, discount }
    this.totalAmount = 0;
    this.itemCount = 0;
  }

  // 상품 추가
  addItem(productId, quantity = 1, price = 0, discount = 0) {
    if (this.items.has(productId)) {
      const existing = this.items.get(productId);
      existing.quantity += quantity;
    } else {
      this.items.set(productId, { quantity, price, discount });
    }
    this.updateTotals();
  }

  // 상품 제거
  removeItem(productId) {
    this.items.delete(productId);
    this.updateTotals();
  }

  // 수량 변경
  updateItemQuantity(productId, quantity) {
    if (quantity <= 0) {
      this.removeItem(productId);
    } else if (this.items.has(productId)) {
      this.items.get(productId).quantity = quantity;
      this.updateTotals();
    }
  }

  // 아이템 조회
  getItem(productId) {
    return this.items.get(productId) || null;
  }

  // 모든 아이템 조회
  getAllItems() {
    return Array.from(this.items.entries()).map(([productId, item]) => ({
      productId,
      ...item
    }));
  }

  // 총합 업데이트
  updateTotals() {
    this.itemCount = 0;
    this.totalAmount = 0;
    
    for (const item of this.items.values()) {
      this.itemCount += item.quantity;
      this.totalAmount += item.quantity * item.price * (1 - item.discount);
    }
  }

  // 장바구니 비우기
  clear() {
    this.items.clear();
    this.totalAmount = 0;
    this.itemCount = 0;
  }

  // 장바구니 비어있는지 확인
  isEmpty() {
    return this.items.size === 0;
  }

  // 특정 상품 포함 여부
  hasProduct(productId) {
    return this.items.has(productId);
  }
}

// Cart Repository (향후 localStorage 연동 등을 위해)
export class CartRepository {
  constructor() {
    this.cart = new CartEntity();
  }

  getCart() {
    return this.cart;
  }

  saveCart() {
    // 향후 localStorage 저장 로직
    console.log('Cart saved:', this.cart);
  }

  loadCart() {
    // 향후 localStorage 로드 로직
    return this.cart;
  }
}