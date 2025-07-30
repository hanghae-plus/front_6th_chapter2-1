/**
 * Product State - Simple React-like State Management
 */

export let productState = {
  point: 0,
  amount: 0,
  itemCount: 0,
  lastSelectedProduct: null,
  products: [],
};

export const setProductState = updates => {
  productState = { ...productState, ...updates };
};
