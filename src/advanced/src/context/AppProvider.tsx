import React, { useState, useCallback, useEffect } from "react";
import type { AppContextType, CartItem } from "./types";
import { AppContext } from "./AppContext";
import { PRODUCTS } from "../constants";
import {
  getLowStockItems,
  createStockStatusMessage,
} from "../utils/stockUtils";
import {
  startLightningSaleTimer,
  startRecommendationTimer,
  showStockAlert,
  clearAllTimers,
} from "../services/alertService";

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // State
  const [products, setProducts] = useState(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [stockError, setStockError] = useState(""); // 재고 부족 에러 메시지

  // 재고 상태 자동 업데이트 (재고 부족 상품 정보)
  useEffect(() => {
    const lowStockItems = getLowStockItems(products);
    const stockMessage = createStockStatusMessage(lowStockItems);
    setStockStatus(stockMessage);
  }, [products]);

  // 알럿 타이머 초기화 (한 번만 실행)
  useEffect(() => {
    const updateProducts = () => {
      setProducts((prev) => [...prev]); // 강제 리렌더링
    };

    // 번개세일 타이머 시작
    startLightningSaleTimer({
      products,
      onProductUpdate: updateProducts,
    });

    // 추천할인 타이머 시작
    startRecommendationTimer({
      products,
      onProductUpdate: updateProducts,
    });

    // 클린업 함수
    return () => {
      clearAllTimers();
    };
  }, []);

  // Actions
  const addToCart = useCallback(
    (productId: string) => {
      // 상품 선택 확인
      if (!productId) return;

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      // 품절 상품 확인
      if (product.quantity === 0) {
        const errorMessage = `재고 부족: ${product.name}은(는) 품절입니다.`;
        setStockError(errorMessage);
        showStockAlert(errorMessage);
        return;
      }

      const existingItem = cart.find((item) => item.id === productId);
      const currentQuantity = existingItem ? existingItem.quantity : 0;
      const newQuantity = currentQuantity + 1;

      // 재고 확인 (기존 수량을 고려한 검증)
      if (newQuantity > product.quantity + currentQuantity) {
        const errorMessage = `재고 부족: ${product.name}의 재고는 ${product.quantity}개입니다.`;
        setStockError(errorMessage);
        showStockAlert(errorMessage);
        return;
      }

      // 재고 에러 초기화
      setStockError("");

      // 재고 감소
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, quantity: p.quantity - 1 } : p
        )
      );

      if (existingItem) {
        setCart((prev) =>
          prev.map((item) =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
          )
        );
        return;
      }

      const newItem: CartItem = {
        id: productId,
        name: product.name,
        val: product.val,
        quantity: 1,
        discount: 0,
      };
      setCart((prev) => [...prev, newItem]);
    },
    [products, cart]
  );

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      const existingItem = cart.find((item) => item.id === id);
      if (!existingItem) return;

      const currentQuantity = existingItem.quantity;
      const quantityChange = quantity - currentQuantity;

      if (quantity === 0) {
        // 장바구니에서 제거하고 재고 복원
        setProducts((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, quantity: p.quantity + currentQuantity } : p
          )
        );
        setCart((prev) => prev.filter((item) => item.id !== id));
        return;
      }

      // 재고 확인 (기존 수량을 고려한 검증)
      const product = products.find((p) => p.id === id);
      if (product && quantity > product.quantity + currentQuantity) {
        const errorMessage = `재고 부족: ${product.name}의 재고는 ${product.quantity}개입니다.`;
        setStockError(errorMessage);
        showStockAlert(errorMessage);
        return;
      }

      // 재고 에러 초기화
      setStockError("");

      // 재고 업데이트
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, quantity: p.quantity - quantityChange } : p
        )
      );

      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    },
    [products, cart]
  );

  const removeFromCart = useCallback(
    (id: string) => {
      const existingItem = cart.find((item) => item.id === id);
      if (existingItem) {
        // 재고 복원
        setProducts((prev) =>
          prev.map((p) =>
            p.id === id
              ? { ...p, quantity: p.quantity + existingItem.quantity }
              : p
          )
        );
      }
      setCart((prev) => prev.filter((item) => item.id !== id));
    },
    [cart]
  );

  const toggleManual = useCallback(() => {
    setIsManualOpen((prev) => !prev);
  }, []);

  const setSelectedProductHandler = useCallback((productId: string) => {
    setSelectedProduct(productId);
  }, []);

  const setStockStatusHandler = useCallback((status: string) => {
    setStockStatus(status);
  }, []);

  // 최종 재고 상태 메시지 (재고 부족 상품 정보 + 에러 메시지)
  const finalStockStatus = stockError
    ? `${stockStatus}\n${stockError}`
    : stockStatus;

  const value: AppContextType = {
    // State
    products,
    cart,
    isManualOpen,
    selectedProduct,
    stockStatus: finalStockStatus,

    // Actions
    addToCart,
    updateQuantity,
    removeFromCart,
    toggleManual,
    setSelectedProduct: setSelectedProductHandler,
    setStockStatus: setStockStatusHandler,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
