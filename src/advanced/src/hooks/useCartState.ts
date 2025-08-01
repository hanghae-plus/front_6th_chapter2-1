import { useState } from 'react';
import { CartState } from '../types/cart';

const initialState: CartState = {
  cartItems: [],
  lastSelectedProduct: null,
  totals: { itemCnt: 0, amount: 0, discountRate: 0 },
};

export const useCartState = () => {
  const [cartState, setCartState] = useState<CartState>(initialState);

  return {
    cartState,
    setCartState,
  };
};
