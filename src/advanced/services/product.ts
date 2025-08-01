// services/product.ts
import { getProducts } from '../store/state.js';
import { THRESHOLDS } from '../constants/index.js';

export function updateProductOptions(): void {
  // React 컴포넌트에서 자동으로 처리되므로 빈 함수로 유지
  // 호환성을 위해 함수는 남겨둠
}

export function updateStockStatus(): void {
  // React 컴포넌트에서 자동으로 처리되므로 빈 함수로 유지
  // 호환성을 위해 함수는 남겨둠
}

export function getStockMessage(): string {
  const products = getProducts();
  let message = '';
  
  products.forEach((product) => {
    if (product.stock < THRESHOLDS.LOW_STOCK) {
      if (product.stock > 0) {
        message += `${product.name}: 재고 부족 (${product.stock}개 남음)\n`;
      } else {
        message += `${product.name}: 품절\n`;
      }
    }
  });
  
  return message;
}

export function getTotalStock(): number {
  const products = getProducts();
  return products.reduce((sum, product) => sum + product.stock, 0);
}