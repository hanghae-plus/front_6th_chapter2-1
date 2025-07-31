import { PRODUCT_IDS } from "../constants.js";

export class Product {
  constructor(id, name, price, stock, onSale = false, suggestSale = false) {
    this.id = id;
    this.name = name;
    this.originalPrice = price;
    this.price = price;
    this.stock = stock;
    this.onSale = onSale;
    this.suggestSale = suggestSale;
  }

  // 할인 적용
  applyDiscount(discountRate) {
    this.price = Math.round((this.originalPrice * (100 - discountRate)) / 100);
  }

  // 할인 해제
  resetPrice() {
    this.price = this.originalPrice;
  }

  // 재고 감소
  decreaseStock(quantity = 1) {
    if (this.stock >= quantity) {
      this.stock -= quantity;
      return true;
    }
    return false;
  }

  // 재고 증가
  increaseStock(quantity = 1) {
    this.stock += quantity;
  }

  // 품절 여부 확인
  isOutOfStock() {
    return this.stock === 0;
  }

  // 재고 부족 여부 확인
  isLowStock() {
    return this.stock > 0 && this.stock < 5;
  }

  // 할인 상태 확인
  getSaleStatus() {
    if (this.onSale && this.suggestSale) {
      return "COMBINED";
    } else if (this.onSale) {
      return "LIGHTNING";
    } else if (this.suggestSale) {
      return "SUGGESTED";
    }
    return "NONE";
  }
}

// 초기 상품 데이터
export const initialProducts = [
  new Product(PRODUCT_IDS.KEYBOARD, "버그 없애는 키보드", 10000, 50),
  new Product(PRODUCT_IDS.MOUSE, "생산성 폭발 마우스", 20000, 30),
  new Product(PRODUCT_IDS.MONITOR_ARM, "거북목 탈출 모니터암", 30000, 20),
  new Product(PRODUCT_IDS.LAPTOP_CASE, "에러 방지 노트북 파우치", 15000, 0),
  new Product(PRODUCT_IDS.SPEAKER, "코딩할 때 듣는 Lo-Fi 스피커", 25000, 10),
];
