export const getTotalStock = (productList) => {
  return productList.reduce((acc, product) => acc + product.q, 0);
};
