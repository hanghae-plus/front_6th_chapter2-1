import { CartItem, Product } from '@/types';
import React, { createContext, ReactNode, useContext } from 'react';
import { useAppViewModel } from '../viewmodels';

// AppContext 타입 정의
interface AppContextType {
  cart: {
    items: CartItem[];
    summary: {
      totalItems: number;
      totalPrice: number;
      totalDiscount: number;
      totalPoints: number;
      finalPrice: number;
    };
    isEmpty: boolean;
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
  };
  product: {
    products: Product[];
    allProducts: Product[];
    selectedCategory: string | null;
    searchTerm: string;
    sortBy: 'name' | 'price' | 'stock' | null;
    sortOrder: 'asc' | 'desc';
    availableCategories: string[];
    totalProducts: number;
    hasActiveFilters: boolean;
    setCategory: (category: string | null) => void;
    setSearchTerm: (term: string) => void;
    setSort: (
      sortBy: 'name' | 'price' | 'stock' | null,
      sortOrder: 'asc' | 'desc'
    ) => void;
    resetFilters: () => void;
  };
  addProductToCart: (product: Product, quantity: number) => void;
  removeProductFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

// Context 생성
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider 컴포넌트
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const appViewModel = useAppViewModel();

  return (
    <AppContext.Provider value={appViewModel}>{children}</AppContext.Provider>
  );
};

// Custom Hook
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
