import React from 'react';

import { Product, CartItem as CartItemType } from '../types';

interface CartItemProps {
  item: CartItemType;
  product: Product;
  onQuantityChange: (productId: string, change: number) => void;
  onRemove: (productId: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  product,
  onQuantityChange,
  onRemove,
}) => {
  const getPriceDisplay = () => {
    if (product.onSale || product.suggestSale) {
      const colorClass =
        product.onSale && product.suggestSale
          ? 'text-purple-600'
          : product.onSale
            ? 'text-red-500'
            : 'text-blue-500';

      return (
        <>
          <span className='line-through text-gray-400'>
            ₩{product.originalVal.toLocaleString()}
          </span>{' '}
          <span className={colorClass}>₩{product.val.toLocaleString()}</span>
        </>
      );
    }
    return `₩${product.val.toLocaleString()}`;
  };

  const getProductName = () => {
    let prefix = '';
    if (product.onSale && product.suggestSale) {
      prefix = '⚡💝';
    } else if (product.onSale) {
      prefix = '⚡';
    } else if (product.suggestSale) {
      prefix = '💝';
    }
    return `${prefix}${product.name}`;
  };

  return (
    <div
      id={product.id}
      className='grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0'
    >
      <div className='w-20 h-20 bg-gradient-black relative overflow-hidden'>
        <div className='absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45'></div>
      </div>
      <div>
        <h3 className='text-base font-normal mb-1 tracking-tight'>
          {getProductName()}
        </h3>
        <p className='text-xs text-gray-500 mb-0.5 tracking-wide'>PRODUCT</p>
        <p className='text-xs text-black mb-3'>{getPriceDisplay()}</p>
        <div className='flex items-center gap-4'>
          <button
            className='quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white'
            onClick={() => onQuantityChange(product.id, -1)}
          >
            −
          </button>
          <span className='quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums'>
            {item.quantity}
          </span>
          <button
            className='quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white'
            onClick={() => onQuantityChange(product.id, 1)}
          >
            +
          </button>
        </div>
      </div>
      <div className='text-right'>
        <div className='text-lg mb-2 tracking-tight tabular-nums'>
          {getPriceDisplay()}
        </div>
        <a
          className='remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black'
          onClick={() => onRemove(product.id)}
        >
          Remove
        </a>
      </div>
    </div>
  );
};
