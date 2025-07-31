import React, { type ReactNode, createElement } from "react";

type ProviderType<
  T extends React.ElementType = React.FunctionComponent,
  P = React.ComponentPropsWithoutRef<T>,
> = [T, P];

interface MultiProviderProps {
  providers: ProviderType[];
  children: ReactNode;
}

const MultiProvider: React.FC<MultiProviderProps> = ({ providers, children }) => {
  return (
    <>
      {providers.reduceRight((children, [Provider, props]) => {
        return createElement(Provider, props, children);
      }, children)}
    </>
  );
};

export default MultiProvider;
