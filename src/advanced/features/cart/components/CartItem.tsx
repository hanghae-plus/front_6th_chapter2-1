import React from 'react';
import type { CartItem, Product } from '../../../shared/types';

interface CartItemProps {
  item: CartItem;
  product: Product;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export function CartItemComponent({
  item,
  product,
  onUpdateQuantity,
  onRemoveItem,
}: CartItemProps) {
  // 할인 아이콘 결정
  const discountIcon =
    product.isOnSale && product.isSuggestedSale
      ? '⚡💝'
      : product.isOnSale
        ? '⚡'
        : product.isSuggestedSale
          ? '💝'
          : '';

  // 가격 표시 결정
  const getPriceDisplay = () => {
    if (product.isOnSale || product.isSuggestedSale) {
      const colorClass =
        product.isOnSale && product.isSuggestedSale
          ? 'text-purple-600'
          : product.isOnSale
            ? 'text-red-500'
            : 'text-blue-500';

      return (
        <>
          <span className="line-through text-gray-400">
            ₩{product.originalPrice.toLocaleString()}
          </span>{' '}
          <span className={colorClass}>₩{product.price.toLocaleString()}</span>
        </>
      );
    }

    return `₩${product.price.toLocaleString()}`;
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div
      id={product.id}
      className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0"
    >
      {/* 상품 이미지 */}
      <div className="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>

      {/* 상품 정보 */}
      <div>
        <h3 className="text-base font-normal mb-1 tracking-tight">
          {discountIcon}
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p className="text-xs text-black mb-3">{getPriceDisplay()}</p>

        {/* 수량 조절 */}
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
        <div className="text-lg mb-2 tracking-tight tabular-nums">
          {getPriceDisplay()}
        </div>
        <button
          className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
          onClick={() => onRemoveItem(item.id)}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
