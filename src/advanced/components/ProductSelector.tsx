import React, { useState } from 'react';

import { Product } from '../types';
import {
  getProductDisplayText,
  getProductDisplayClassName,
  getTotalStock,
} from '../utils/productUtils';

interface ProductSelectorProps {
  products: Product[];
  onAddToCart: (productId: string) => void;
  stockWarnings: Array<{
    productName: string;
    stock: number;
    isOutOfStock: boolean;
  }>;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  products,
  onAddToCart,
  stockWarnings,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const totalStock = getTotalStock(products);

  const handleAddToCart = () => {
    if (!selectedProductId) return;
    onAddToCart(selectedProductId);
  };

  const getStockMessage = () =>
    stockWarnings
      .map((warning) =>
        warning.isOutOfStock
          ? `${warning.productName}: 품절`
          : `${warning.productName}: 재고 부족 (${warning.stock}개 남음)`,
      )
      .join('\n');

  return (
    <div className='mb-6 pb-6 border-b border-gray-200'>
      <select
        id='product-select'
        className='w-full p-3 border border-gray-300 rounded-lg text-base mb-3'
        style={{ borderColor: totalStock < 50 ? 'orange' : '' }}
        value={selectedProductId}
        onChange={(e) => setSelectedProductId(e.target.value)}
      >
        <option value=''>상품을 선택하세요</option>
        {products.map((product) => (
          <option
            key={product.id}
            value={product.id}
            disabled={product.availableStock === 0}
            className={getProductDisplayClassName(product)}
          >
            {getProductDisplayText(product)}
          </option>
        ))}
      </select>
      <button
        id='add-to-cart'
        className='w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all'
        onClick={handleAddToCart}
        disabled={!selectedProductId}
      >
        Add to Cart
      </button>
      <div
        id='stock-status'
        className='text-xs text-red-500 mt-3 whitespace-pre-line'
      >
        {getStockMessage()}
      </div>
    </div>
  );
};
