/**
 * Cart State - Simple React-like State Management
 */

export let cartState = {
  items: [],
  totalAmount: 0,
  totalItemCount: 0,
};

export const setCartState = updates => {
  cartState = { ...cartState, ...updates };
};

// 끝!
