/**
 * 상품 카드 컴포넌트
 * 개별 상품을 표시하는 재사용 가능한 컴포넌트
 */

import clsx from 'clsx';
import { memo } from 'react';
import { Product } from '../../types/product.types';

/**
 * 상품 카드 컴포넌트 Props
 */
interface Props {
  product: Product;
  onAddToCart: (product: Product) => void;
}

/**
 * 상품 카드 컴포넌트
 * 개별 상품을 표시하는 재사용 가능한 컴포넌트
 */
export const ProductCard = memo(({ product, onAddToCart }: Props) => {
  const handleAddToCart = () => {
    onAddToCart(product);
  };

  const isOutOfStock = product.stock === 0;
  const buttonText = isOutOfStock ? '품절' : '장바구니 추가';

  return (
    <div
      className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow'
      data-testid={`product-card-${product.id}`}>
      <div className='product-info'>
        <h3 className='text-lg font-semibold text-gray-800 mb-2'>
          {product.name}
        </h3>
        <p className='text-gray-600 text-sm mb-3'>{product.description}</p>
        <p className='text-xl font-bold text-blue-600 mb-2'>
          {product.price.toLocaleString()}원
        </p>
        <p
          className={`text-sm mb-4 ${isOutOfStock ? 'text-red-500' : 'text-gray-500'}`}>
          재고: {product.stock}개
        </p>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className={clsx([
          'w-full p-2 rounded',
          isOutOfStock
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600 transition-colors'
        ])}
        aria-label={`${product.name} 장바구니에 추가`}
        data-testid={`add-to-cart-${product.id}`}>
        {buttonText}
      </button>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
