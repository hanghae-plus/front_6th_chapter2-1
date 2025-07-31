import React from 'react';
import { CartItem } from '../types/index.js';
import { createCartItemPriceDisplay } from '../utils/index.js';
import { CartItemImage } from './CartItemImage.js';
import { CartItemInfo } from './CartItemInfo.js';
import { CartItemControls } from './CartItemControls.js';
import { CartItemPrice } from './CartItemPrice.js';

interface CartItemListProps {
  items: CartItem[];
  onQuantityChange: (productId: string, change: number) => void;
  onRemove: (productId: string) => void;
}

/**
 * 장바구니 아이템 리스트 컴포넌트
 */
export const CartItemList: React.FC<CartItemListProps> = ({
  items,
  onQuantityChange,
  onRemove,
}) => {
  const renderCartItem = (item: CartItem) => {
    const priceDisplay = createCartItemPriceDisplay(item);

    return (
      <div
        key={item.id}
        id={item.id}
        className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0"
      >
        <CartItemImage />
        
        <div>
          <CartItemInfo item={item} priceDisplay={priceDisplay} />
          <CartItemControls item={item} onQuantityChange={onQuantityChange} />
        </div>
        
        <CartItemPrice 
          item={item} 
          priceDisplay={priceDisplay} 
          onRemove={onRemove} 
        />
      </div>
    );
  };

  return <div id="cart-items">{items.map(renderCartItem)}</div>;
};