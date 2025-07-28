/**
 * useProducts Hook 테스트
 * 선언적 프로그래밍 패러다임 테스트
 */

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PRODUCTS } from '../../constants/products';
import {
  useProducts,
  useProductSearch,
  useProductSorting,
  useProductStats
} from '../useProducts';

describe('useProducts', () => {
  describe('Given 기본 상태일 때', () => {
    describe('When useProducts Hook을 호출하면', () => {
      const { result } = renderHook(() => useProducts());

      it('Then 모든 상품을 반환해야 한다', () => {
        expect(result.current.products).toHaveLength(PRODUCTS.length);
        expect(result.current.selectedCategory).toBe('all');
        expect(result.current.searchTerm).toBe('');
        expect(result.current.totalProducts).toBe(PRODUCTS.length);
        expect(result.current.filteredCount).toBe(PRODUCTS.length);
      });

      it('Then 카테고리 목록을 반환해야 한다', () => {
        expect(result.current.categories).toContain('all');
        expect(result.current.categories.length).toBeGreaterThan(1);
      });
    });
  });

  describe('Given 카테고리가 선택되었을 때', () => {
    describe('When 카테고리를 변경하면', () => {
      const { result } = renderHook(() => useProducts());

      act(() => {
        result.current.setSelectedCategory('electronics');
      });

      it('Then 해당 카테고리의 상품만 필터링되어야 한다', () => {
        expect(result.current.selectedCategory).toBe('electronics');
        expect(
          result.current.products.every(
            product => product.category === 'electronics'
          )
        ).toBe(true);
        expect(result.current.filteredCount).toBeLessThanOrEqual(
          result.current.totalProducts
        );
      });
    });
  });

  describe('Given 검색어가 입력되었을 때', () => {
    describe('When 검색어를 입력하면', () => {
      const { result } = renderHook(() => useProducts());

      act(() => {
        result.current.setSearchTerm('phone');
      });

      it('Then 검색어에 맞는 상품만 필터링되어야 한다', () => {
        expect(result.current.searchTerm).toBe('phone');
        expect(result.current.products.length).toBeLessThanOrEqual(
          result.current.totalProducts
        );
        expect(result.current.filteredCount).toBeLessThanOrEqual(
          result.current.totalProducts
        );
      });
    });
  });

  describe('Given 필터가 적용되었을 때', () => {
    describe('When 필터를 초기화하면', () => {
      const { result } = renderHook(() => useProducts());

      act(() => {
        result.current.setSelectedCategory('electronics');
        result.current.setSearchTerm('phone');
      });

      act(() => {
        result.current.clearFilters();
      });

      it('Then 모든 필터가 초기화되어야 한다', () => {
        expect(result.current.selectedCategory).toBe('all');
        expect(result.current.searchTerm).toBe('');
        expect(result.current.products).toHaveLength(
          result.current.totalProducts
        );
      });
    });
  });
});

describe('useProductSorting', () => {
  describe('Given 상품 배열이 있을 때', () => {
    const testProducts = [
      {
        id: '1',
        name: 'C Product',
        price: 3000,
        category: 'electronics',
        stock: 10
      },
      {
        id: '2',
        name: 'A Product',
        price: 1000,
        category: 'clothing',
        stock: 5
      },
      { id: '3', name: 'B Product', price: 2000, category: 'books', stock: 15 }
    ];

    describe('When 이름으로 오름차순 정렬하면', () => {
      const { result } = renderHook(() =>
        useProductSorting(testProducts, 'name', 'asc')
      );

      it('Then 이름순으로 정렬되어야 한다', () => {
        expect(result.current[0].name).toBe('A Product');
        expect(result.current[1].name).toBe('B Product');
        expect(result.current[2].name).toBe('C Product');
      });
    });

    describe('When 가격으로 내림차순 정렬하면', () => {
      const { result } = renderHook(() =>
        useProductSorting(testProducts, 'price', 'desc')
      );

      it('Then 가격순으로 내림차순 정렬되어야 한다', () => {
        expect(result.current[0].price).toBe(3000);
        expect(result.current[1].price).toBe(2000);
        expect(result.current[2].price).toBe(1000);
      });
    });
  });
});

describe('useProductStats', () => {
  describe('Given 상품 배열이 있을 때', () => {
    const testProducts = [
      {
        id: '1',
        name: 'Product 1',
        price: 1000,
        category: 'electronics',
        stock: 10
      },
      {
        id: '2',
        name: 'Product 2',
        price: 2000,
        category: 'electronics',
        stock: 0
      },
      {
        id: '3',
        name: 'Product 3',
        price: 3000,
        category: 'clothing',
        stock: 5
      }
    ];

    describe('When useProductStats Hook을 호출하면', () => {
      const { result } = renderHook(() => useProductStats(testProducts));

      it('Then 정확한 통계를 반환해야 한다', () => {
        expect(result.current.totalProducts).toBe(3);
        expect(result.current.totalValue).toBe(6000);
        expect(result.current.averagePrice).toBe(2000);
        expect(result.current.inStockCount).toBe(2);
        expect(result.current.outOfStockCount).toBe(1);
      });

      it('Then 카테고리별 개수를 계산해야 한다', () => {
        expect(result.current.categoryCount.get('electronics')).toBe(2);
        expect(result.current.categoryCount.get('clothing')).toBe(1);
      });
    });
  });
});

describe('useProductSearch', () => {
  describe('Given 상품 배열이 있을 때', () => {
    const testProducts = [
      {
        id: '1',
        name: 'iPhone',
        price: 1000,
        category: 'electronics',
        stock: 10
      },
      {
        id: '2',
        name: 'Samsung Phone',
        price: 2000,
        category: 'electronics',
        stock: 5
      },
      { id: '3', name: 'T-Shirt', price: 3000, category: 'clothing', stock: 15 }
    ];

    describe('When 검색어로 검색하면', () => {
      const { result } = renderHook(() =>
        useProductSearch(testProducts, 'phone')
      );

      it('Then 검색어에 맞는 상품만 반환해야 한다', () => {
        expect(result.current).toHaveLength(2);
        expect(
          result.current.every(product =>
            product.name.toLowerCase().includes('phone')
          )
        ).toBe(true);
      });
    });

    describe('When 빈 검색어로 검색하면', () => {
      const { result } = renderHook(() => useProductSearch(testProducts, ''));

      it('Then 모든 상품을 반환해야 한다', () => {
        expect(result.current).toHaveLength(3);
      });
    });
  });
});
