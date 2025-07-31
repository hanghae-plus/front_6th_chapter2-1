import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

import {
  calculateFinalDiscount,
  calculateIndividualDiscount,
  calculateLightningSaleDiscount,
  calculateRecommendationDiscount,
  calculateTotalBulkDiscount,
  calculateTuesdayDiscount,
  Discount,
  getDiscountStyle,
} from '../lib/discount';
import { CartItem, initialProducts, Product } from '../lib/product';

interface CartContextType {
  products: Product[];
  cartItems: CartItem[];
  selectedProductId: string | null;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setSelectedProduct: (productId: string | null) => void;
  getCartItemCount: () => number;
  getTotalAmount: () => number;
  getDiscountedAmount: () => number;
  getAppliedDiscounts: () => Discount[];
  getDiscountBreakdown: () => {
    subtotal: number;
    individualDiscount: number;
    totalBulkDiscount: number;
    tuesdayDiscount: number;
    lightningSaleDiscount: number;
    recommendationDiscount: number;
    finalAmount: number;
  };
  getPoints: () => {
    base: number;
    tuesday: number;
    set: number;
    fullSet: number;
    total: number;
  };
  getDiscountStyle: (productId: string) => { icon: string; className: string };
  lightningSaleProductId: string | null;
  recommendationProductId: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [lightningSaleProductId, setLightningSaleProductId] = useState<string | null>(null);
  const [recommendationProductId, setRecommendationProductId] = useState<string | null>(null);
  const [lastSelectedProduct, setLastSelectedProduct] = useState<string | null>(null);

  // 무작위 상품 선택 (재고가 있는 상품만)
  const getRandomProductWithStock = useCallback(() => {
    const availableProducts = products.filter((product) => product.stock > 0);
    if (availableProducts.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * availableProducts.length);
    return availableProducts[randomIndex].id;
  }, [products]);

  // 번개세일 시작
  const startLightningSale = useCallback(() => {
    const productId = getRandomProductWithStock();
    if (!productId) return;

    setLightningSaleProductId(productId);

    // 알림창 표시
    const product = products.find((p) => p.id === productId);
    if (product) {
      alert(`⚡ 번개세일! ${product.name} 20% 할인!`);
    }
  }, [getRandomProductWithStock, products]);

  // 추천할인 시작
  const startRecommendation = useCallback(() => {
    if (!lastSelectedProduct) return;

    // 마지막 선택 상품과 다른 상품 선택
    const otherProducts = products.filter(
      (product) => product.id !== lastSelectedProduct && product.stock > 0,
    );

    if (otherProducts.length === 0) return;

    const randomIndex = Math.floor(Math.random() * otherProducts.length);
    const productId = otherProducts[randomIndex].id;

    setRecommendationProductId(productId);

    // 알림창 표시
    const product = products.find((p) => p.id === productId);
    if (product) {
      alert(`💝 추천할인! ${product.name} 5% 추가 할인!`);
    }
  }, [lastSelectedProduct, products]);

  // 번개세일 종료
  const stopLightningSale = useCallback(() => {
    setLightningSaleProductId(null);
  }, []);

  // 추천할인 종료
  const stopRecommendation = useCallback(() => {
    setRecommendationProductId(null);
  }, []);

  // 번개세일 타이머 (30초마다)
  useEffect(() => {
    const lightningSaleTimer = setInterval(() => {
      if (lightningSaleProductId) {
        stopLightningSale();
      }
      startLightningSale();
    }, 30000);

    return () => clearInterval(lightningSaleTimer);
  }, [lightningSaleProductId, startLightningSale, stopLightningSale]);

  // 추천할인 타이머 (60초마다)
  useEffect(() => {
    const recommendationTimer = setInterval(() => {
      if (recommendationProductId) {
        stopRecommendation();
      }
      startRecommendation();
    }, 60000);

    return () => clearInterval(recommendationTimer);
  }, [recommendationProductId, startRecommendation, stopRecommendation]);

  // 초기 번개세일 시작 (0~10초 사이)
  useEffect(() => {
    const initialDelay = Math.random() * 10000; // 0~10초
    const timer = setTimeout(() => {
      startLightningSale();
    }, initialDelay);

    return () => clearTimeout(timer);
  }, [startLightningSale]);

  // 초기 추천할인 시작 (0~20초 사이)
  useEffect(() => {
    const initialDelay = Math.random() * 20000; // 0~20초
    const timer = setTimeout(() => {
      startRecommendation();
    }, initialDelay);

    return () => clearTimeout(timer);
  }, [startRecommendation]);

  // 장바구니에 상품 추가
  const addToCart = useCallback(
    (productId: string) => {
      const product = products.find((p: Product) => p.id === productId);

      if (!product) {
        return;
      }

      if (product.stock === 0) {
        return;
      }

      setCartItems((prevItems: CartItem[]) => {
        const existingItem = prevItems.find((item: CartItem) => item.product.id === productId);

        if (existingItem) {
          // 이미 있는 상품이면 수량 증가
          if (existingItem.quantity < product.stock) {
            return prevItems.map((item: CartItem) =>
              item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
            );
          }
          return prevItems; // 재고 부족
        } else {
          // 새 상품 추가
          const newItem = {
            product,
            quantity: 1,
            appliedDiscounts: [],
          };
          return [...prevItems, newItem];
        }
      });

      // 재고 감소
      setProducts((prevProducts: Product[]) =>
        prevProducts.map((p: Product) => (p.id === productId ? { ...p, stock: p.stock - 1 } : p)),
      );
    },
    [products],
  );

  // 장바구니에서 상품 제거
  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prevItems: CartItem[]) => {
      const itemToRemove = prevItems.find((item: CartItem) => item.product.id === productId);
      if (!itemToRemove) return prevItems;

      // 재고 복구
      setProducts((prevProducts: Product[]) =>
        prevProducts.map((p: Product) =>
          p.id === productId ? { ...p, stock: p.stock + itemToRemove.quantity } : p,
        ),
      );

      return prevItems.filter((item: CartItem) => item.product.id !== productId);
    });
  }, []);

  // 수량 변경
  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products.find((p: Product) => p.id === productId);
      if (!product) return;

      const currentItem = cartItems.find((item: CartItem) => item.product.id === productId);
      if (!currentItem) return;

      const quantityDiff = newQuantity - currentItem.quantity;
      const availableStock = product.stock + currentItem.quantity;

      if (newQuantity > availableStock) return; // 재고 초과

      setCartItems((prevItems: CartItem[]) =>
        prevItems.map((item: CartItem) =>
          item.product.id === productId ? { ...item, quantity: newQuantity } : item,
        ),
      );

      // 재고 조정
      setProducts((prevProducts: Product[]) =>
        prevProducts.map((p: Product) =>
          p.id === productId ? { ...p, stock: p.stock - quantityDiff } : p,
        ),
      );
    },
    [products, cartItems, removeFromCart],
  );

  // 선택된 상품 설정
  const setSelectedProduct = useCallback((productId: string | null) => {
    setSelectedProductId(productId);
    if (productId) {
      setLastSelectedProduct(productId);
    }
  }, []);

  // 장바구니 아이템 개수
  const getCartItemCount = useCallback(() => {
    return cartItems.reduce((total: number, item: CartItem) => total + item.quantity, 0);
  }, [cartItems]);

  // 총 금액 계산 (할인 적용 전)
  const getTotalAmount = useCallback(() => {
    return cartItems.reduce((total: number, item: CartItem) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }, [cartItems]);

  // 할인 적용된 최종 금액 계산
  const getDiscountedAmount = useCallback(() => {
    const subtotal = getTotalAmount();
    const totalQuantity = getCartItemCount();

    // 개별 상품 할인 계산
    const individualDiscounts = cartItems.map((item: CartItem) =>
      calculateIndividualDiscount(item.product.price, item.quantity, item.product.discount),
    );

    // 번개세일 할인 계산
    const lightningSaleDiscounts = cartItems.map((item: CartItem) =>
      calculateLightningSaleDiscount(
        item.product.id,
        item.product.price,
        item.quantity,
        lightningSaleProductId,
      ),
    );

    // 추천할인 계산
    const recommendationDiscounts = cartItems.map((item: CartItem) =>
      calculateRecommendationDiscount(
        item.product.id,
        item.product.price,
        item.quantity,
        recommendationProductId,
      ),
    );

    const discountResult = calculateFinalDiscount(
      subtotal,
      totalQuantity,
      individualDiscounts,
      lightningSaleDiscounts.reduce((sum: number, discount: number): number => sum + discount, 0),
      recommendationDiscounts.reduce((sum: number, discount: number): number => sum + discount, 0),
    );
    return discountResult.finalAmount;
  }, [
    cartItems,
    getTotalAmount,
    getCartItemCount,
    lightningSaleProductId,
    recommendationProductId,
  ]);

  // 적용된 할인 목록 (현재는 빈 배열, 추후 확장)
  const getAppliedDiscounts = useCallback(() => {
    return [] as Discount[];
  }, []);

  // 할인 세부 정보 제공
  const getDiscountBreakdown = useCallback(() => {
    const subtotal = getTotalAmount();
    const totalQuantity = getCartItemCount();

    // 개별 상품 할인 계산
    const individualDiscounts = cartItems.map((item: CartItem) =>
      calculateIndividualDiscount(item.product.price, item.quantity, item.product.discount),
    );
    const individualDiscount = individualDiscounts.reduce(
      (sum: number, discount: number): number => sum + discount,
      0,
    );

    // 번개세일 할인 계산
    const lightningSaleDiscounts = cartItems.map((item: CartItem) =>
      calculateLightningSaleDiscount(
        item.product.id,
        item.product.price,
        item.quantity,
        lightningSaleProductId,
      ),
    );
    const lightningSaleDiscount = lightningSaleDiscounts.reduce(
      (sum: number, discount: number): number => sum + discount,
      0,
    );

    // 추천할인 계산
    const recommendationDiscounts = cartItems.map((item: CartItem) =>
      calculateRecommendationDiscount(
        item.product.id,
        item.product.price,
        item.quantity,
        recommendationProductId,
      ),
    );
    const recommendationDiscount = recommendationDiscounts.reduce(
      (sum: number, discount: number): number => sum + discount,
      0,
    );

    // 개별 할인 적용 후 금액
    const afterIndividualDiscount = subtotal - individualDiscount;

    // 전체 수량 할인 계산
    const totalBulkDiscount = calculateTotalBulkDiscount(afterIndividualDiscount, totalQuantity);

    // 화요일 할인 계산
    const tuesdayDiscount = calculateTuesdayDiscount(
      afterIndividualDiscount - totalBulkDiscount - lightningSaleDiscount - recommendationDiscount,
    );

    const finalAmount =
      afterIndividualDiscount -
      totalBulkDiscount -
      lightningSaleDiscount -
      recommendationDiscount -
      tuesdayDiscount;

    return {
      subtotal,
      individualDiscount,
      totalBulkDiscount,
      tuesdayDiscount,
      lightningSaleDiscount,
      recommendationDiscount,
      finalAmount,
    };
  }, [
    cartItems,
    getTotalAmount,
    getCartItemCount,
    lightningSaleProductId,
    recommendationProductId,
  ]);

  // 포인트 계산
  const getPoints = useCallback(() => {
    const subtotal = getTotalAmount();
    const basePoints = Math.floor(subtotal / 1000);

    // 화요일 특별 포인트 (2배)
    const today = new Date();
    const isTuesday = today.getDay() === 2;
    const tuesdayBonus = isTuesday ? basePoints : 0;

    // 세트 구매 보너스 (키보드 + 마우스)
    const hasKeyboard = cartItems.some((item: CartItem) => item.product.id === 'p1');
    const hasMouse = cartItems.some((item: CartItem) => item.product.id === 'p2');
    const setBonus = hasKeyboard && hasMouse ? 50 : 0;

    // 풀세트 구매 보너스 (모든 상품)
    const fullSetBonus = cartItems.length >= 5 ? 100 : 0;

    return {
      base: basePoints,
      tuesday: tuesdayBonus,
      set: setBonus,
      fullSet: fullSetBonus,
      total: basePoints + tuesdayBonus + setBonus + fullSetBonus,
    };
  }, [cartItems, getTotalAmount]);

  // 할인 스타일 가져오기
  const getDiscountStyleForProduct = useCallback(
    (productId: string) => {
      return getDiscountStyle(productId, lightningSaleProductId, recommendationProductId);
    },
    [lightningSaleProductId, recommendationProductId],
  );

  const value = {
    products,
    cartItems,
    selectedProductId,
    addToCart,
    removeFromCart,
    updateQuantity,
    setSelectedProduct,
    getCartItemCount,
    getTotalAmount,
    getDiscountedAmount,
    getAppliedDiscounts,
    getDiscountBreakdown,
    getPoints,
    getDiscountStyle: getDiscountStyleForProduct,
    lightningSaleProductId,
    recommendationProductId,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
