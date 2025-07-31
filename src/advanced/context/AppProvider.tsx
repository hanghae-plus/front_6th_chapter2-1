import React, { type ReactNode } from "react";
import { CartProvider } from "./CartProvider";
import { HelpModalProvider } from "./HelpModalProvider";
import MultiProvider from "./MultiProvider";
import { ProductProvider } from "./ProductProvider";
import { UIProvider } from "./UIProvider";

// 통합 Provider 컴포넌트
interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <MultiProvider
      providers={[
        [UIProvider, {}],
        [ProductProvider, {}],
        [CartProvider, {}],
        [HelpModalProvider, {}],
      ]}
    >
      {children}
    </MultiProvider>
  );
};

export default AppProvider;
