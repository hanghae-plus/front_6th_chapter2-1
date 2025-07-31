export class CartItem {
  constructor(product, quantity = 1) {
    this.productId = product.id;
    this.name = product.name;
    this.price = product.price;
    this.originalPrice = product.originalPrice;
    this.quantity = quantity;
    this.saleStatus = product.getSaleStatus();
  }

  // 수량 증가
  increaseQuantity(amount = 1) {
    this.quantity += amount;
  }

  // 수량 감소
  decreaseQuantity(amount = 1) {
    this.quantity = Math.max(0, this.quantity - amount);
  }

  // 총 가격 계산
  getTotalPrice() {
    return this.price * this.quantity;
  }

  // 할인 전 총 가격 계산
  getOriginalTotalPrice() {
    return this.originalPrice * this.quantity;
  }

  // 할인 금액 계산
  getDiscountAmount() {
    return this.getOriginalTotalPrice() - this.getTotalPrice();
  }

  // 할인율 계산
  getDiscountRate() {
    if (this.originalPrice === 0) return 0;
    return ((this.originalPrice - this.price) / this.originalPrice) * 100;
  }

  // 할인 상태 업데이트
  updateSaleStatus(product) {
    this.price = product.price;
    this.originalPrice = product.originalPrice;
    this.saleStatus = product.getSaleStatus();
  }
}
