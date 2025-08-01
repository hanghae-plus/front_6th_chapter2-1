import React from 'react';

import { CartItem } from './CartItem';
import { Product, CartItem as CartItemType } from '../types';
import { getProductById } from '../utils/productUtils';

interface CartContainerProps {
  cartItems: CartItemType[];
  products: Product[];
  onQuantityChange: (productId: string, change: number) => void;
  onRemoveItem: (productId: string) => void;
}

export const CartContainer: React.FC<CartContainerProps> = ({
  cartItems,
  products,
  onQuantityChange,
  onRemoveItem,
}) => (
  <div id='cart-items'>
    {cartItems.map((item) => {
      const product = getProductById(products, item.id);
      if (!product) return null;

      return (
        <CartItem
          key={item.id}
          item={item}
          product={product}
          onQuantityChange={onQuantityChange}
          onRemove={onRemoveItem}
        />
      );
    })}
  </div>
);
