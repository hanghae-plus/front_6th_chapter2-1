import {
  PRODUCT_IDS,
  PRODUCT_PRICES,
  PRODUCT_NAMES,
  INITIAL_STOCK,
} from '../../constants/ProductConstants.js';

/**
 * 상품 데이터 모델
 */
export class Product {
  constructor(id, name, price, stock) {
    this.id = id;
    this.name = name;
    this.val = price; // 현재 가격
    this.originalVal = price; // 원래 가격
    this.q = stock; // 재고
    this.onSale = false; // 번개세일 여부
    this.suggestSale = false; // 추천할인 여부
  }

  /**
   * 할인 적용
   * @param {number} discountRate - 할인율
   */
  applyDiscount(discountRate) {
    this.val = Math.round(this.originalVal * (1 - discountRate));
  }

  /**
   * 할인 해제
   */
  removeDiscount() {
    this.val = this.originalVal;
  }

  /**
   * 번개세일 적용
   */
  applyLightningSale() {
    this.onSale = true;
    this.applyDiscount(0.2);
  }

  /**
   * 추천할인 적용
   */
  applyRecommendationSale() {
    this.suggestSale = true;
    this.applyDiscount(0.05);
  }

  /**
   * 재고 감소
   * @param {number} quantity - 감소할 수량
   */
  decreaseStock(quantity) {
    this.q = Math.max(0, this.q - quantity);
  }

  /**
   * 재고 증가
   * @param {number} quantity - 증가할 수량
   */
  increaseStock(quantity) {
    this.q += quantity;
  }

  /**
   * 품절 여부 확인
   * @returns {boolean} 품절 여부
   */
  isSoldOut() {
    return this.q === 0;
  }

  /**
   * 재고 부족 여부 확인
   * @param {number} threshold - 기준 수량
   * @returns {boolean} 재고 부족 여부
   */
  isLowStock(threshold = 5) {
    return this.q > 0 && this.q < threshold;
  }
}

/**
 * 상품 데이터 초기화
 * @returns {Product[]} 상품 목록
 */
export function initializeProducts() {
  return [
    new Product(
      PRODUCT_IDS.KEYBOARD,
      PRODUCT_NAMES[PRODUCT_IDS.KEYBOARD],
      PRODUCT_PRICES[PRODUCT_IDS.KEYBOARD],
      INITIAL_STOCK[PRODUCT_IDS.KEYBOARD],
    ),
    new Product(
      PRODUCT_IDS.MOUSE,
      PRODUCT_NAMES[PRODUCT_IDS.MOUSE],
      PRODUCT_PRICES[PRODUCT_IDS.MOUSE],
      INITIAL_STOCK[PRODUCT_IDS.MOUSE],
    ),
    new Product(
      PRODUCT_IDS.MONITOR_ARM,
      PRODUCT_NAMES[PRODUCT_IDS.MONITOR_ARM],
      PRODUCT_PRICES[PRODUCT_IDS.MONITOR_ARM],
      INITIAL_STOCK[PRODUCT_IDS.MONITOR_ARM],
    ),
    new Product(
      PRODUCT_IDS.LAPTOP_CASE,
      PRODUCT_NAMES[PRODUCT_IDS.LAPTOP_CASE],
      PRODUCT_PRICES[PRODUCT_IDS.LAPTOP_CASE],
      INITIAL_STOCK[PRODUCT_IDS.LAPTOP_CASE],
    ),
    new Product(
      PRODUCT_IDS.SPEAKER,
      PRODUCT_NAMES[PRODUCT_IDS.SPEAKER],
      PRODUCT_PRICES[PRODUCT_IDS.SPEAKER],
      INITIAL_STOCK[PRODUCT_IDS.SPEAKER],
    ),
  ];
}
