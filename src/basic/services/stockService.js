import { STOCK_THRESHOLD } from "../constants/stock.constant";
import productStore from "../store/product";

/**
 * 재고 부족 상품 정보 가져오기
 * @returns {Array} 재고 부족 상품 정보 배열
 */
export const getLowStockItems = () => {
  // 상품 리스트 가져오기
  const productList = productStore.getState().products;
  const lowStockItems = [];

  // 상품 리스트 순회
  productList.forEach((product) => {
    // 현재 재고 확인
    const currentStock = product.quantity;

    // 재고 부족 상품 체크
    if (currentStock >= STOCK_THRESHOLD) return;

    // 품절 상품 체크
    const isOutOfStock = currentStock === 0;
    const message = isOutOfStock
      ? `${product.name}: 품절`
      : `${product.name}: 재고 부족 (${currentStock}개 남음)`;

    // 재고 부족 상품 추가
    lowStockItems.push({
      name: product.name,
      stock: currentStock,
      message,
    });
  });

  return lowStockItems;
};

/**
 * 재고 업데이트
 * @param {string} productId - 상품 ID
 * @param {number} newStock - 새로운 재고 수량
 */
export const updateStock = (productId, newStock) => {
  productStore.updateStock(productId, newStock);
};

/**
 * 상품 재고 확인
 * @param {string} productId - 상품 ID
 * @param {number} requestedQuantity - 요청 수량
 * @returns {boolean} 재고 충분 여부
 */
export const checkStockAvailability = (productId, requestedQuantity) => {
  // 상품 존재 체크
  const product = productStore
    .getState()
    .products.find((p) => p.id === productId);
  return product && product.quantity >= requestedQuantity;
};
