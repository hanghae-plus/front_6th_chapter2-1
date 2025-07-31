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
  const {
    cart,
    stockError,
    addToCart,
    updateQuantity,
    removeFromCart,
    setStockError,
  } = useCart(products);

  // Actions
  const handleAddToCart = useCallback(
    (productId: string) => {
      addToCart(productId);
      // 상품이 성공적으로 추가되면 재고 감소
      const product = products.find((p) => p.id === productId);
      if (product && product.quantity > 0) {
        updateProductQuantity(productId, -1);
      }
    },
    [addToCart, updateProductQuantity, products]
  );

  const handleUpdateQuantity = useCallback(
    (id: string, quantity: number) => {
      const existingItem = cart.find((item) => item.id === id);
      if (!existingItem) return;

      const currentQuantity = existingItem.quantity;
      const quantityChange = quantity - currentQuantity;

      if (quantity === 0) {
        // 장바구니에서 제거하고 재고 복원
        restoreProductQuantity(id, currentQuantity);
        updateQuantity(id, quantity);
        return;
      }

      // 재고 업데이트
      updateProductQuantity(id, -quantityChange);
      updateQuantity(id, quantity);
    },
    [cart, updateQuantity, updateProductQuantity, restoreProductQuantity]
  );

  const handleRemoveFromCart = useCallback(
    (id: string) => {
      const existingItem = cart.find((item) => item.id === id);
      if (existingItem) {
        // 재고 복원
        restoreProductQuantity(id, existingItem.quantity);
      }
      removeFromCart(id);
    },
    [cart, removeFromCart, restoreProductQuantity]
  );

  const toggleManual = useCallback(() => {
    setIsManualOpen((prev) => !prev);
  }, []);

  const setSelectedProductHandler = useCallback((productId: string) => {
    setSelectedProduct(productId);
  }, []);

  const setStockStatusHandler = useCallback((status: string) => {
    // stockStatus는 useProducts에서 관리되므로 여기서는 무시
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
    setStockStatus: setStockStatusHandler,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
