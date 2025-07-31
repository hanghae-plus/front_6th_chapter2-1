import React from 'react';
import { Product } from '../types';
import { UI_CONSTANTS } from '../constants';
import { 
  createProductOptionText, 
  getProductOptionStyleClass 
} from '../utils';

interface ProductSelectProps {
  products: Product[];
  selectedProductId: string;
  onProductSelect: (productId: string) => void;
  onAddToCart: () => void;
  stockStatus: string;
}

/**
 * 상품 선택 컴포넌트
 */
export const ProductSelect: React.FC<ProductSelectProps> = ({
  products,
  selectedProductId,
  onProductSelect,
  onAddToCart,
  stockStatus,
}) => {

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select
        id="product-select"
        value={selectedProductId}
        onChange={(e) => onProductSelect(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
      >
        {products.map((product) => (
          <option
            key={product.id}
            value={product.id}
            disabled={product.stock === 0}
            className={getProductOptionStyleClass(product)}
          >
            {createProductOptionText(product)}
          </option>
        ))}
      </select>
      <button
        id="add-to-cart"
        onClick={onAddToCart}
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
      >
        {UI_CONSTANTS.TEXT.ADD_TO_CART}
      </button>
      <div
        id="stock-status"
        className="text-xs text-red-500 mt-3 whitespace-pre-line"
        style={{ display: stockStatus ? 'block' : 'none' }}
      >
        {stockStatus}
      </div>
    </div>
  );
};