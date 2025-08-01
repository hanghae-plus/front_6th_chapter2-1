import React from 'react';
import { Product } from '../types/product';
import { CartState } from '../types/cart';
import { ERROR_MESSAGES } from '../utils/errorMessages';

interface UseCartActionsProps {
  productList: Product[];
  setProductList: React.Dispatch<React.SetStateAction<Product[]>>;
  cartState: CartState;
  setCartState: React.Dispatch<React.SetStateAction<CartState>>;
}

export const useCartActions = ({
  productList,
  setProductList,
  setCartState,
}: UseCartActionsProps) => {
  const handleAdd = (productId: string) => {
    const product = productList.find((p) => p.id === productId);
    if (!product || product.stock <= 0) {
      alert(ERROR_MESSAGES.OUT_OF_STOCK);
      return;
    }

    setProductList((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: p.stock - 1 } : p))
    );

    setCartState((prev) => {
      const existingItem = prev.cartItems.find((item) => item.id === productId);
      if (existingItem) {
        const newCartItems = prev.cartItems.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          ...prev,
          cartItems: newCartItems,
          lastSelectedProduct: product,
        };
      } else {
        const newCartItems = [...prev.cartItems, { ...product, quantity: 1 }];
        return {
          ...prev,
          cartItems: newCartItems,
          lastSelectedProduct: product,
        };
      }
    });
  };

  const handleCartClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLElement;
    const button = target.closest('.quantity-change, .remove-item');
    if (!button) return;

    const productId = button.getAttribute('data-product-id');
    if (!productId) return;

    if (button.classList.contains('remove-item')) {
      setCartState((prev) => {
        const itemToRemove = prev.cartItems.find(
          (item) => item.id === productId
        );
        if (!itemToRemove) return prev;

        setProductList((prevProducts) =>
          prevProducts.map((p) =>
            p.id === productId
              ? { ...p, stock: p.stock + itemToRemove.quantity }
              : p
          )
        );

        const newCartItems = prev.cartItems.filter(
          (item) => item.id !== productId
        );
        return { ...prev, cartItems: newCartItems };
      });
      return;
    }

    const change = parseInt(button.getAttribute('data-change') || '0', 10);
    const product = productList.find((p) => p.id === productId);
    if (!product) return;

    if (change > 0 && product.stock < 1) {
      alert(ERROR_MESSAGES.OUT_OF_STOCK);
      return;
    }

    setCartState((prev) => {
      const newCartItems = prev.cartItems
        .map((item) => {
          if (item.id === productId) {
            const newQuantity = item.quantity + change;
            if (newQuantity <= 0) {
              setProductList((prevProducts) =>
                prevProducts.map((p) =>
                  p.id === productId
                    ? { ...p, stock: p.stock + item.quantity }
                    : p
                )
              );
              return null;
            }
            setProductList((prevProducts) =>
              prevProducts.map((p) =>
                p.id === productId ? { ...p, stock: p.stock - change } : p
              )
            );
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(Boolean) as any;

      return { ...prev, cartItems: newCartItems };
    });
  };

  return { handleAdd, handleCartClick };
};
