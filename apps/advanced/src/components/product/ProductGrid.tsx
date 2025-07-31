/**
 * 상품 그리드 컴포넌트
 * 상품 목록을 그리드 형태로 표시하는 컴포넌트
 */

import { memo } from 'react';
import { Product } from '../../types/product.types';
import { ProductCard } from './ProductCard';

/**
 * 상품 그리드 컴포넌트 Props
 */
interface Props {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

/**
 * 상품 그리드 컴포넌트
 * 상품 목록을 그리드 형태로 표시하는 컴포넌트
 */
export const ProductGrid = memo(({ products, onAddToCart }: Props) => {
  if (products.length === 0) {
    return (
      <div className='text-center py-12'>
        <div className='text-gray-400 text-6xl mb-4'>🔍</div>
        <p className='text-gray-500 text-lg'>
          검색 조건에 맞는 상품이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
});

ProductGrid.displayName = 'ProductGrid';
