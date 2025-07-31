import { useState, useEffect, useCallback } from "react";
import { PRODUCTS } from "../constants";
import {
  getLowStockItems,
  createStockStatusMessage,
} from "../utils/stockUtils";
import { useAlertTimers } from "./useAlertTimers";

export const useProducts = () => {
  const [products, setProducts] = useState(PRODUCTS);
  const [stockStatus, setStockStatus] = useState("");

  // 재고 상태 자동 업데이트 (재고 부족 상품 정보)
  useEffect(() => {
    const lowStockItems = getLowStockItems(products);
    const stockMessage = createStockStatusMessage(lowStockItems);
    setStockStatus(stockMessage);
  }, [products]);

  // 알럿 타이머 초기화
  const updateProducts = useCallback(() => {
    setProducts((prev) => [...prev]); // 강제 리렌더링
  }, []);

  // 알럿 타이머 초기화
  useAlertTimers({
    products,
    onProductUpdate: updateProducts,
  });

  // 상품 수량 업데이트
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

  // 상품 수량 복원
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
