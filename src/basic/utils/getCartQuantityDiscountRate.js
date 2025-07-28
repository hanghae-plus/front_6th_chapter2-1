export const getCartQuantityDiscountRate = (quantity) => {
  return quantity >= 30 ? 0.25 : 0;
};
