/**
 * 장바구니 개별 아이템 컴포넌트 - 기본과제 DOM 구조 유지
 */

import React from 'react';
import { useCart } from '../../app/providers/CartProvider';
import { CartItem as CartItemType } from '../../shared/types';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (change: number) => {
    updateQuantity(item.id, change);
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  // 할인 정보 생성 (기본과제와 동일)
  const getSaleInfo = () => {
    let saleIcon = '';
    let priceClass = '';
    let priceHTML = '';

    if (item.product.onSale && item.product.suggestSale) {
      saleIcon = '⚡💝';
      priceClass = 'text-purple-600';
    } else if (item.product.onSale) {
      saleIcon = '⚡';
      priceClass = 'text-red-500';
    } else if (item.product.suggestSale) {
      saleIcon = '💝';
      priceClass = 'text-blue-500';
    }

    if (item.product.onSale || item.product.suggestSale) {
      priceHTML = (
        <>
          <span className="line-through text-gray-400">₩{item.product.originalVal.toLocaleString()}</span>
          <span className={priceClass}>₩{item.product.val.toLocaleString()}</span>
        </>
      );
    } else {
      priceHTML = `₩${item.product.val.toLocaleString()}`;
    }

    return { saleIcon, priceHTML };
  };

  const { saleIcon, priceHTML } = getSaleInfo();

  return (
    <div 
      id={item.id}
      className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0"
    >
      {/* 상품 이미지 */}
      <div className="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>

      {/* 상품 정보 */}
      <div>
        <h3 className="text-base font-normal mb-1 tracking-tight">
          {saleIcon}{item.product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p className="text-xs text-black mb-3">{priceHTML}</p>
        <div className="flex items-center gap-4">
          <button 
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
            onClick={() => handleQuantityChange(-1)}
          >
            −
          </button>
          <span className="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">
            {item.quantity}
          </span>
          <button 
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
            onClick={() => handleQuantityChange(1)}
          >
            +
          </button>
        </div>
      </div>

      {/* 가격 및 삭제 */}
      <div className="text-right">
        <div className="text-lg mb-2 tracking-tight tabular-nums">{priceHTML}</div>
        <a 
          className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
          onClick={handleRemove}
        >
          Remove
        </a>
      </div>
    </div>
  );
};