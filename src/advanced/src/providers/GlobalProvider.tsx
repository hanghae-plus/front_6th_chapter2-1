import React, { createContext, useReducer } from 'react';
import type { State, Action } from './GlobalReducer';
import { reducer, initialState } from './GlobalReducer';

const StateContext = createContext<State | undefined>(undefined);
const DispatchContext = createContext<React.Dispatch<Action> | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export { StateContext, DispatchContext };
