// Domain model: Product
export default class Product {
  constructor({ id, name, price, stock = 0, discountRate = 0 }) {
    this.id = id;
    this.name = name;
    this.price = price; // 현재 적용 가격 (할인 포함)
    this.originalPrice = price; // 원가 보존
    this.stock = stock; // 현재 재고
    this.discountRate = discountRate; // 개별 상품 기본 할인율(%) 예: 0.1 => 10%
  }

  /**
   * 현재 재고가 n개 이상 남아 있는가?
   */
  hasStock(n = 1) {
    return this.stock >= n;
  }

  /**
   * 재고 차감. 재고가 부족하면 false 반환.
   */
  decreaseStock(n = 1) {
    if (!this.hasStock(n)) return false;
    this.stock -= n;
    return true;
  }

  /** 재고 복구 */
  increaseStock(n = 1) {
    this.stock += n;
  }

  /** 현재 적용중인 할인율 (0~1) */
  getCurrentDiscountRate() {
    return this.discountRate;
  }

  /** 현재 판매가(프로모션 등 적용가) */
  get salePrice() {
    return this.price;
  }
}
