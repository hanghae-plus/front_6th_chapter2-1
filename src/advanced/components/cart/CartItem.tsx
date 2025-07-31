import React from 'react';
import { CartItem as CartItemType } from '../../types';
import ProductImage from './ProductImage';
import FormatPrice from '../../utils/formatPrice';
import QuantityControls from './QuantityControls';

interface CartItemProps {
  product: CartItemType;
  quantity?: number;
  onQuantityChange?: (productId: string, change: number) => void;
  onRemove?: (productId: string) => void;
}

export default function CartItem({
  product,
  quantity = 1,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  const saleIcon =
    product.onSale && product.suggestSale
      ? '⚡💝'
      : product.onSale
        ? '⚡'
        : product.suggestSale
          ? '💝'
          : '';

  const handleRemove = () => {
    if (onRemove) {
      onRemove(product.id);
    }
  };

  return (
    <div
      id={product.id}
      className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0"
    >
      <ProductImage />
      <div>
        <h3 className="text-base font-normal mb-1 tracking-tight">
          {saleIcon}
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p className="text-xs text-black mb-3">
          <FormatPrice product={product} />
        </p>
        <QuantityControls
          product={product}
          quantity={quantity}
          onQuantityChange={onQuantityChange}
        />
      </div>
      <div className="text-right">
        <div className="text-lg mb-2 tracking-tight tabular-nums">
          <FormatPrice product={product} />
        </div>
        <a
          className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
          data-product-id={product.id}
          onClick={handleRemove}
        >
          Remove
        </a>
      </div>
    </div>
  );
}
