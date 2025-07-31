import React from 'react';
import { CartItem } from '../types';
import { createCartItemSummary } from '../utils';

interface CartItemSummaryProps {
  item: CartItem;
}

/**
 * 개별 장바구니 아이템 요약 컴포넌트
 */
export const CartItemSummary: React.FC<CartItemSummaryProps> = ({ item }) => {
  const itemSummary = createCartItemSummary(item);
  
  return (
    <div className="flex justify-between text-xs tracking-wide text-gray-400">
      <span>{itemSummary.name} x {itemSummary.quantity}</span>
      <span>₩{itemSummary.total.toLocaleString()}</span>
    </div>
  );
}; 