import { PRODUCT_LIST } from '../data/product.data.js';
import { isLowStock, isOutOfStock } from '../utils/stock.util.js';

/**
 * 재고 관리 관련 비즈니스 로직을 관리하는 hook
 */
export const useStock = () => {
  // 재고 부족 상품들 확인
  const getLowStockProducts = () => {
    return PRODUCT_LIST.filter(product => isLowStock(product));
  };

  // 품절 상품들 확인
  const getOutOfStockProducts = () => {
    return PRODUCT_LIST.filter(product => isOutOfStock(product));
  };

  // 재고 상태 메시지 생성
  const getStockStatusMessage = () => {
    return PRODUCT_LIST.filter(product => isLowStock(product))
      .map(product => {
        if (isOutOfStock(product)) {
          return `${product.name}: 품절`;
        }
        return `${product.name}: 재고 부족 (${product.q}개 남음)`;
      })
      .join('\n');
  };

  // 전체 재고 수량 계산
  const getTotalStock = () => {
    return PRODUCT_LIST.reduce((total, product) => total + product.q, 0);
  };

  // 특정 상품의 재고 정보
  const getProductStockInfo = productId => {
    const product = PRODUCT_LIST.find(p => p.id === productId);
    if (!product) return null;

    return {
      id: product.id,
      name: product.name,
      stock: product.q,
      isLowStock: isLowStock(product),
      isOutOfStock: isOutOfStock(product),
    };
  };

  const lowStockProducts = getLowStockProducts();
  const outOfStockProducts = getOutOfStockProducts();
  const stockStatusMessage = getStockStatusMessage();
  const totalStock = getTotalStock();

  return {
    lowStockProducts,
    outOfStockProducts,
    stockStatusMessage,
    totalStock,
    getLowStockProducts,
    getOutOfStockProducts,
    getStockStatusMessage,
    getTotalStock,
    getProductStockInfo,
  };
};
