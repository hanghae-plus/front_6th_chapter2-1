// Domain model: CartItem
export default class CartItem {
  constructor(product, quantity = 1) {
    if (!product) throw new Error("CartItem requires a Product");
    if (quantity < 1) throw new Error("Quantity must be >= 1");
    this.product = product;
    this.quantity = quantity;
  }

  /** 상품 ID 프록시 */
  get id() {
    return this.product.id;
  }

  /** 소계(할인 적용 가격 x 수량) */
  get subtotal() {
    return this.product.salePrice * this.quantity;
  }

  increment(delta = 1) {
    if (delta < 0) return this.decrement(-delta);
    if (this.product.decreaseStock(delta)) {
      this.quantity += delta;
      return true;
    }
    return false; // 재고 부족
  }

  decrement(delta = 1) {
    if (delta < 0) return this.increment(-delta);
    if (this.quantity - delta <= 0) return false;
    this.quantity -= delta;
    this.product.increaseStock(delta);
    return true;
  }

  /** 완전히 제거 시 상품 재고 복구 */
  dispose() {
    this.product.increaseStock(this.quantity);
  }
}
