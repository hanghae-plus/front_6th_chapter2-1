/**
 * 상품 ID로 상품 찾기
 * @param {Array} productList
 * @param {string} productId
 */
export function findProductById(productList, productId) {
  return productList.find((p) => p.productId === productId) ?? null;
}
