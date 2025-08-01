import React from 'react';
import { Product } from '../types';

interface AddToCartButtonProps {
  selectedProduct: Product | null;
  onAddToCart: (product: Product) => void;
  disabled?: boolean;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  selectedProduct,
  onAddToCart,
  disabled = false,
}) => {
  const handleClick = () => {
    if (selectedProduct) {
      onAddToCart(selectedProduct);
    }
  };

  return (
    <button
      id="add-to-cart"
      onClick={handleClick}
      disabled={!selectedProduct || disabled}
      className={`
        w-full px-4 py-3 rounded-lg font-medium transition-all duration-200
        ${
          selectedProduct && !disabled
            ? 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }
      `}
    >
      {selectedProduct ? '장바구니에 추가' : '상품을 선택해주세요'}
    </button>
  );
};
