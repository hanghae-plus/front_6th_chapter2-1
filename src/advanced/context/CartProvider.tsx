import React, { type ReactNode, useCallback, useReducer } from "react";
import { CartContextProvider, cartReducer, initialCartState } from "./CartContext";

// Provider 컴포넌트
interface CartProviderProps {
  children?: ReactNode;
}

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  const contextValue = useCallback(() => ({ state, dispatch }), [state, dispatch]);

  return <CartContextProvider value={contextValue()}>{children}</CartContextProvider>;
};

export { CartProvider };
