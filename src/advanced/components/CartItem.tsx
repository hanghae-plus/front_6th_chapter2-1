// src/advanced/components/CartItem.tsx
import React from 'react';
import { CartItem as CartItemType, Product } from '../types';
import { useCart } from '../hooks/useCart';

interface CartItemProps {
  item: CartItemType;
  product: Product;
}

export function CartItem({ item, product }: CartItemProps) {
  const { dispatch } = useCart();
  const subtotal = product.val * item.quantity;

  const handleQuantityChange = (change: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId: product.id, change } });
  };

  const handleRemoveItem = () => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId: product.id } });
  };

  let priceDisplay;
  let nameDisplay = product.name;

  if (product.onSale && product.suggestSale) {
    priceDisplay = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-purple-600">₩${product.val.toLocaleString()}</span>`;
    nameDisplay = `⚡💝${product.name}`;
  } else if (product.onSale) {
    priceDisplay = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-red-500">₩${product.val.toLocaleString()}</span>`;
    nameDisplay = `⚡${product.name}`;
  } else if (product.suggestSale) {
    priceDisplay = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-blue-500">₩${product.val.toLocaleString()}</span>`;
    nameDisplay = `💝${product.name}`;
  } else {
    priceDisplay = `₩${product.val.toLocaleString()}`;
  }

  return (
    <div id={product.id} className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0">
      <div className="w-20 h-20 bg-gradient-black relative overflow-hidden rounded-lg">
        <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>
      <div>
        <h3 className="text-base font-normal mb-1 tracking-tight">{nameDisplay}</h3>
        <p className="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p className="text-lg text-black mb-3" dangerouslySetInnerHTML={{ __html: priceDisplay }}></p>
        <div className="flex items-center gap-4">
          <button onClick={() => handleQuantityChange(-1)} className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id={product.id} data-change="-1">−</button>
          <span className="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">{item.quantity}</span>
          <button onClick={() => handleQuantityChange(1)} className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id={product.id} data-change="1">+</button>
        </div>
      </div>
      <div className="text-right">
        <div className="text-lg mb-2 tracking-tight tabular-nums">₩{subtotal.toLocaleString()}</div>
        <button onClick={handleRemoveItem} className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id={product.id}>Remove</button>
      </div>
    </div>
  );
}
