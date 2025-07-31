/**
 * 상품 서비스
 * 상품 관련 비즈니스 로직과 UI 업데이트
 */

import {
  setProductState,
  initializeProductStore,
  getProductState,
} from '@/basic/features/product/store/productStore.js';
import {
  getTotalStock,
  generateStockStatusMessage,
} from '@/basic/features/product/utils/productUtils.js';
import {
  findElement,
  setStyle,
  setTextContent,
  safeDOM,
} from '@/basic/shared/core/domUtils.js';

/**
 * 상품 선택기 업데이트 (선언적)
 */
export const updateProductSelector = () => {
  const productSelector = findElement('#product-select');
  if (!productSelector) return;

  // 상품 선택기 업데이트
  productSelector.updateProducts(
    productState.products,
    productState.lastSelectedProduct,
  );

  const totalStock = getTotalStock(productState.products);
  const borderColor = totalStock < 50 ? 'orange' : '';

  safeDOM('#product-select', element =>
    setStyle(element, 'borderColor', borderColor),
  );
};

/**
 * 재고 정보 업데이트 (선언적)
 */
export const updateStockInfo = () => {
  const infoMsg = generateStockStatusMessage(productState.products, 5);

  safeDOM('#stock-status', element => setTextContent(element, infoMsg));
};

// setProductState를 외부에서 사용할 수 있도록 export
export { setProductState };
