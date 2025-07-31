import { CartItem } from "../models/CartItem.js";
import { DiscountService } from "./DiscountService.js";
import { PointService } from "./PointService.js";

export class CartService {
  constructor() {
    this.items = new Map(); // productId -> CartItem
  }

  // 상품 추가
  addItem(product, quantity = 1) {
    if (product.isOutOfStock()) {
      throw new Error("품절된 상품입니다.");
    }

    if (!product.decreaseStock(quantity)) {
      throw new Error("재고가 부족합니다.");
    }

    if (this.items.has(product.id)) {
      const existingItem = this.items.get(product.id);
      existingItem.increaseQuantity(quantity);
      existingItem.updateSaleStatus(product);
    } else {
      const cartItem = new CartItem(product, quantity);
      this.items.set(product.id, cartItem);
    }
  }

  // 상품 수량 변경
  updateItemQuantity(productId, quantity, product) {
    const item = this.items.get(productId);
    if (!item) return false;

    const currentQuantity = item.quantity;
    const quantityDiff = quantity - currentQuantity;

    if (quantityDiff > 0) {
      // 수량 증가
      if (!product.decreaseStock(quantityDiff)) {
        throw new Error("재고가 부족합니다.");
      }
      item.increaseQuantity(quantityDiff);
    } else if (quantityDiff < 0) {
      // 수량 감소
      product.increaseStock(Math.abs(quantityDiff));
      item.decreaseQuantity(Math.abs(quantityDiff));
    }

    item.updateSaleStatus(product);

    // 수량이 0이 되면 장바구니에서 제거
    if (item.quantity === 0) {
      this.removeItem(productId, product);
    }

    return true;
  }

  // 상품 제거
  removeItem(productId, product) {
    const item = this.items.get(productId);
    if (!item) return false;

    // 재고 복구
    product.increaseStock(item.quantity);
    this.items.delete(productId);
    return true;
  }

  // 장바구니 비우기
  clear() {
    this.items.clear();
  }

  // 장바구니 아이템 가져오기
  getItems() {
    return Array.from(this.items.values());
  }

  // 총 수량 계산
  getTotalQuantity() {
    return Array.from(this.items.values()).reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  // 총 가격 계산 (할인 전)
  getOriginalTotalPrice() {
    return Array.from(this.items.values()).reduce(
      (total, item) => total + item.getOriginalTotalPrice(),
      0
    );
  }

  // 총 가격 계산 (할인 후)
  getTotalPrice() {
    return Array.from(this.items.values()).reduce(
      (total, item) => total + item.getTotalPrice(),
      0
    );
  }

  // 할인 정보 계산
  calculateDiscountInfo() {
    const items = this.getItems();
    const totalQuantity = this.getTotalQuantity();
    const originalTotal = this.getOriginalTotalPrice();

    const discountRate = DiscountService.calculateTotalDiscountRate(
      items,
      totalQuantity
    );
    const finalPrice = DiscountService.calculateFinalPrice(
      originalTotal,
      discountRate
    );
    const discountAmount = DiscountService.calculateDiscountAmount(
      originalTotal,
      discountRate
    );

    return {
      originalTotal,
      finalPrice,
      discountRate,
      discountAmount,
      items,
      totalQuantity,
    };
  }

  // 포인트 정보 계산
  calculatePointInfo() {
    const discountInfo = this.calculateDiscountInfo();
    const totalPoints = PointService.calculateTotalPoints(
      discountInfo.finalPrice,
      discountInfo.items,
      discountInfo.totalQuantity
    );
    const pointDetails = PointService.getPointDetails(
      discountInfo.finalPrice,
      discountInfo.items,
      discountInfo.totalQuantity
    );

    return {
      totalPoints,
      pointDetails,
    };
  }

  // 장바구니 상태 확인
  isEmpty() {
    return this.items.size === 0;
  }

  // 특정 상품이 장바구니에 있는지 확인
  hasItem(productId) {
    return this.items.has(productId);
  }

  // 특정 상품의 수량 가져오기
  getItemQuantity(productId) {
    const item = this.items.get(productId);
    return item ? item.quantity : 0;
  }
}
