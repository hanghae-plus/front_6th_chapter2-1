import React from 'react';
import { Product } from '../../types';

interface CartProductPriceProps {
  product: Product;
}

export const CartProductPrice: React.FC<CartProductPriceProps> = ({ product }) => {
  if (product.lightningSale && product.originalPrice) {
    return (
      <span>
        <span className="line-through text-gray-500 text-sm">{product.originalPrice.toLocaleString()}원</span>
        <span className="text-red-600 font-bold ml-2">{product.price.toLocaleString()}원</span>
      </span>
    );
  }

  return <span>{product.price.toLocaleString()}원</span>;
};
