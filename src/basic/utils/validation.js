/**
 * 상품 유효성 검사 및 에러 처리 유틸리티
 * 순수 함수로 구현하여 테스트 가능성 향상
 */

/**
 * 에러 타입 정의
 */
export const ERROR_TYPES = {
  VALIDATION: "VALIDATION",
  BUSINESS_LOGIC: "BUSINESS_LOGIC",
  DOM_OPERATION: "DOM_OPERATION",
  NETWORK: "NETWORK",
  UNKNOWN: "UNKNOWN",
};

/**
 * 에러 코드 정의
 */
export const ERROR_CODES = {
  PRODUCT_NOT_FOUND: "PRODUCT_NOT_FOUND",
  INSUFFICIENT_STOCK: "INSUFFICIENT_STOCK",
  NO_PRODUCT_SELECTED: "NO_PRODUCT_SELECTED",
  INVALID_QUANTITY: "INVALID_QUANTITY",
  DOM_ELEMENT_NOT_FOUND: "DOM_ELEMENT_NOT_FOUND",
  CALCULATION_ERROR: "CALCULATION_ERROR",
};

/**
 * 커스텀 에러 클래스
 */
export class CartError extends Error {
  constructor(message, code, type = ERROR_TYPES.BUSINESS_LOGIC) {
    super(message);
    this.name = "CartError";
    this.code = code;
    this.type = type;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * 상품 가용성 검사
 * @param {Object} product - 상품 객체
 * @param {number} quantity - 요청 수량
 * @returns {Object} 검사 결과 { isValid, error }
 */
export function validateProductAvailability(product, quantity = 1) {
  if (!product) {
    return {
      isValid: false,
      error: new CartError(
        "상품을 찾을 수 없습니다.",
        ERROR_CODES.PRODUCT_NOT_FOUND,
        ERROR_TYPES.VALIDATION,
      ),
    };
  }

  if (product.q < quantity) {
    return {
      isValid: false,
      error: new CartError(
        `재고가 부족합니다. (현재: ${product.q}개)`,
        ERROR_CODES.INSUFFICIENT_STOCK,
        ERROR_TYPES.VALIDATION,
      ),
    };
  }

  return { isValid: true, error: null };
}

/**
 * 선택된 상품 ID 유효성 검사
 * @param {string} productId - 상품 ID
 * @returns {Object} 검사 결과 { isValid, error }
 */
export function validateProductSelection(productId) {
  if (!productId || productId.trim() === "") {
    return {
      isValid: false,
      error: new CartError(
        "상품을 선택해주세요.",
        ERROR_CODES.NO_PRODUCT_SELECTED,
        ERROR_TYPES.VALIDATION,
      ),
    };
  }

  return { isValid: true, error: null };
}

/**
 * 수량 유효성 검사
 * @param {number} quantity - 수량
 * @param {number} maxQuantity - 최대 수량
 * @returns {Object} 검사 결과 { isValid, error }
 */
export function validateQuantity(quantity, maxQuantity) {
  if (quantity <= 0) {
    return {
      isValid: false,
      error: new CartError(
        "수량은 1개 이상이어야 합니다.",
        ERROR_CODES.INVALID_QUANTITY,
        ERROR_TYPES.VALIDATION,
      ),
    };
  }

  if (quantity > maxQuantity) {
    return {
      isValid: false,
      error: new CartError(
        "재고가 부족합니다.",
        ERROR_CODES.INSUFFICIENT_STOCK,
        ERROR_TYPES.VALIDATION,
      ),
    };
  }

  return { isValid: true, error: null };
}

/**
 * DOM 요소 존재 여부 검사
 * @param {Element} element - DOM 요소
 * @param {string} elementName - 요소 이름
 * @returns {Object} 검사 결과 { isValid, error }
 */
export function validateDOMElement(element, elementName) {
  if (!element) {
    return {
      isValid: false,
      error: new CartError(
        `${elementName} 요소를 찾을 수 없습니다.`,
        ERROR_CODES.DOM_ELEMENT_NOT_FOUND,
        ERROR_TYPES.DOM_OPERATION,
      ),
    };
  }

  return { isValid: true, error: null };
}
