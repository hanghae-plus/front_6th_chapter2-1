import { ReactNode, Dispatch, createContext, useContext, useReducer } from 'react';

import type { Action, State } from '../reducer';
import { reducer, initialState } from '../reducer';

const CartStateContext = createContext<State | undefined>(undefined);
const CartDispatchContext = createContext<Dispatch<Action> | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <CartStateContext.Provider value={state}>
      <CartDispatchContext.Provider value={dispatch}>{children}</CartDispatchContext.Provider>
    </CartStateContext.Provider>
  );
}

export function useCartState() {
  return useContext(CartStateContext);
}

export function useCartDispatch() {
  return useContext(CartDispatchContext);
}
