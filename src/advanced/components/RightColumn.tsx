import React from 'react';

import { OrderSummary } from './OrderSummary';
import { Product, CartItem } from '../types';

interface RightColumnProps {
  cartItems: CartItem[];
  products: Product[];
  cartTotals: {
    subtotal: number;
    finalTotal: number;
    itemCount: number;
    totalDiscountRate: number;
    savedAmount: number;
    itemDiscounts: Array<{ name: string; discount: number }>;
    bulkDiscountRate: number;
    isTuesday: boolean;
  };
  bonusPoints: {
    points: number;
    details: string[];
  };
}

export const RightColumn: React.FC<RightColumnProps> = ({
  cartItems,
  products,
  cartTotals,
  bonusPoints,
}) => (
  <div className='bg-black text-white p-8 flex flex-col'>
    <OrderSummary
      cartItems={cartItems}
      products={products}
      cartTotals={cartTotals}
      bonusPoints={bonusPoints}
    />
  </div>
);
