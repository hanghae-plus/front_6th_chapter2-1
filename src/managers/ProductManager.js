import { products } from '../data/products.js';

export function getProduct(productId) {
  return products.find((product) => product.id === productId);
}

export function setProduct(productId, updates) {
  const product = getProduct(productId);
  Object.assign(product, { ...product, ...updates });
  return product;
}

// 모든 상품 조회
export function getAllProducts() {
  return products;
}

// === 마지막 선택 상품 관리 ===
let lastSelectedProduct = null;

export function getLastSelectedProduct() {
  return lastSelectedProduct;
}

export function setLastSelectedProduct(productId) {
  lastSelectedProduct = productId;
}
