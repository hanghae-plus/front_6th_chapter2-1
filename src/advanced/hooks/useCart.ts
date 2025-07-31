// src/hooks/useCart.ts
import { useCallback, useState } from 'react';

import { CartItem, Product } from '../types';

interface UseCartResult {
  cartItems: CartItem[];
  itemCnt: number;
  // eslint-disable-next-line
  handleAddToCart: (selectedProductId: string) => void;
  // eslint-disable-next-line
  handleCartItemQuantityChange: (productId: string, change: number) => void;
  // eslint-disable-next-line
  handleRemoveCartItem: (productId: string) => void;
}

export const useCart = (
  products: Product[],
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
): UseCartResult => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // 장바구니 총 아이템 수 계산
  const itemCnt = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // 장바구니에 아이템 추가 핸들러
  const handleAddToCart = useCallback(
    (selectedProductId: string) => {
      const itemToAdd = products.find((p) => p.id === selectedProductId);

      if (!itemToAdd || itemToAdd.q <= 0) {
        alert('재고가 부족하거나 선택된 상품이 없습니다.');
        return;
      }

      setCartItems((prevCartItems) => {
        const existingItemIndex = prevCartItems.findIndex((item) => item.id === selectedProductId);

        if (existingItemIndex > -1) {
          if (itemToAdd.q === 0) {
            alert('재고가 부족합니다.');
            return prevCartItems;
          }
          const updatedCartItems = [...prevCartItems];
          updatedCartItems[existingItemIndex] = {
            ...updatedCartItems[existingItemIndex],
            quantity: updatedCartItems[existingItemIndex].quantity + 1,
          };
          return updatedCartItems;
        } else {
          return [
            ...prevCartItems,
            {
              id: selectedProductId,
              name: itemToAdd.name,
              price: itemToAdd.val,
              originalPrice: itemToAdd.originalVal,
              quantity: 1,
              onSale: itemToAdd.onSale,
              suggestSale: itemToAdd.suggestSale,
            },
          ];
        }
      });

      // 재고 감소 (products 상태 업데이트)
      setProducts((prevProducts) =>
        prevProducts.map((p) => (p.id === selectedProductId ? { ...p, q: p.q - 1 } : p))
      );
    },
    [products, setProducts]
  );

  // 장바구니 아이템 수량 변경 핸들러
  const handleCartItemQuantityChange = useCallback(
    (productId: string, change: number) => {
      setCartItems((prevCartItems) => {
        const updatedCartItems = prevCartItems
          .map((item) => {
            if (item.id === productId) {
              const productInList = products.find((p) => p.id === productId);
              if (!productInList) return item;

              const newQuantity = item.quantity + change;

              // 수량 증가 시 재고 확인
              if (change > 0 && productInList.q === 0) {
                alert('재고가 부족합니다.');
                return item;
              }

              if (newQuantity <= 0) {
                // 수량이 0 이하면 제거
                setProducts((prevProducts) =>
                  prevProducts.map((p) =>
                    p.id === productId ? { ...p, q: p.q + item.quantity } : p
                  )
                );
                return null;
              } else {
                // 수량 변경 및 재고 업데이트
                setProducts((prevProducts) =>
                  prevProducts.map((p) => (p.id === productId ? { ...p, q: p.q - change } : p))
                );
                return { ...item, quantity: newQuantity };
              }
            }
            return item;
          })
          .filter(Boolean) as CartItem[];

        return updatedCartItems;
      });
    },
    [products, setProducts]
  );

  // 장바구니 아이템 제거 핸들러
  const handleRemoveCartItem = useCallback(
    (productId: string) => {
      setCartItems((prevCartItems) => {
        const removedItem = prevCartItems.find((item) => item.id === productId);
        if (removedItem) {
          // 재고를 다시 추가
          setProducts((prevProducts) =>
            prevProducts.map((p) =>
              p.id === productId ? { ...p, q: p.q + removedItem.quantity } : p
            )
          );
        }
        return prevCartItems.filter((item) => item.id !== productId);
      });
    },
    [setProducts]
  );

  return {
    cartItems,
    itemCnt,
    handleAddToCart,
    handleCartItemQuantityChange,
    handleRemoveCartItem,
  };
};
