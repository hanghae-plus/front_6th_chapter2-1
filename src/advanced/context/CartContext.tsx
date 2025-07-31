// src/advanced/context/CartContext.tsx
import React, { createContext, useReducer, Dispatch, ReactNode } from 'react';
import { cartReducer, State, Action, initialState } from '../state/cartReducer';

interface CartContextType {
  state: State;
  dispatch: Dispatch<Action>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}
