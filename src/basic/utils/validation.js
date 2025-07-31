import { ValidationError } from '../types/errors.js';

function assert(condition, message, field) {
  if (!condition) {
    throw new ValidationError(message, field);
  }
}

// 상품 유효성 검사
export function validateProduct(product, productId) {
  assert(product, `상품을 찾을 수 없습니다: ${productId}`, 'product');
  assert(product.stock >= 0, `상품 재고가 잘못되었습니다: ${productId}`, 'stock');
}

// 수량 유효성 검사
export function validateQuantity(quantity, product, currentQuantity = 0) {
  assert(quantity > 0, '수량은 0보다 커야 합니다.', 'quantity');
  assert(quantity <= product.stock + currentQuantity, '재고가 부족합니다.', 'stock');
}

// DOM 요소 존재 검사
export function validateElementExists(element, elementName) {
  assert(element, `DOM 요소를 찾을 수 없습니다: ${elementName}`, 'dom');
}

// 계산 결과 유효성 검사
export function validateCalculationResult(result) {
  assert(
    result && typeof result.totalAmount === 'number' && result.totalAmount >= 0,
    '계산 결과가 유효하지 않습니다.',
    'calculation'
  );
}
