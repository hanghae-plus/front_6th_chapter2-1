import { useState, useEffect, useRef, useMemo } from 'react';
import {
  createInitialProducts,
  calculateCartData,
  calculatePoints,
  calculateTotalStock,
  getStockInfo,
  applyLightningSale,
  applySuggestionSale,
  type Product,
  type Cart,
  type CartData,
  type PointsData,
  type StockInfo,
} from './entities';

/**
 * 상품 목록 관리 훅
 * 요구사항: 상품 정보 조회, 재고 확인, 상품 업데이트
 */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>(createInitialProducts());
  
  const totalStock = useMemo(() => calculateTotalStock(products), [products]);
  const stockInfo = useMemo(() => getStockInfo(products), [products]);
  
  const getProductById = (id: string): Product | undefined => 
    products.find(p => p.id === id);
  
  const hasLowStock = (): boolean => totalStock < 50;
  
  return {
    products,
    totalStock,
    getProductById,
    getStockInfo: () => stockInfo,
    hasLowStock,
    setProducts
  };
}

/**
 * 장바구니 관리 훅
 * 요구사항: 장바구니 상태, 금액 계산, 포인트 계산
 */
export function useCart(products: Product[]) {
  const [cart, setCart] = useState<Cart>({});
  
  const cartData = useMemo(() => 
    calculateCartData(cart, products, new Date()), 
    [cart, products]
  );
  
  const pointsData = useMemo(() => 
    calculatePoints(cartData, cart, new Date()), 
    [cartData, cart]
  );
  
  const isEmpty = useMemo(() => Object.keys(cart).length === 0, [cart]);
  
  const getItemQuantity = (productId: string): number => cart[productId] || 0;
  const hasItem = (productId: string): boolean => productId in cart;
  
  return {
    cart,
    cartData,
    pointsData,
    isEmpty,
    getItemQuantity,
    hasItem,
    setCart
  };
}

/**
 * 마지막 선택 상품 추적 훅
 * 요구사항: 추천 할인을 위한 마지막 선택 상품 기록
 */
export function useLastSelected() {
  const [lastSelected, setLastSelected] = useState<string | null>(null);
  
  return {
    lastSelected,
    setLastSelected
  };
}

/**
 * 번개세일 타이머 훅
 * 요구사항: 0-10초 사이 랜덤 시작, 30초마다 랜덤 상품 20% 할인
 */
export function useLightningSale(products: Product[], setProducts: React.Dispatch<React.SetStateAction<Product[]>>) {
  const intervalRef = useRef<number | null>(null);
  
  useEffect(() => {
    const lightningDelay = Math.random() * 10000;
    
    const timeoutId = setTimeout(() => {
      intervalRef.current = window.setInterval(() => {
        const luckyIdx = Math.floor(Math.random() * products.length);
        const luckyItem = products[luckyIdx];
        
        if (luckyItem.quantity > 0 && !luckyItem.onSale) {
          setProducts(prevProducts => applyLightningSale(prevProducts, luckyItem.id));
          alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        }
      }, 30000);
    }, lightningDelay);
    
    return () => {
      clearTimeout(timeoutId);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []); // 한 번만 실행
}

/**
 * 추천 할인 타이머 훅
 * 요구사항: 0-20초 사이 랜덤 시작, 60초마다 마지막 선택 상품과 다른 상품 5% 할인
 */
export function useSuggestionSale(
  products: Product[], 
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>,
  lastSelected: string | null,
  isEmpty: boolean
) {
  const intervalRef = useRef<number | null>(null);
  
  useEffect(() => {
    const suggestionDelay = Math.random() * 20000;
    
    const timeoutId = setTimeout(() => {
      intervalRef.current = window.setInterval(() => {
        if (isEmpty) {
          return;
        }
        
        if (lastSelected) {
          const suggest = products.find(product => 
            product.id !== lastSelected &&
            product.quantity > 0 &&
            !product.suggestSale
          );
          
          if (suggest) {
            setProducts(prevProducts => applySuggestionSale(prevProducts, suggest.id, lastSelected));
            alert(`💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          }
        }
      }, 60000);
    }, suggestionDelay);
    
    return () => {
      clearTimeout(timeoutId);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []); // 한 번만 실행
}