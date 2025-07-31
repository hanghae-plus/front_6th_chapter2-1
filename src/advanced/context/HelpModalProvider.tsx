import React, { type ReactNode, useCallback, useReducer } from "react";
import {
  HelpModalContextProvider,
  helpModalReducer,
  initialHelpModalState,
} from "./HelpModalContext";

// Provider 컴포넌트
interface HelpModalProviderProps {
  children?: ReactNode;
}

const HelpModalProvider: React.FC<HelpModalProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(helpModalReducer, initialHelpModalState);

  const contextValue = useCallback(() => ({ state, dispatch }), [state, dispatch]);

  return <HelpModalContextProvider value={contextValue()}>{children}</HelpModalContextProvider>;
};

export { HelpModalProvider };
