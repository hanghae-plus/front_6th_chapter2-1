// Domain model: Cart
import CartItem from "./CartItem.js";

export default class Cart {
  constructor() {
    /** @type {Map<string, CartItem>} */
    this.items = new Map();
  }

  /** 상품 추가 (재고 차감 포함) */
  addProduct(product, qty = 1) {
    if (!product.decreaseStock(qty)) {
      return false; // 재고 부족
    }
    const existing = this.items.get(product.id);
    if (existing) {
      existing.quantity += qty;
    } else {
      this.items.set(product.id, new CartItem(product, qty));
    }
    return true;
  }

  /** 수량 변경 (delta: + / -) */
  changeQuantity(productId, delta) {
    const item = this.items.get(productId);
    if (!item) return false;
    if (delta > 0) return item.increment(delta);
    if (delta < 0) {
      const ok = item.decrement(-delta);
      if (item.quantity === 0) this.removeProduct(productId);
      return ok;
    }
    return true;
  }

  /** 상품 완전 제거 */
  removeProduct(productId) {
    const item = this.items.get(productId);
    if (!item) return false;
    item.dispose();
    this.items.delete(productId);
    return true;
  }

  /** 총 수량 */
  get totalQuantity() {
    let sum = 0;
    for (const item of this.items.values()) {
      sum += item.quantity;
    }
    return sum;
  }

  /** 총 금액(할인 적용 후) */
  get subtotal() {
    let sum = 0;
    for (const item of this.items.values()) {
      sum += item.subtotal;
    }
    return sum;
  }

  /** 아이템 목록 배열 */
  get list() {
    return Array.from(this.items.values());
  }
}
