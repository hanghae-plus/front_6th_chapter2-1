import React, { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import { Product, CartState, SaleEvent } from '../types/index.js';
import { useProducts, useCart, useAutoEvents } from '../hooks/index.js';
import { 
  findNewSales, 
  findEndedSales, 
  handleNewSales, 
  handleEndedSales,
  SaleEventHandlers 
} from '../utils/saleEventUtils';

interface AppContextType {
  // 상품 관련
  products: Product[];
  getProductById: (id: string) => Product | undefined;
  updateStock: (productId: string, quantity: number) => void;
  getLowStockItems: () => Product[];
  getOutOfStockItems: () => Product[];
  
  // 장바구니 관련
  cartState: CartState;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  updateCartItemPrices: () => void;
  
  // UI 상태
  selectedProductId: string;
  setSelectedProductId: (id: string) => void;
  
  // 자동 이벤트
  activeSales: SaleEvent[];
  startAutoEvents: (lastSelectedProductId: string) => void;
  stopAutoEvents: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

/**
 * 애플리케이션 전역 상태를 관리하는 Context Provider
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const {
    products,
    getProductById,
    updateStock,
    getLowStockItems,
    getOutOfStockItems,
    startLightningSale,
    startSuggestedSale,
    resetSaleStatus,
  } = useProducts();

  const {
    cartState,
    addToCart: originalAddToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    updateCartItemPrices,
  } = useCart();

  const {
    activeSales,
    startAutoEvents,
    stopAutoEvents,
  } = useAutoEvents();

  // UI 상태
  const [selectedProductId, setSelectedProductId] = useState<string>(
    products.length > 0 ? products[0].id : ''
  );

  // 이전 세일 상태를 추적하기 위한 ref
  const previousSalesRef = useRef<SaleEvent[]>([]);

  // 장바구니 추가 시 재고 업데이트 (Basic과 동일하게 재고 변화 없음)
  const addToCart = useCallback((product: Product) => {
    originalAddToCart(product);
    // updateStock(product.id, 1); // Basic 모듈과 동일하게 재고 변화 없음
  }, [originalAddToCart]);

  // 세일 이벤트 핸들러 객체 생성
  const saleEventHandlers: SaleEventHandlers = {
    startLightningSale,
    startSuggestedSale,
    resetSaleStatus,
  };

  // activeSales 변경 시 상품 세일 상태 업데이트
  useEffect(() => {
    // 새로운 세일 이벤트 확인 및 처리
    const newSales = findNewSales(activeSales, previousSalesRef.current);
    handleNewSales(newSales, getProductById, saleEventHandlers);

    // 종료된 세일 이벤트 확인 및 처리
    const endedSales = findEndedSales(activeSales, previousSalesRef.current);
    handleEndedSales(endedSales, saleEventHandlers);

    // 이전 상태 업데이트
    previousSalesRef.current = [...activeSales];
  }, [activeSales, getProductById, saleEventHandlers]);

  // products 변경 시 장바구니 아이템 가격 업데이트
  useEffect(() => {
    updateCartItemPrices(products);
  }, [products, updateCartItemPrices]);

  const contextValue: AppContextType = {
    // 상품 관련
    products,
    getProductById,
    updateStock,
    getLowStockItems,
    getOutOfStockItems,
    
    // 장바구니 관련
    cartState,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    updateCartItemPrices: () => updateCartItemPrices(products),
    
    // UI 상태
    selectedProductId,
    setSelectedProductId,
    
    // 자동 이벤트
    activeSales,
    startAutoEvents,
    stopAutoEvents,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

/**
 * AppContext를 사용하기 위한 커스텀 훅
 */
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};