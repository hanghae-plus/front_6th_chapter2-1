import React from 'react';
import { Product } from '../types';

interface ProductSelectorProps {
  products: Product[];
  selectedProductId: string;
  onProductSelect: (productId: string) => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  products,
  selectedProductId,
  onProductSelect,
}) => {
  const formatPrice = (price: number) => {
    return `₩${price.toLocaleString()}`;
  };

  const getProductDisplayText = (product: Product) => {
    let text = `${product.name} - ${formatPrice(product.price)}`;

    if (product.stock === 0) {
      text += ' (품절)';
    } else if (product.stock < 5) {
      text += ` (${product.stock}개 남음)`;
    }

    return text;
  };

  return (
    <div className="space-y-4">
      <label htmlFor="product-select" className="block text-sm font-medium text-gray-700">
        상품 선택
      </label>

      <select
        id="product-select"
        value={selectedProductId}
        onChange={(e) => onProductSelect(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">상품을 선택하세요</option>
        {products.map((product) => (
          <option
            key={product.id}
            value={product.id}
            disabled={product.stock === 0}
            className={product.stock === 0 ? 'text-gray-400' : ''}
          >
            {getProductDisplayText(product)}
          </option>
        ))}
      </select>

      {/* 재고 상태 표시 */}
      {products.some((p) => p.stock < 5 && p.stock > 0) && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">재고 부족 상품</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            {products
              .filter((p) => p.stock < 5 && p.stock > 0)
              .map((product) => (
                <li key={product.id}>
                  {product.name}: {product.stock}개 남음
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* 품절 상품 표시 */}
      {products.some((p) => p.stock === 0) && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <h4 className="text-sm font-medium text-red-800 mb-2">품절 상품</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {products
              .filter((p) => p.stock === 0)
              .map((product) => (
                <li key={product.id}>{product.name}: 품절</li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};
