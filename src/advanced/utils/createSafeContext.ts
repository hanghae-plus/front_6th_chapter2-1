import React, { createContext } from "react";

/**
 * Radix UI의 createSafeContext 패턴을 구현한 유틸리티
 * Context가 Provider 없이 사용될 때 명확한 에러 메시지를 제공
 */
export function createSafeContext<T>(displayName: string) {
  const Context = createContext<T | undefined>(undefined);
  Context.displayName = displayName;

  const useContext = () => {
    const context = React.useContext(Context);
    if (context === undefined) {
      throw new Error(`${displayName} must be used within a ${displayName}Provider`);
    }
    return context;
  };

  return [Context.Provider, useContext] as const;
}
