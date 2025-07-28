/**
 * 상품 관리 커스텀 Hook
 * 선언적 프로그래밍 패러다임을 적용한 상품 관리 로직
 */

import { useCallback, useMemo, useState } from 'react';
import { PRODUCTS } from '../constants/products';
import { Product } from '../types/product.types';

interface UseProductsResult {
  products: Product[];
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  totalProducts: number;
  filteredCount: number;
  clearFilters: () => void;
}

/**
 * 상품 관리를 위한 커스텀 Hook
 * @returns 상품 관리 결과
 */
export const useProducts = (): UseProductsResult => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // 카테고리 목록 (선언적 접근)
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(PRODUCTS.map(product => product.category))
    ];
    return ['all', ...uniqueCategories];
  }, []);

  // 필터링된 상품 목록 (선언적 접근)
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product =>
      filterByCategory(product, selectedCategory)
    ).filter(product => filterBySearchTerm(product, searchTerm));
  }, [selectedCategory, searchTerm]);

  // 통계 정보 (선언적 접근)
  const stats = useMemo(
    () => ({
      totalProducts: PRODUCTS.length,
      filteredCount: filteredProducts.length
    }),
    [filteredProducts.length]
  );

  // 필터 초기화 (선언적 접근)
  const clearFilters = useCallback(() => {
    setSelectedCategory('all');
    setSearchTerm('');
  }, []);

  return {
    products: filteredProducts,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    totalProducts: stats.totalProducts,
    filteredCount: stats.filteredCount,
    clearFilters
  };
};

/**
 * 카테고리별 필터링 (선언적 접근)
 * @param product - 상품
 * @param category - 선택된 카테고리
 * @returns 필터링 결과
 */
const filterByCategory = (product: Product, category: string): boolean => {
  return category === 'all' || product.category === category;
};

/**
 * 검색어별 필터링 (선언적 접근)
 * @param product - 상품
 * @param searchTerm - 검색어
 * @returns 필터링 결과
 */
const filterBySearchTerm = (product: Product, searchTerm: string): boolean => {
  if (!searchTerm.trim()) return true;

  const term = searchTerm.toLowerCase();
  const searchableFields = [
    product.name,
    product.description,
    product.category
  ].filter((field): field is string => Boolean(field));

  return searchableFields.some(field => field.toLowerCase().includes(term));
};

/**
 * 상품 정렬을 위한 커스텀 Hook
 * @param products - 상품 배열
 * @param sortBy - 정렬 기준
 * @param sortOrder - 정렬 순서
 * @returns 정렬된 상품 배열
 */
export const useProductSorting = (
  products: Product[],
  sortBy: keyof Product = 'name',
  sortOrder: 'asc' | 'desc' = 'asc'
) => {
  return useMemo(() => {
    const sortedProducts = [...products].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return sortedProducts;
  }, [products, sortBy, sortOrder]);
};

/**
 * 상품 통계를 위한 커스텀 Hook
 * @param products - 상품 배열
 * @returns 상품 통계
 */
export const useProductStats = (products: Product[]) => {
  return useMemo(() => {
    const stats = {
      totalProducts: products.length,
      totalValue: products.reduce((sum, product) => sum + product.price, 0),
      averagePrice:
        products.length > 0
          ? products.reduce((sum, product) => sum + product.price, 0) /
            products.length
          : 0,
      categoryCount: new Map<string, number>(),
      inStockCount: products.filter(product => product.stock > 0).length,
      outOfStockCount: products.filter(product => product.stock === 0).length
    };

    // 카테고리별 개수 계산 (선언적 접근)
    products.forEach(product => {
      const currentCount = stats.categoryCount.get(product.category) ?? 0;
      stats.categoryCount.set(product.category, currentCount + 1);
    });

    return stats;
  }, [products]);
};

/**
 * 상품 검색을 위한 커스텀 Hook
 * @param products - 상품 배열
 * @param searchTerm - 검색어
 * @returns 검색 결과
 */
export const useProductSearch = (products: Product[], searchTerm: string) => {
  return useMemo(() => {
    if (!searchTerm.trim()) return products;

    const term = searchTerm.toLowerCase();
    const searchableFields = ['name', 'description', 'category'] as const;

    return products.filter(product =>
      searchableFields.some(field => {
        const value = product[field];
        return typeof value === 'string' && value.toLowerCase().includes(term);
      })
    );
  }, [products, searchTerm]);
};
