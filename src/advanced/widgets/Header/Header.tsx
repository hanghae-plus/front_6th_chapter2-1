/**
 * 헤더 컴포넌트
 */

import React from 'react';
import { useCart } from '../../app/providers/CartProvider';

export const Header: React.FC = () => {
  const { itemCount } = useCart();

  return (
    <div className="mb-8">
      <h1 className="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
      <div className="text-5xl tracking-tight leading-none">Shopping Cart</div>
      <p id="item-count" className="text-sm text-gray-500 font-normal mt-3">🛍️ {itemCount} items in cart</p>
    </div>
  );
};