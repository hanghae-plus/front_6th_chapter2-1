import { getProducts } from '../../shared/core/business-state.js';
import { calculateTotalStock } from './StockService.js';
import * as ProductRenderer from './ProductRenderer.js';

/**
 * 상품 선택 UI 업데이트 오케스트레이션
 */
export function updateSelectOptions() {
  const products = getProducts();

  // 1. 상품 선택 드롭다운 렌더링
  ProductRenderer.renderProductSelector(products);

  // 2. 전체 재고 계산 및 시각적 피드백
  const totalStock = calculateTotalStock(products);
  ProductRenderer.updateSelectVisualFeedback(totalStock);
}

/**
 * 특정 상품의 재고 상태 표시
 */
export function showStockStatus(productId) {
  const products = getProducts();
  const product = products.find((p) => p.id === productId);

  ProductRenderer.renderStockStatus(product);
}

/**
 * 상품 목록 렌더링
 */
export function renderProductSelector() {
  const products = getProducts();
  ProductRenderer.renderProductSelector(products);
}

/**
 * 재고 상태만 업데이트
 */
export function renderStockStatus(productId) {
  const products = getProducts();
  const product = products.find((p) => p.id === productId);
  ProductRenderer.renderStockStatus(product);
}
