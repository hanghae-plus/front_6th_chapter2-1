import { useReducer, type ReactNode } from 'react';
import { cartReducer, initialCartState } from './cartReducer';
import { CartContext } from './CartContext';

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartState, dispatch] = useReducer(cartReducer, initialCartState);
  return (
    <CartContext.Provider value={{ state: cartState, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}
