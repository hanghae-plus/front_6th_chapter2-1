/**
 * 필터 컴포넌트
 * 카테고리 선택과 검색 기능을 제공하는 컴포넌트
 */

import React from 'react';

/**
 * 필터 컴포넌트 Props
 */
interface Props {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

/**
 * 필터 컴포넌트
 * 카테고리 선택과 검색 기능을 제공하는 컴포넌트
 */
export const Filter = React.memo(
  ({
    categories,
    selectedCategory,
    onCategoryChange,
    searchTerm,
    onSearchChange
  }: Props) => {
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onCategoryChange(e.target.value);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearchChange(e.target.value);
    };

    return (
      <div className='mb-6 space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='filter-group'>
            <label
              htmlFor='category-filter'
              className='block text-sm font-medium text-gray-700 mb-2'>
              카테고리
            </label>
            <select
              id='category-filter'
              value={selectedCategory}
              onChange={handleCategoryChange}
              className='w-full p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              aria-label='카테고리 선택'>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? '전체' : category}
                </option>
              ))}
            </select>
          </div>

          <div className='filter-group'>
            <label
              htmlFor='search-input'
              className='block text-sm font-medium text-gray-700 mb-2'>
              검색
            </label>
            <input
              id='search-input'
              type='text'
              placeholder='상품명, 설명으로 검색...'
              value={searchTerm}
              onChange={handleSearchChange}
              className='w-full p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              aria-label='상품 검색'
            />
          </div>
        </div>
      </div>
    );
  }
);

Filter.displayName = 'Filter';
