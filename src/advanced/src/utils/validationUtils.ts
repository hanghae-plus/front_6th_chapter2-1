import type { Product, CartItem } from "../types";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * 상품 존재 여부 검증
 */
export const validateProductExists = (
  productId: string,
  products: Product[]
): ValidationResult => {
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return {
      isValid: false,
      error: "잘못된 상품입니다.",
    };
  }

  return { isValid: true };
};

/**
 * 상품 품절 여부 검증
 */
export const validateProductInStock = (product: Product): ValidationResult => {
  if (product.quantity === 0) {
    return {
      isValid: false,
      error: `재고 부족: ${product.name}은(는) 품절입니다.`,
    };
  }

  return { isValid: true };
};

/**
 * 재고 수량 검증
 */
export const validateStockQuantity = (
  product: Product,
  requestedQuantity: number,
  currentQuantity: number = 0
): ValidationResult => {
  const totalRequested = currentQuantity + requestedQuantity;

  // product.quantity는 현재 남은 재고량이므로,
  // 원래 총 재고량을 계산해야 합니다
  const totalStock = product.quantity + currentQuantity;

  if (totalRequested > totalStock) {
    return {
      isValid: false,
      error: `재고 부족: ${product.name}의 재고는 ${totalStock}개입니다.`,
    };
  }

  return { isValid: true };
};

/**
 * 상품 선택 검증
 */
export const validateProductSelection = (
  productId: string
): ValidationResult => {
  if (!productId) {
    return {
      isValid: false,
      error: "상품을 선택해주세요.",
    };
  }

  return { isValid: true };
};

/**
 * 복합 검증 (상품 존재 + 재고)
 */
export const validateAddToCart = (
  productId: string,
  products: Product[],
  cart: CartItem[]
): ValidationResult => {
  // 1. 상품 선택 검증
  const selectionResult = validateProductSelection(productId);
  if (!selectionResult.isValid) {
    return selectionResult;
  }

  // 2. 상품 존재 검증
  const existenceResult = validateProductExists(productId, products);
  if (!existenceResult.isValid) {
    return existenceResult;
  }

  const product = products.find((p) => p.id === productId)!;

  // 3. 품절 검증
  const stockResult = validateProductInStock(product);
  if (!stockResult.isValid) {
    return stockResult;
  }

  // 4. 수량 검증
  const existingItem = cart.find((item) => item.id === productId);
  const currentQuantity = existingItem ? existingItem.quantity : 0;
  const quantityResult = validateStockQuantity(product, 1, currentQuantity);

  return quantityResult;
};

/**
 * 수량 업데이트 검증
 */
export const validateQuantityUpdate = (
  id: string,
  newQuantity: number,
  products: Product[],
  cart: CartItem[]
): ValidationResult => {
  const existingItem = cart.find((item) => item.id === id);
  if (!existingItem) {
    return {
      isValid: false,
      error: "장바구니에 존재하지 않는 상품입니다.",
    };
  }

  if (newQuantity === 0) {
    return { isValid: true }; // 제거는 항상 가능
  }

  const product = products.find((p) => p.id === id);
  if (!product) {
    return {
      isValid: false,
      error: "상품 정보를 찾을 수 없습니다.",
    };
  }

  const currentQuantity = existingItem.quantity;
  const quantityChange = newQuantity - currentQuantity;

  return validateStockQuantity(product, quantityChange, currentQuantity);
};
