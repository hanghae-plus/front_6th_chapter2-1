// ==========================================
// 상품 선택 컴포넌트 (React + TypeScript)
// ==========================================

import React from 'react';

/**
 * ProductSelector 컴포넌트 Props 타입
 */
interface ProductSelectorProps {
  onProductChange?: (productId: string) => void;
  onAddToCart?: () => void;
  stockInfo?: string;
  selectedProduct?: string;
  products?: Array<{ id: string; name: string; quantity: number }>;
}

/**
 * ProductSelector 컴포넌트
 *
 * @description 상품 선택 영역 (드롭다운 + 추가 버튼 + 재고 정보)
 */
export const ProductSelector: React.FC<ProductSelectorProps> = ({
  onProductChange,
  onAddToCart,
  stockInfo = '',
  selectedProduct = '',
  products = [],
}) => {
  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onProductChange?.(e.target.value);
  };

  const handleAddToCart = () => {
    onAddToCart?.();
  };

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      {/* 🛒 상품 선택 드롭다운 */}
      <select
        id="product-select"
        className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
        value={selectedProduct}
        onChange={handleProductChange}
      >
        <option value="">상품을 선택하세요</option>
        {products.map((product) => (
          <option key={product.id} value={product.id} disabled={product.quantity === 0}>
            {product.name} - {product.quantity > 0 ? `재고: ${product.quantity}개` : '품절'}
          </option>
        ))}
      </select>

      {/* ➕ 추가 버튼 */}
      <button
        id="add-to-cart"
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>

      {/* 📊 재고 정보 */}
      {stockInfo && (
        <div
          id="stock-status"
          className="text-xs text-red-500 mt-3 whitespace-pre-line"
        >
          {stockInfo}
        </div>
      )}
    </div>
  );
};

export default ProductSelector;