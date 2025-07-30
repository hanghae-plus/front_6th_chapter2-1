import productStore from "../store/product";

/**
 * 재고 관리 관련 비즈니스 로직을 담당하는 함수들
 */

/**
 * 재고 부족 상품 정보 가져오기
 * @returns {Array} 재고 부족 상품 정보 배열
 */
export const getLowStockItems = () => {
  const productList = productStore.getState().products;
  const lowStockItems = [];

  productList.forEach((product) => {
    const currentStock = product.q;

    if (currentStock < 5) {
      if (currentStock > 0) {
        lowStockItems.push({
          name: product.name,
          stock: currentStock,
          message: `${product.name}: 재고 부족 (${currentStock}개 남음)`,
        });
      } else {
        lowStockItems.push({
          name: product.name,
          stock: 0,
          message: `${product.name}: 품절`,
        });
      }
    }
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
  const product = productStore
    .getState()
    .products.find((p) => p.id === productId);
  return product && product.q >= requestedQuantity;
};
