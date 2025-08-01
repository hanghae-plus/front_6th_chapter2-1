import React from 'react';
import { Product } from '../../../shared/types';

interface ProductSelectProps {
  products: Product[];
  selectedProductId: string;
  onProductChange: (productId: string) => void;
}

export function ProductSelect({
  products,
  selectedProductId,
  onProductChange,
}: ProductSelectProps) {
  const getOptionText = (product: Product): string => {
    let discountText = '';
    if (product.isOnSale) discountText += ' ⚡SALE';
    if (product.isSuggestedSale) discountText += ' 💝추천';

    // 품절 상품
    if (product.stock === 0) {
      return `${product.name} - ${product.price}원 (품절)${discountText}`;
    }

    // 번개세일 + 추천할인
    if (product.isOnSale && product.isSuggestedSale) {
      return `⚡💝${product.name} - ${product.originalPrice}원 → ${product.price}원${discountText}`;
    }

    // 번개세일만
    if (product.isOnSale) {
      return `⚡${product.name} - ${product.originalPrice}원 → ${product.price}원${discountText}`;
    }

    // 추천할인만
    if (product.isSuggestedSale) {
      return `💝${product.name} - ${product.originalPrice}원 → ${product.price}원${discountText}`;
    }

    // 일반 상품
    return `${product.name} - ${product.price}원${discountText}`;
  };

  const getOptionClassName = (product: Product): string => {
    if (product.stock === 0) return 'text-gray-400';
    if (product.isOnSale && product.isSuggestedSale)
      return 'text-red-600 font-bold';
    if (product.isOnSale) return 'text-red-600 font-bold';
    if (product.isSuggestedSale) return 'text-blue-600 font-bold';
    return '';
  };

  return (
    <select
      id="product-select"
      className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
      value={selectedProductId}
      onChange={(e) => onProductChange(e.target.value)}
    >
      <option value="">상품을 선택하세요</option>
      {products.map((product) => (
        <option
          key={product.id}
          value={product.id}
          disabled={product.stock === 0}
          className={getOptionClassName(product)}
        >
          {getOptionText(product)}
        </option>
      ))}
    </select>
  );
}
