import React from 'react';

import { CartItem, Product } from '../types';
import { findProductByCartItem } from '../utils';

interface CartDisplayProps {
  cartItems: CartItem[];
  products: Product[];
  handleQuantityUpdate: (productId: string, change: number) => void;
  handleItemRemove: (productId: string) => void;
  handlePriceUpdate: () => void;
}

export const CartDisplay: React.FC<CartDisplayProps> = ({
  cartItems,
  products,
  handleQuantityUpdate,
  handleItemRemove
}) => (
  // 원본과 동일하게 빈 장바구니일 때는 빈 div만 표시
  <div id="cart-items" data-testid="cart-items">
    {cartItems.map((item) => (
              <CartItemComponent
          key={item.productId}
          item={item}
          products={products}
          handleQuantityUpdate={handleQuantityUpdate}
          handleItemRemove={handleItemRemove}
        />
    ))}
  </div>
);

interface CartItemComponentProps {
  item: CartItem;
  products: Product[];
  handleQuantityUpdate: (productId: string, change: number) => void;
  handleItemRemove: (productId: string) => void;
}

const CartItemComponent: React.FC<CartItemComponentProps> = ({
  item,
  products,
  handleQuantityUpdate,
  handleItemRemove
}) => {
  const product = findProductByCartItem(products, item);
  if (!product) return null;

  const getProductDisplayName = () => {
    if (product.hasLightningDiscount && product.hasRecommendationDiscount) {
      return `⚡💝${product.name}`;
    }
    if (product.hasLightningDiscount) {
      return `⚡${product.name}`;
    }
    if (product.hasRecommendationDiscount) {
      return `💝${product.name}`;
    }
    return product.name;
  };

  const getProductDisplayPrice = () => {
    if (product.hasLightningDiscount || product.hasRecommendationDiscount) {
      const colorClass = product.hasLightningDiscount && product.hasRecommendationDiscount 
        ? 'text-purple-600' 
        : product.hasLightningDiscount 
        ? 'text-red-500' 
        : 'text-blue-500';
      
      return (
        <>
          <span className="line-through text-gray-400">
            ₩{product.originalPrice.toLocaleString()}
          </span>{' '}
          <span className={colorClass}>
            ₩{product.price.toLocaleString()}
          </span>
        </>
      );
    }
    return `₩${product.price.toLocaleString()}`;
  };

  return (
    <div id={item.productId} className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0">
      <div className="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>
      
      <div>
        <h3 className="text-base font-normal mb-1 tracking-tight">
          {getProductDisplayName()}
        </h3>
        <p className="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p className="text-xs text-black mb-3">
          {getProductDisplayPrice()}
        </p>
        <div className="flex items-center gap-4">
          <button
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
            data-product-id={item.productId}
            data-change="-1"
            onClick={() => handleQuantityUpdate(item.productId, -1)}
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
            onClick={() => handleQuantityUpdate(item.productId, 1)}
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
          {getProductDisplayPrice()}
        </div>
        <button
          className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
          data-product-id={item.productId}
          onClick={() => handleItemRemove(item.productId)}
        >
          Remove
        </button>
      </div>
    </div>
  );
}; 