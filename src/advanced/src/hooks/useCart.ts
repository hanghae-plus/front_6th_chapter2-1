import { useState, useCallback } from "react";
import type { CartItem, Product } from "../types";
import {
  validateAddToCart,
  validateQuantityUpdate,
} from "../utils/validationUtils";
import {
  findProductById,
  findCartItemById,
  updateCartItem,
} from "../utils/arrayUtils";
import { createError, handleError } from "../utils/errorUtils";

export const useCart = (
  products: Product[],
  updateProductQuantity: (productId: string, quantityChange: number) => void,
  restoreProductQuantity: (productId: string, quantity: number) => void
) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [stockError, setStockError] = useState("");

  // 장바구니 추가
  const addToCart = useCallback(
    (productId: string) => {
      // 검증 로직을 순수 함수로 분리
      const validation = validateAddToCart(productId, products, cart);

      if (!validation.isValid) {
        const error = createError.cart(validation.error!, "VALIDATION_ERROR");
        setStockError(validation.error!);
        handleError(error);
        return;
      }

      // 재고 에러 초기화
      setStockError("");

      const product = findProductById(products, productId)!;
      const existingItem = findCartItemById(cart, productId);

      // 재고 감소
      updateProductQuantity(productId, -1);

      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        setCart((prev) =>
          updateCartItem(prev, productId, (item) => ({
            ...item,
            quantity: newQuantity,
          }))
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

  // 장바구니 수량 업데이트
  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      const existingItem = findCartItemById(cart, id);
      if (!existingItem) return;

      const currentQuantity = existingItem.quantity;

      if (quantity === 0) {
        // 장바구니에서 제거하고 재고 복원
        restoreProductQuantity(id, currentQuantity);
        setCart((prev) => prev.filter((item) => item.id !== id));
        return;
      }

      // 검증 로직을 순수 함수로 분리
      const validation = validateQuantityUpdate(id, quantity, products, cart);

      if (!validation.isValid) {
        const error = createError.cart(validation.error!, "VALIDATION_ERROR");
        setStockError(validation.error!);
        handleError(error);
        return;
      }

      // 재고 에러 초기화
      setStockError("");

      const quantityChange = quantity - currentQuantity;

      // 재고 업데이트
      updateProductQuantity(id, -quantityChange);

      setCart((prev) =>
        updateCartItem(prev, id, (item) => ({
          ...item,
          quantity,
        }))
      );
    },
    [products, cart, updateProductQuantity, restoreProductQuantity]
  );

  // 장바구니 제거
  const removeFromCart = useCallback(
    (id: string) => {
      const existingItem = findCartItemById(cart, id);
      if (existingItem) {
        // 재고 복원
        restoreProductQuantity(id, existingItem.quantity);
      }
      setCart((prev) => prev.filter((item) => item.id !== id));
    },
    [cart, restoreProductQuantity]
  );

  return {
    cart,
    stockError,
    addToCart,
    updateQuantity,
    removeFromCart,
    setStockError,
  };
};
