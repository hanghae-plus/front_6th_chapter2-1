import React, { type ReactNode, useCallback, useReducer } from "react";
import { UIContextProvider, initialUIState, uiReducer } from "./UIContext";

// Provider 컴포넌트
interface UIProviderProps {
  children?: ReactNode;
}

const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, initialUIState);

  const contextValue = useCallback(() => ({ state, dispatch }), [state, dispatch]);

  return <UIContextProvider value={contextValue()}>{children}</UIContextProvider>;
};

export { UIProvider };
