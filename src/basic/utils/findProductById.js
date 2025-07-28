// productList에서 특정 id와 일치하는 상품 객체 반환
export const findProductById = (productList, id) => {
  return productList.find((product) => product.id === id) || null;
};
