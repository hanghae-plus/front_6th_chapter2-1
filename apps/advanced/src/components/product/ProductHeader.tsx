/**
 * 상품 선택 헤더 컴포넌트
 * 상품 선택 섹션의 헤더를 표시하는 컴포넌트
 */

import { memo } from 'react';

/**
 * 상품 선택 헤더 컴포넌트 Props
 */
interface Props {
  totalProducts: number;
  filteredCount: number;
}

/**
 * 상품 선택 헤더 컴포넌트
 * 상품 선택 섹션의 헤더를 표시하는 컴포넌트
 */
export const ProductHeader = memo(({ totalProducts, filteredCount }: Props) => {
  return (
    <div className='mb-6'>
      <h2 className='text-2xl font-bold text-gray-800 mb-2'>상품 선택</h2>
      <div className='flex flex-wrap gap-4 text-sm text-gray-600'>
        <span className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full'>
          전체: {totalProducts}개
        </span>
        <span className='bg-green-100 text-green-800 px-3 py-1 rounded-full'>
          검색결과: {filteredCount}개
        </span>
      </div>
    </div>
  );
});

ProductHeader.displayName = 'ProductHeader';
