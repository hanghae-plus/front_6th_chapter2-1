import { useState } from 'react';

/**
 * 장바구니 아이템 타입
 */
export interface CartItem {
  id: string;
  name: string;
  val: number;
  originalVal: number;
  quantity: number;
  onSale: boolean;
  suggestSale: boolean;
}

/**
 * React 훅 - 장바구니 상태를 관리하는 커스텀 훅
 */
export const useCartStore = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems(prev => {
      const existingItem = prev.find(i => i.id === item.id);

      if (existingItem) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  // 장바구니 아이템 제거
  const removeItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  // 장바구니 아이템 수량 변경
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setCartItems(prev =>
      prev.map(item => (item.id === itemId ? { ...item, quantity } : item)),
    );
  };

  const updateItemProperties = (
    itemId: string,
    properties: Partial<
      Pick<CartItem, 'val' | 'originalVal' | 'onSale' | 'suggestSale'>
    >,
  ) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, ...properties } : item,
      ),
    );
  };

  // 장바구니 비우기
  const clearCart = () => {
    setCartItems([]);
    setTotal(0);
    setDiscountRate(0);
  };

  return {
    // 상태
    cartItems,
    total,
    discountRate,
    itemCount,

    // 액션들
    addItem,
    removeItem,
    updateQuantity,
    updateItemProperties,
    updateTotal: setTotal,
    updateDiscountRate: setDiscountRate,
    clearCart,
  };
};
