/* eslint-disable react-refresh/only-export-components */
import { render, RenderOptions } from '@testing-library/react';
import React from 'react';
import { AppProvider } from './context/AppContext';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
}

interface Props {
  children: React.ReactNode;
}

const AllTheProviders = ({ children }: Props) => {
  return <AppProvider>{children}</AppProvider>;
};

const customRender = (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { wrapper: Wrapper = AllTheProviders, ...renderOptions } = options;

  return render(ui, {
    wrapper: Wrapper,
    ...renderOptions
  });
};

export * from '@testing-library/react';
export { customRender as render };
