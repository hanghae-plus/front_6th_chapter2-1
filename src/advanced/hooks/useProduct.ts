import { useCallback } from "react";
import { useProductContext } from "../context/ProductContext";
import type { UseProductReturn } from "./types";

/**
 * 상품 관련 비즈니스 로직을 관리하는 커스텀 Hook
 * 상품 선택, 상품 목록 조회 등의 액션을 제공
 */
export function useProduct(): UseProductReturn {
  const { state, dispatch } = useProductContext();

  const selectProduct = useCallback(
    (productId: string) => {
      dispatch({ type: "SELECT_PRODUCT", payload: { productId } });
    },
    [dispatch],
  );

  return {
    products: state.productList,
    selectedProduct: state.productList.find((p) => p.id === state.selectedProductId) || null,
    selectProduct,
  };
}
