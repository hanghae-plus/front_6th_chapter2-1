import { PRODUCT_LIST } from "../data/product.js";
import { DISCOUNT_RATES } from "../constants/index.js";

export class ProductStore {
  constructor() {
    this.products = [...PRODUCT_LIST]; // 깊은 복사로 초기화
    this.subscribers = new Set();
  }

  // 상품 목록 조회
  getProducts() {
    return [...this.products]; // 불변성을 위해 복사본 반환
  }

  // 특정 상품 조회
  getProductById(productId) {
    return this.products.find(product => product.id === productId);
  }

  // 재고 있는 상품만 조회
  getAvailableProducts() {
    return this.products.filter(product => product.quantity > 0);
  }

  // 할인 중인 상품 조회
  getSaleProducts() {
    return this.products.filter(product => product.onSale || product.suggestSale);
  }

  // 재고 업데이트
  updateStock(productId, quantity) {
    const product = this.getProductById(productId);
    if (product) {
      product.quantity = Math.max(0, product.quantity + quantity);
      this.notifySubscribers();
      return true;
    }
    return false;
  }

  // 재고 확인
  hasStock(productId, requiredQuantity = 1) {
    const product = this.getProductById(productId);
    return product && product.quantity >= requiredQuantity;
  }

  // 가격 업데이트
  updatePrice(productId, newPrice) {
    const product = this.getProductById(productId);
    if (product) {
      product.price = newPrice;
      this.notifySubscribers();
      return true;
    }
    return false;
  }

  // 원래 가격으로 복원
  resetPrice(productId) {
    const product = this.getProductById(productId);
    if (product) {
      product.price = product.originalPrice;
      product.onSale = false;
      product.suggestSale = false;
      this.notifySubscribers();
      return true;
    }
    return false;
  }

  // 번개세일 적용
  applyLightningSale(productId) {
    const product = this.getProductById(productId);
    if (product && product.quantity > 0 && !product.onSale) {
      product.price = Math.round(product.originalPrice * DISCOUNT_RATES.LIGHTNING_SALE);
      product.onSale = true;
      this.notifySubscribers();
      return true;
    }
    return false;
  }

  // 추천세일 적용
  applySuggestSale(productId) {
    const product = this.getProductById(productId);
    if (product && product.quantity > 0 && !product.suggestSale) {
      product.price = Math.round(product.price * DISCOUNT_RATES.SUGGEST_SALE);
      product.suggestSale = true;
      this.notifySubscribers();
      return true;
    }
    return false;
  }

  // 모든 할인 초기화
  resetAllSales() {
    this.products.forEach(product => {
      product.price = product.originalPrice;
      product.onSale = false;
      product.suggestSale = false;
    });
    this.notifySubscribers();
  }

  // 구독자 등록
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback); // 구독 해제 함수 반환
  }

  // 구독자들에게 변경 알림
  notifySubscribers() {
    this.subscribers.forEach(callback => {
      try {
        callback(this.getProducts());
      } catch (error) {
        console.error("ProductStore subscriber error:", error);
      }
    });
  }

  // 전체 재고 계산
  getTotalStock() {
    return this.products.reduce((total, product) => total + product.quantity, 0);
  }

  // 재고 부족 상품 조회
  getLowStockProducts(threshold) {
    return this.products.filter(product => product.quantity < threshold && product.quantity > 0);
  }
}
