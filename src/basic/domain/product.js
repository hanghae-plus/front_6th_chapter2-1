/** 상품 전체 재고 수량 합계 반환 */
export const getTotalStock = (productList) => {
  return productList.reduce((totalStock, currentProduct) => totalStock + currentProduct.q, 0);
};
