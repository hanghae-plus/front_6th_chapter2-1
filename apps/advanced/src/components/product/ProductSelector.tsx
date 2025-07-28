/**
 * 상품 선택 컴포넌트
 * 선언적 프로그래밍 패러다임을 적용한 상품 선택 UI
 */

import React from 'react';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../hooks/useProducts';
import { Product } from '../../types/product.types';

/**
 * 상품 카드 컴포넌트 Props
 */
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

/**
 * 상품 카드 컴포넌트
 * 개별 상품을 표시하는 재사용 가능한 컴포넌트
 */
const ProductCard: React.FC<ProductCardProps> = React.memo(
  ({ product, onAddToCart }) => {
    const handleAddToCart = React.useCallback(() => {
      onAddToCart(product);
    }, [product, onAddToCart]);

    const isOutOfStock = product.stock === 0;
    const buttonText = isOutOfStock ? '품절' : '장바구니 추가';
    const buttonClass = isOutOfStock
      ? 'w-full p-2 bg-gray-300 text-gray-500 rounded cursor-not-allowed'
      : 'w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors';

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
          className={buttonClass}
          aria-label={`${product.name} 장바구니에 추가`}
          data-testid={`add-to-cart-${product.id}`}>
          {buttonText}
        </button>
      </div>
    );
  }
);

ProductCard.displayName = 'ProductCard';

/**
 * 필터 컴포넌트 Props
 */
interface FilterProps {
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
const Filter: React.FC<FilterProps> = React.memo(
  ({
    categories,
    selectedCategory,
    onCategoryChange,
    searchTerm,
    onSearchChange
  }) => {
    const handleCategoryChange = React.useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        onCategoryChange(e.target.value);
      },
      [onCategoryChange]
    );

    const handleSearchChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value);
      },
      [onSearchChange]
    );

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

/**
 * 상품 그리드 컴포넌트 Props
 */
interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

/**
 * 상품 그리드 컴포넌트
 * 상품 목록을 그리드 형태로 표시하는 컴포넌트
 */
const ProductGrid: React.FC<ProductGridProps> = React.memo(
  ({ products, onAddToCart }) => {
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
  }
);

ProductGrid.displayName = 'ProductGrid';

/**
 * 상품 선택기 컴포넌트
 * 상품 목록, 필터링, 검색 기능을 제공하는 메인 컴포넌트
 */
export const ProductSelector: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    totalProducts,
    filteredCount
  } = useProducts();

  const { addToCart } = useCart();

  const handleAddToCart = React.useCallback(
    (product: Product) => {
      addToCart(product, 1);
    },
    [addToCart]
  );

  const handleCategoryChange = React.useCallback(
    (category: string) => {
      setSelectedCategory(category);
    },
    [setSelectedCategory]
  );

  const handleSearchChange = React.useCallback(
    (term: string) => {
      setSearchTerm(term);
    },
    [setSearchTerm]
  );

  return (
    <div className='product-selector'>
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

      <Filter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />

      <ProductGrid products={products} onAddToCart={handleAddToCart} />
    </div>
  );
};
