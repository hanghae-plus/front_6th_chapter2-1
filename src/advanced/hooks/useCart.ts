import { useCallback } from "react";
import { useCartContext } from "../context/CartContext";
import { useProductContext } from "../context/ProductContext";
import type { UseCartReturn } from "./types";

/**
 * 장바구니 관련 비즈니스 로직을 담당하는 커스텀 Hook
 * 장바구니 상태 관리 및 조작 기능을 제공
 */
export function useCart(): UseCartReturn {
  const { state: cartState, dispatch: cartDispatch } = useCartContext();
  const { state: productState } = useProductContext();

  const addToCart = useCallback(
    (productId: string, quantity: number) => {
      const product = productState.productList.find((p) => p.id === productId);
      if (product) {
        cartDispatch({
          type: "ADD_TO_CART",
          payload: { productId, quantity, product },
        });
        cartDispatch({
          type: "SET_LAST_SELECTED_PRODUCT",
          payload: { productId },
        });
      }
    },
    [cartDispatch, productState.productList],
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      cartDispatch({
        type: "REMOVE_FROM_CART",
        payload: { productId },
      });
    },
    [cartDispatch],
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      const product = productState.productList.find((p) => p.id === productId);
      if (product) {
        cartDispatch({
          type: "UPDATE_QUANTITY",
          payload: { productId, quantity, product },
        });
      }
    },
    [cartDispatch, productState.productList],
  );

  const resetCart = useCallback(() => {
    cartDispatch({ type: "RESET_CART" });
  }, [cartDispatch]);

  return {
    cartItems: cartState.cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    resetCart,
  };
}
