import { useReducer } from 'react';
import { PRODUCTS } from '../constants/products';
import { Product } from '../types/product.types';

// 상품 상태 타입
export interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  selectedCategory: string | null;
  searchTerm: string;
  sortBy: 'name' | 'price' | 'stock' | null;
  sortOrder: 'asc' | 'desc';
}

// 액션 타입 정의
export type ProductAction =
  | { type: 'SET_CATEGORY'; payload: string | null }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | {
      type: 'SET_SORT';
      payload: {
        sortBy: 'name' | 'price' | 'stock' | null;
        sortOrder: 'asc' | 'desc';
      };
    }
  | {
      type: 'UPDATE_PRODUCT_STOCK';
      payload: { productId: string; quantity: number };
    }
  | { type: 'RESET_FILTERS' };

// 초기 상태
const initialState: ProductState = {
  products: [...PRODUCTS],
  filteredProducts: [...PRODUCTS],
  selectedCategory: null,
  searchTerm: '',
  sortBy: null,
  sortOrder: 'asc'
};

// 액션 생성자들
export const productActions = {
  setCategory: (category: string | null): ProductAction => ({
    type: 'SET_CATEGORY',
    payload: category
  }),

  setSearchTerm: (searchTerm: string): ProductAction => ({
    type: 'SET_SEARCH_TERM',
    payload: searchTerm
  }),

  setSort: (
    sortBy: 'name' | 'price' | 'stock' | null,
    sortOrder: 'asc' | 'desc'
  ): ProductAction => ({
    type: 'SET_SORT',
    payload: { sortBy, sortOrder }
  }),

  updateProductStock: (productId: string, quantity: number): ProductAction => ({
    type: 'UPDATE_PRODUCT_STOCK',
    payload: { productId, quantity }
  }),

  resetFilters: (): ProductAction => ({
    type: 'RESET_FILTERS'
  })
};

// 필터링 및 정렬 헬퍼 함수들
const filterByCategory = (
  products: Product[],
  category: string | null
): Product[] => {
  if (!category) return products;
  return products.filter(product => product.category === category);
};

const filterBySearchTerm = (
  products: Product[],
  searchTerm: string
): Product[] => {
  if (!searchTerm.trim()) return products;
  const term = searchTerm.toLowerCase();
  return products.filter(
    product =>
      product.name.toLowerCase().includes(term) ||
      (product.description && product.description.toLowerCase().includes(term))
  );
};

const sortProducts = (
  products: Product[],
  sortBy: 'name' | 'price' | 'stock' | null,
  sortOrder: 'asc' | 'desc'
): Product[] => {
  if (!sortBy) return products;

  return [...products].sort((a, b) => {
    const getValue = (product: Product, field: 'name' | 'price' | 'stock') => {
      switch (field) {
        case 'name':
          return product.name.toLowerCase();
        case 'price':
          return product.price;
        case 'stock':
          return product.stock;
        default:
          return 0;
      }
    };

    const aValue = getValue(a, sortBy);
    const bValue = getValue(b, sortBy);

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
};

const updateProductStock = (
  products: Product[],
  productId: string,
  quantity: number
): Product[] => {
  return products.map(product =>
    product.id === productId
      ? { ...product, stock: Math.max(0, product.stock - quantity) }
      : product
  );
};

// 리듀서 구현
const productReducer = (
  state: ProductState,
  action: ProductAction
): ProductState => {
  switch (action.type) {
    case 'SET_CATEGORY': {
      const newState = { ...state, selectedCategory: action.payload };
      const filteredByCategory = filterByCategory(
        state.products,
        action.payload
      );
      const filteredBySearch = filterBySearchTerm(
        filteredByCategory,
        state.searchTerm
      );
      const sorted = sortProducts(
        filteredBySearch,
        state.sortBy,
        state.sortOrder
      );

      return {
        ...newState,
        filteredProducts: sorted
      };
    }

    case 'SET_SEARCH_TERM': {
      const newState = { ...state, searchTerm: action.payload };
      const filteredByCategory = filterByCategory(
        state.products,
        state.selectedCategory
      );
      const filteredBySearch = filterBySearchTerm(
        filteredByCategory,
        action.payload
      );
      const sorted = sortProducts(
        filteredBySearch,
        state.sortBy,
        state.sortOrder
      );

      return {
        ...newState,
        filteredProducts: sorted
      };
    }

    case 'SET_SORT': {
      const { sortBy, sortOrder } = action.payload;
      const newState = { ...state, sortBy, sortOrder };
      const filteredByCategory = filterByCategory(
        state.products,
        state.selectedCategory
      );
      const filteredBySearch = filterBySearchTerm(
        filteredByCategory,
        state.searchTerm
      );
      const sorted = sortProducts(filteredBySearch, sortBy, sortOrder);

      return {
        ...newState,
        filteredProducts: sorted
      };
    }

    case 'UPDATE_PRODUCT_STOCK': {
      const { productId, quantity } = action.payload;
      const updatedProducts = updateProductStock(
        state.products,
        productId,
        quantity
      );
      const filteredByCategory = filterByCategory(
        updatedProducts,
        state.selectedCategory
      );
      const filteredBySearch = filterBySearchTerm(
        filteredByCategory,
        state.searchTerm
      );
      const sorted = sortProducts(
        filteredBySearch,
        state.sortBy,
        state.sortOrder
      );

      return {
        ...state,
        products: updatedProducts,
        filteredProducts: sorted
      };
    }

    case 'RESET_FILTERS': {
      const sorted = sortProducts(state.products, null, 'asc');

      return {
        ...state,
        selectedCategory: null,
        searchTerm: '',
        sortBy: null,
        sortOrder: 'asc',
        filteredProducts: sorted
      };
    }

    default:
      return state;
  }
};

// ViewModel Hook
export const useProductViewModel = () => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // 액션 디스패치 함수들
  const setCategory = (category: string | null) => {
    dispatch(productActions.setCategory(category));
  };

  const setSearchTerm = (searchTerm: string) => {
    dispatch(productActions.setSearchTerm(searchTerm));
  };

  const setSort = (
    sortBy: 'name' | 'price' | 'stock' | null,
    sortOrder: 'asc' | 'desc'
  ) => {
    dispatch(productActions.setSort(sortBy, sortOrder));
  };

  const updateProductStock = (productId: string, quantity: number) => {
    dispatch(productActions.updateProductStock(productId, quantity));
  };

  const resetFilters = () => {
    dispatch(productActions.resetFilters());
  };

  // 계산된 값들
  const availableCategories = (() => {
    const categories = new Set(state.products.map(product => product.category));
    return Array.from(categories).sort();
  })();

  const totalProducts = state.filteredProducts.length;

  const hasActiveFilters =
    state.selectedCategory !== null ||
    state.searchTerm.trim() !== '' ||
    state.sortBy !== null;

  return {
    // 상태
    products: state.filteredProducts,
    allProducts: state.products,
    selectedCategory: state.selectedCategory,
    searchTerm: state.searchTerm,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,

    // 계산된 값들
    availableCategories,
    totalProducts,
    hasActiveFilters,

    // 액션들
    setCategory,
    setSearchTerm,
    setSort,
    updateProductStock,
    resetFilters
  };
};
