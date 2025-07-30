import { useReducer, useEffect, type ReactNode } from 'react';
import { cartReducer, initialCartState } from './cartReducer';
import { CartContext } from './CartContext';
import { setProductUpdateCallback } from '../../services/saleService';

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartState, dispatch] = useReducer(cartReducer, initialCartState);
  
  useEffect(() => {
    setProductUpdateCallback(() => {
      dispatch({ type: 'UPDATE_PRICES' });
    });
  }, []);
  
  return (
    <CartContext.Provider value={{ state: cartState, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}
