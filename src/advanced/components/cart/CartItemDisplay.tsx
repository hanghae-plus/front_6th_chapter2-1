import React from 'react';

import { Product } from '@/types/product';

interface CartItemDisplayProps {
  product: Product;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

const CartItemDisplay: React.FC<CartItemDisplayProps> = ({ product, quantity, onIncrease, onDecrease, onRemove }) => {
  return (
    <div className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0">
      <div className="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45" />
      </div>
      <div>
        <h3 className="text-base font-normal mb-1 tracking-tight">
          {product.onSale && product.suggestSale ? (
            <span className="text-purple-600 font-bold">⚡💝{product.name}</span>
          ) : product.onSale ? (
            <span className="text-red-500 font-bold">⚡{product.name}</span>
          ) : product.suggestSale ? (
            <span className="text-blue-500 font-bold">💝{product.name}</span>
          ) : (
            product.name
          )}
        </h3>
        <p className="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p className="text-xs mb-3">
          {product.discountPrice !== product.price ? (
            <>
              <span className="line-through text-gray-400 mr-1">₩{product.price.toLocaleString()}</span>
              <span className="text-black font-bold">₩{product.discountPrice.toLocaleString()}</span>
            </>
          ) : (
            <span className="text-black">₩{product.price.toLocaleString()}</span>
          )}
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={onDecrease}
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
            disabled={quantity <= 1}
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            onClick={onIncrease}
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
            disabled={quantity >= product.quantity}
          >
            +
          </button>
        </div>
      </div>
      <div className="text-right">
        <div className="text-lg mb-2 tracking-tight tabular-nums">
          {product.discountPrice !== product.price ? (
            <>
              <span className="line-through text-gray-400 mr-1">₩{(product.price * quantity).toLocaleString()}</span>
              {product.onSale && product.suggestSale ? (
                <span className="text-purple-600">₩{(product.discountPrice * quantity).toLocaleString()}</span>
              ) : product.onSale ? (
                <span className="text-red-500">₩{(product.discountPrice * quantity).toLocaleString()}</span>
              ) : product.suggestSale ? (
                <span className="text-blue-500">₩{(product.discountPrice * quantity).toLocaleString()}</span>
              ) : (
                <span>₩{(product.discountPrice * quantity).toLocaleString()}</span>
              )}
            </>
          ) : (
            <span>₩{(product.price * quantity).toLocaleString()}</span>
          )}
        </div>
        <button
          onClick={onRemove}
          className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItemDisplay;
