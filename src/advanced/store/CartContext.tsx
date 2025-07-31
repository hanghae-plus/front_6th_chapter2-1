// CartContext.tsx
import React, { createContext, ReactNode, useContext, useState } from 'react';

export type CartItem = {
  productId: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  cartTotalCount: number;
  addItem: (_productId: string, _quantity?: number) => void;
  removeItem: (productId: string) => void;
  changeQuantity: (productId: string, delta: number) => void;
  clear: () => void;
  getQuantityByProductId: (productId: string) => number;

  lastAddedItem: string | null;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartMap, setCartMap] = useState<Record<string, number>>({});
  const [lastAddedItem, setLastAddedItem] = useState<string | null>(null);

  const cartTotalCount = Object.values(cartMap).reduce((acc, quantity) => acc + quantity, 0);

  const addItem = (productId: string, quantity = 1) => {
    setCartMap((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + quantity,
    }));
    setLastAddedItem(productId);
  };

  const removeItem = (productId: string) => {
    setCartMap((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };

  const changeQuantity = (productId: string, delta: number) => {
    setCartMap((prev) => {
      const current = prev[productId] || 0;
      const newQuantity = current + delta;

      if (current === 0) {
        throw new Error('기존에 카트에 담겨있지 않은 상품입니다.');
      }

      if (newQuantity <= 0) {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      }

      return {
        ...prev,
        [productId]: newQuantity,
      };
    });
  };

  const clear = () => {
    setCartMap({});
    setLastAddedItem(null);
  };

  const getItems = (): CartItem[] =>
    Object.entries(cartMap).map(([productId, quantity]) => ({
      productId,
      quantity,
    }));

  const getQuantityByProductId = (productId: string): number => {
    const quantity = cartMap[productId];
    if (!quantity) return 0;
    return quantity;
  };

  return (
    <CartContext.Provider
      value={{
        items: getItems(),
        cartTotalCount,
        lastAddedItem,
        addItem,
        removeItem,
        changeQuantity,
        clear,
        getQuantityByProductId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};
