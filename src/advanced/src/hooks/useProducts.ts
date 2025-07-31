import { useState, useEffect, useCallback } from "react";
import { PRODUCTS } from "../constants";
import {
  getLowStockItems,
  createStockStatusMessage,
} from "../utils/stockUtils";
import {
  startLightningSaleTimer,
  startRecommendationTimer,
  clearAllTimers,
} from "../services/alertService";

export const useProducts = () => {
  const [products, setProducts] = useState(PRODUCTS);
  const [stockStatus, setStockStatus] = useState("");

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

  const updateProductQuantity = useCallback(
    (productId: string, quantityChange: number) => {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? { ...p, quantity: p.quantity + quantityChange }
            : p
        )
      );
    },
    []
  );

  const restoreProductQuantity = useCallback(
    (productId: string, quantity: number) => {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, quantity: p.quantity + quantity } : p
        )
      );
    },
    []
  );

  return {
    products,
    stockStatus,
    updateProductQuantity,
    restoreProductQuantity,
  };
};
