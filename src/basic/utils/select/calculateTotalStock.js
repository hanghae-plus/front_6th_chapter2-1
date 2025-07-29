/**
 * 상품 리스트의 총 재고 수량을 계산하는 함수
 * @param {*} prodList 상품 리스트
 * @returns 총 재고 수량
 */
export const calculateTotalStock = (prodList) => {
  return prodList.reduce((total, product) => total + product.q, 0);
};
