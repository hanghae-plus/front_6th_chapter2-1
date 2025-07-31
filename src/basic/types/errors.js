// 에러 상수
export const ERROR_TYPES = {
  INSUFFICIENT_STOCK: '재고 부족',
  PRODUCT_NOT_FOUND: '상품 없음',
  INVALID_QUANTITY: '수량 오류',
  DOM_ELEMENT_NOT_FOUND: 'DOM 요소 없음',
  CALCULATION_ERROR: '계산 오류',
};

// 공통 베이스 에러 클래스
class BaseError extends Error {
  constructor(name, message, meta = {}) {
    super(message);
    this.name = name;
    this.meta = meta;
  }

  toString() {
    return `${this.name}: ${this.message} ${JSON.stringify(this.meta)}`;
  }
}

/** 카트 에러 */
export class CartError extends BaseError {
  constructor(message, type = ERROR_TYPES.CALCULATION_ERROR) {
    super('CartError', message, { type });
  }
}

/** 상품 에러 */
export class ProductError extends BaseError {
  constructor(message, productId = null) {
    super('ProductError', message, { productId });
  }
}

/** 검증 에러 */
export class ValidationError extends BaseError {
  constructor(message, field = null) {
    super('ValidationError', message, { field });
  }
}
