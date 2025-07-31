import React from 'react';
import { CartItem } from '../types';

interface CartItemControlsProps {
  item: CartItem;
  onQuantityChange: (productId: string, change: number) => void;
}

/**
 * 장바구니 아이템 수량 조절 컴포넌트
 */
export const CartItemControls: React.FC<CartItemControlsProps> = ({ 
  item, 
  onQuantityChange 
}) => {
  return (
    <div className="flex items-center gap-4">
      <button
        className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
        data-product-id={item.id}
        data-change="-1"
        onClick={() => onQuantityChange(item.id, -1)}
      >
        −
      </button>
      <span className="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">
        {item.quantity}
      </span>
      <button
        className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
        data-product-id={item.id}
        data-change="1"
        onClick={() => onQuantityChange(item.id, 1)}
      >
        +
      </button>
    </div>
  );
}; 