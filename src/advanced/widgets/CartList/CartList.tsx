/**
 * 장바구니 목록 컴포넌트 - 기본과제 DOM 구조 유지
 */

import React from 'react';
import { useCart } from '../../app/providers/CartProvider';
import { CartItem } from './CartItem';

export const CartList: React.FC = () => {
  const { cartItems } = useCart();

  return (
    <div id="cart-items">
      {cartItems.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
    </div>
  );
};