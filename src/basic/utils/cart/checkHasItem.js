export const checkHasItem = (productId, prodList) => {
  return prodList.some((product) => product.id === productId);
};
