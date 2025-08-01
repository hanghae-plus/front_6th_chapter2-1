import {
  getProductSelectElement,
  getStockInfoElement,
} from '../../shared/core/dom-refs.js';
import { ProductOption } from './components/ProductSelector.js';
import { STOCK_THRESHOLDS } from '../../shared/constants/index.js';

/**
 * 상품 선택 드롭다운 렌더링
 */
export function renderProductSelector(products) {
  const productSelect = getProductSelectElement();
  if (!productSelect) return;

  // 기존 옵션들 제거
  productSelect.innerHTML = '';

  // 상품 옵션들 추가
  products.forEach((product) => {
    const option = ProductOption(product);
    productSelect.appendChild(option);
  });
}

/**
 * 재고 상태 렌더링
 */
export function renderStockStatus(product) {
  const stockInfo = getStockInfoElement();
  if (!stockInfo) return;

  if (!product) {
    stockInfo.textContent = '';
    return;
  }

  if (product.stock === 0) {
    stockInfo.textContent = '재고가 부족합니다.';
    stockInfo.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';
  } else if (product.stock < 5) {
    stockInfo.textContent = `재고 부족: ${product.stock}개 남음`;
    stockInfo.className = 'text-xs text-orange-500 mt-3 whitespace-pre-line';
  } else {
    stockInfo.textContent = `재고: ${product.stock}개`;
    stockInfo.className = 'text-xs text-green-500 mt-3 whitespace-pre-line';
  }
}

/**
 * 드롭다운 시각적 피드백 업데이트
 */
export function updateSelectVisualFeedback(totalStock) {
  const productSelect = getProductSelectElement();
  if (!productSelect) return;

  // 재고 부족 시 시각적 피드백
  productSelect.style.borderColor =
    totalStock < STOCK_THRESHOLDS.WARNING ? 'orange' : '';
}
