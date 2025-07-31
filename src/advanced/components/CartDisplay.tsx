import React from 'react';

import { CartItem, Product } from '../types';

interface CartDisplayProps {
  cartItems: CartItem[];
  products: Product[];
  onUpdateQuantity: (productId: string, change: number) => void;
  onRemoveItem: (productId: string) => void;
  onUpdatePrices: () => void;
}

export const CartDisplay: React.FC<CartDisplayProps> = ({
  cartItems,
  products,
  onUpdateQuantity,
  onRemoveItem
}) => (
  // 원본과 동일하게 빈 장바구니일 때는 빈 div만 표시
  <div id="cart-items" data-testid="cart-items">
    {cartItems.map((item) => (
      <CartItemComponent
        key={item.productId}
        item={item}
        products={products}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
      />
    ))}
  </div>
);

interface CartItemComponentProps {
  item: CartItem;
  products: Product[];
  onUpdateQuantity: (productId: string, change: number) => void;
  onRemoveItem: (productId: string) => void;
}

const CartItemComponent: React.FC<CartItemComponentProps> = ({
  item,
  products,
  onUpdateQuantity,
  onRemoveItem
}) => {
  const product = products.find(p => p.id === item.productId);
  if (!product) return null;

  const getDisplayName = () => {
    if (product.onSale && product.suggestSale) {
      return `⚡💝${product.name}`;
    }
    if (product.onSale) {
      return `⚡${product.name}`;
    }
    if (product.suggestSale) {
      return `💝${product.name}`;
    }
    return product.name;
  };

  const getDisplayPrice = () => {
    if (product.onSale || product.suggestSale) {
      const colorClass = product.onSale && product.suggestSale 
        ? 'text-purple-600' 
        : product.onSale 
        ? 'text-red-500' 
        : 'text-blue-500';
      
      return (
        <>
          <span className="line-through text-gray-400">
            ₩{product.originalVal.toLocaleString()}
          </span>{' '}
          <span className={colorClass}>
            ₩{product.val.toLocaleString()}
          </span>
        </>
      );
    }
    return `₩${product.val.toLocaleString()}`;
  };

  return (
    <div id={item.productId} className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0">
      <div className="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>
      
      <div>
        <h3 className="text-base font-normal mb-1 tracking-tight">
          {getDisplayName()}
        </h3>
        <p className="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p className="text-xs text-black mb-3">
          {getDisplayPrice()}
        </p>
        <div className="flex items-center gap-4">
          <button
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
            data-product-id={item.productId}
            data-change="-1"
            onClick={() => onUpdateQuantity(item.productId, -1)}
          >
            −
          </button>
          <span className="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">
            {item.quantity}
          </span>
          <button
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
            data-product-id={item.productId}
            data-change="1"
            onClick={() => onUpdateQuantity(item.productId, 1)}
          >
            +
          </button>
        </div>
      </div>
      
      <div className="text-right">
        <div 
          className="text-lg mb-2 tracking-tight tabular-nums"
          style={{ fontWeight: item.quantity >= 10 ? 'bold' : 'normal' }}
        >
          {getDisplayPrice()}
        </div>
        <button
          className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
          data-product-id={item.productId}
          onClick={() => onRemoveItem(item.productId)}
        >
          Remove
        </button>
      </div>
    </div>
  );
}; 