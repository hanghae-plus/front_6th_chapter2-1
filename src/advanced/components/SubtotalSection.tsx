import React from 'react';
import { CartItem } from '../types';
import { UI_CONSTANTS } from '../constants';

interface SubtotalSectionProps {
  items: CartItem[];
}

/**
 * Subtotal 섹션 컴포넌트
 */
export const SubtotalSection: React.FC<SubtotalSectionProps> = ({ items }) => {
  const subtotal = items.reduce((acc, item) => {
    const itemSummary = { name: item.name, quantity: item.quantity, total: item.price * item.quantity };
    return acc + itemSummary.total;
  }, 0);

  if (subtotal <= 0) return null;

  return (
    <>
      <div className="border-t border-white/10 my-3"></div>
      <div className="flex justify-between text-sm tracking-wide">
        <span>{UI_CONSTANTS.TEXT.SUBTOTAL}</span>
        <span>₩{subtotal.toLocaleString()}</span>
      </div>
    </>
  );
}; 