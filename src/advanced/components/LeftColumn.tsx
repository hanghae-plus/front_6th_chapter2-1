import React from 'react';

import { CartContainer } from './CartContainer';
import { ProductSelector } from './ProductSelector';
import { Product, CartItem } from '../types';

interface LeftColumnProps {
  products: Product[];
  cartItems: CartItem[];
  stockWarnings: Array<{
    productName: string;
    stock: number;
    isOutOfStock: boolean;
  }>;
  onAddToCart: (productId: string) => void;
  onQuantityChange: (productId: string, change: number) => void;
  onRemoveItem: (productId: string) => void;
}

export const LeftColumn: React.FC<LeftColumnProps> = ({
  products,
  cartItems,
  stockWarnings,
  onAddToCart,
  onQuantityChange,
  onRemoveItem,
}) => (
  <div className='bg-white border border-gray-200 p-8 overflow-y-auto'>
    <ProductSelector
      products={products}
      onAddToCart={onAddToCart}
      stockWarnings={stockWarnings}
    />
    <CartContainer
      cartItems={cartItems}
      products={products}
      onQuantityChange={onQuantityChange}
      onRemoveItem={onRemoveItem}
    />
  </div>
);
