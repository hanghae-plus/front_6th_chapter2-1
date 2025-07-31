import React from 'react';
import { Product } from '../../types';

interface ProductOptionProps {
  product: Product;
}

export default function ProductOption({ product }: ProductOptionProps) {
  const isDisabled = product.quantity === 0;
  const saleIcon =
    product.onSale && product.suggestSale
      ? '⚡💝'
      : product.onSale
        ? '⚡'
        : product.suggestSale
          ? '💝'
          : '';

  if (isDisabled) {
    return (
      <option value={product.id} disabled className="text-gray-400">
        {product.name} - {product.price}원 (품절)
      </option>
    );
  }

  if (product.onSale || product.suggestSale) {
    const discountText =
      product.onSale && product.suggestSale
        ? '25% SUPER SALE!'
        : product.onSale
          ? '20% SALE!'
          : '5% 추천할인!';
    const textColor =
      product.onSale && product.suggestSale
        ? 'text-purple-600 font-bold'
        : product.onSale
          ? 'text-red-500 font-bold'
          : 'text-blue-500 font-bold';

    return (
      <option value={product.id} className={textColor}>
        {saleIcon}
        {product.name} - {product.originalPrice}원 → {product.price}원 (
        {discountText})
      </option>
    );
  }

  return (
    <option value={product.id}>
      {product.name} - {product.price}원
    </option>
  );
}
