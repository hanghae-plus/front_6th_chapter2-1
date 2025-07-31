import { useMemo } from 'react';

import type { CartItem } from '../lib/orderSummaryUtils';
import { calculateOrderSummary } from '../lib/orderSummaryUtils';
import type { Product } from '../types/header';

export function useOrderSummary(products: Product[], cartItems: CartItem[]) {
  return useMemo(() => calculateOrderSummary(products, cartItems), [products, cartItems]);
}
