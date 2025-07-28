import { INITIAL_PRODUCTS } from '../../shared/constants/index.js';

// Product Entity
export class ProductEntity {
  constructor(id, name, price, originalPrice, stock, onSale = false, suggestSale = false) {
    this.id = id;
    this.name = name;
    this.val = price;
    this.originalVal = originalPrice;
    this.q = stock;
    this.onSale = onSale;
    this.suggestSale = suggestSale;
  }

  // 재고 부족 여부 체크
  isLowStock(threshold = 5) {
    return this.q < threshold && this.q > 0;
  }

  // 품절 여부 체크
  isOutOfStock() {
    return this.q === 0;
  }

  // 재고 감소
  decreaseStock(amount) {
    if (this.q >= amount) {
      this.q -= amount;
      return true;
    }
    return false;
  }

  // 재고 증가
  increaseStock(amount) {
    this.q += amount;
  }

  // 할인가 적용
  applyDiscount(discountRate) {
    this.val = this.originalVal * (1 - discountRate);
  }

  // 원가 복원
  resetPrice() {
    this.val = this.originalVal;
  }
}

// Product Repository
export class ProductRepository {
  constructor() {
    this.products = INITIAL_PRODUCTS.map(p => 
      new ProductEntity(p.id, p.name, p.val, p.originalVal, p.q, p.onSale, p.suggestSale)
    );
  }

  findById(id) {
    return this.products.find(p => p.id === id) || null;
  }

  findAll() {
    return [...this.products];
  }

  findAvailableExcept(excludeId) {
    return this.products.find(p => 
      p.id !== excludeId && p.q > 0 && !p.suggestSale
    ) || null;
  }

  getTotalStock() {
    return this.products.reduce((total, product) => total + product.q, 0);
  }

  getLowStockProducts(threshold = 5) {
    return this.products.filter(p => p.isLowStock(threshold));
  }

  getOutOfStockProducts() {
    return this.products.filter(p => p.isOutOfStock());
  }
}