import { useMemo } from "react";
import { useCartContext } from "../context/CartContext";
import type { UseItemCountReturn } from "./types";

/**
 * 아이템 수를 관리하는 커스텀 Hook
 * 장바구니의 총 아이템 수를 계산하여 제공
 */
export function useItemCount(): UseItemCountReturn {
  const { state } = useCartContext();

  const itemCount = useMemo(() => {
    return state.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [state.cartItems]);

  return { itemCount };
}
