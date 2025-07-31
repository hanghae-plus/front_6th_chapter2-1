// src/advanced/components/CartList.tsx
import React from 'react';
import { useCart } from '../hooks/useCart';
import { CartItem } from './CartItem';

export function CartList() {
  const { state } = useCart();
  const { cart, products } = state;

  return (
    <div id="cart-items">
      {cart.map(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return null;
        return <CartItem key={item.id} item={item} product={product} />;
      })}
    </div>
  );
}
