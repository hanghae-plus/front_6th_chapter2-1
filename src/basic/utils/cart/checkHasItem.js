/**
 * 상품 존재 체크
 * @param {string} productId - 상품 ID
 * @param {Array} prodList - 상품 리스트
 * @returns {boolean} 상품 존재 여부
 */
export const checkHasItem = (productId, prodList) => {
  return prodList.some((product) => product.id === productId);
};
