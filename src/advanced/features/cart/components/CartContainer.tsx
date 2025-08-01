import React from 'react';
import type { CartItem, Product } from '../../../shared/types';
import { CartItemComponent } from './CartItem';

interface CartContainerProps {
  cartItems: CartItem[];
  getProductById: (id: string) => Product | undefined;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export function CartContainer({
  cartItems,
  getProductById,
  onUpdateQuantity,
  onRemoveItem,
}: CartContainerProps) {
  if (cartItems.length === 0) {
    return (
      <div id="cart-items">
        <p className="text-gray-500 text-center py-8">🛍️ 0 items in cart</p>
      </div>
    );
  }

  return (
    <div id="cart-items">
      {cartItems.map((item) => {
        const product = getProductById(item.id);
        if (!product) return null;

        return (
          <CartItemComponent
            key={item.id}
            item={item}
            product={product}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
          />
        );
      })}
    </div>
  );
}
