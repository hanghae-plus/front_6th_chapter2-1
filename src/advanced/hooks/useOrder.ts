import { useMemo } from "react";
import { useCartContext } from "../context/CartContext";
import { useProductContext } from "../context/ProductContext";
import { calculateCartTotals } from "../utils/businessLogic";
import type { UseOrderReturn } from "./types";

/**
 * 주문 계산 관련 비즈니스 로직을 관리하는 커스텀 Hook
 * 장바구니 총액, 할인율, 포인트 등의 계산을 제공
 */
export function useOrder(): UseOrderReturn {
  const { state: cartState } = useCartContext();
  const { state: productState } = useProductContext();

  const calculation = useMemo(() => {
    return calculateCartTotals(cartState.cartItems, productState.productList);
  }, [cartState.cartItems, productState.productList]);

  return {
    calculation,
    totalAmount: calculation.totalAmount,
    discountRate: calculation.discountRate,
    loyaltyPoints: calculation.points.total,
    isTuesday: calculation.isTuesday,
    itemCount: calculation.itemCount,
    subtotal: calculation.subtotal,
  };
}
