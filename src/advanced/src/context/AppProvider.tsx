import React, { useState, useCallback } from "react";
import type { AppContextType } from "./types";
import { AppContext } from "./AppContext";
import { PRODUCTS } from "../constants";
import { useCart } from "../hooks/useCart";
import { useProducts } from "../hooks/useProducts";

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // State
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]?.id || "");

  // Custom hooks
  const {
    products,
    stockStatus,
    updateProductQuantity,
    restoreProductQuantity,
  } = useProducts();
  const { cart, stockError, addToCart, updateQuantity, removeFromCart } =
    useCart(products, updateProductQuantity, restoreProductQuantity);

  // Actions - 이제 useCart에서 재고 관리를 직접 처리하므로 단순히 전달만 함
  const handleAddToCart = useCallback(
    (productId: string) => {
      addToCart(productId);
    },
    [addToCart]
  );

  const handleUpdateQuantity = useCallback(
    (id: string, quantity: number) => {
      updateQuantity(id, quantity);
    },
    [updateQuantity]
  );

  const handleRemoveFromCart = useCallback(
    (id: string) => {
      removeFromCart(id);
    },
    [removeFromCart]
  );

  const toggleManual = useCallback(() => {
    setIsManualOpen((prev) => !prev);
  }, []);

  const setSelectedProductHandler = useCallback((productId: string) => {
    setSelectedProduct(productId);
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
    addToCart: handleAddToCart,
    updateQuantity: handleUpdateQuantity,
    removeFromCart: handleRemoveFromCart,
    toggleManual,
    setSelectedProduct: setSelectedProductHandler,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
