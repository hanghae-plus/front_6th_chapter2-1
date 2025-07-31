import React from 'react';
import { CartItem } from '../types';
import { UI_CONSTANTS } from '../constants';
import { getCartItemFontWeight } from '../utils';

interface CartItemPriceProps {
  item: CartItem;
  priceDisplay: string;
  onRemove: (productId: string) => void;
}

/**
 * 장바구니 아이템 가격 및 제거 버튼 컴포넌트
 */
export const CartItemPrice: React.FC<CartItemPriceProps> = ({ 
  item, 
  priceDisplay, 
  onRemove 
}) => {
  return (
    <div className="text-right">
      <div 
        className="text-lg mb-2 tracking-tight tabular-nums"
        dangerouslySetInnerHTML={{ __html: priceDisplay }}
        style={{ fontWeight: getCartItemFontWeight(item.quantity) }}
      />
      <a
        className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
        data-product-id={item.id}
        onClick={() => onRemove(item.id)}
      >
        {UI_CONSTANTS.TEXT.REMOVE}
      </a>
    </div>
  );
}; 