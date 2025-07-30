import { createContext } from 'react';
import type { CartContextType } from '../types/cart';

export const cartContext = createContext<CartContextType | undefined>(
  undefined
);
