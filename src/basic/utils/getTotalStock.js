export const getTotalStock = (productList) => {
  return productList.reduce((acc, product) => acc + product.quantity, 0);
};
