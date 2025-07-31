import React, { useState } from 'react';
import { ProductSelectorProps } from '../../types';
import { PRODUCT_CONSTANTS } from '../../constants';
import { formatProductName, displayProductPriceText } from '../../utils/selectorUtils';

export const ProductSelector: React.FC<ProductSelectorProps> = ({ products, onProductSelect, onAddToCart }) => {
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const handleProductChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = event.target.value;
    setSelectedProductId(productId);
    onProductSelect(productId);
  };

  const handleAddToCart = () => {
    if (selectedProductId) {
      onAddToCart();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">상품 선택</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="product-select" className="block text-sm font-medium text-gray-700 mb-2">
            상품을 선택하세요
          </label>
          <select
            id="product-select"
            value={selectedProductId}
            onChange={handleProductChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">상품을 선택하세요</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {formatProductName(product)} - {displayProductPriceText(product)}
                {product.quantity > 0 ? ` (재고: ${product.quantity}개)` : ' (품절)'}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={
            !selectedProductId ||
            products.find((p) => p.id === selectedProductId)?.quantity === PRODUCT_CONSTANTS.OUT_OF_STOCK
          }
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          장바구니에 추가
        </button>
      </div>
    </div>
  );
};
