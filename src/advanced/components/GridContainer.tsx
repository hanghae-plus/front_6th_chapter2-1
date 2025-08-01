import React from 'react';

import { LeftColumn } from './LeftColumn';
import { RightColumn } from './RightColumn';
import { Product, CartItem } from '../types';

interface GridContainerProps {
  products: Product[];
  cartItems: CartItem[];
  stockWarnings: Array<{
    productName: string;
    stock: number;
    isOutOfStock: boolean;
  }>;
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
  onAddToCart: (productId: string) => void;
  onQuantityChange: (productId: string, change: number) => void;
  onRemoveItem: (productId: string) => void;
}

export const GridContainer: React.FC<GridContainerProps> = ({
  products,
  cartItems,
  stockWarnings,
  cartTotals,
  bonusPoints,
  onAddToCart,
  onQuantityChange,
  onRemoveItem,
}) => (
  <div className='grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden'>
    <LeftColumn
      products={products}
      cartItems={cartItems}
      stockWarnings={stockWarnings}
      onAddToCart={onAddToCart}
      onQuantityChange={onQuantityChange}
      onRemoveItem={onRemoveItem}
    />
    <RightColumn
      cartItems={cartItems}
      products={products}
      cartTotals={cartTotals}
      bonusPoints={bonusPoints}
    />
  </div>
);
