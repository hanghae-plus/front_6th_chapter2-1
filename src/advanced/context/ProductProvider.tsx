import React, { type ReactNode, useCallback, useEffect, useReducer } from "react";
import { LIGHTNING_SALE_INTERVAL, SUGGEST_SALE_INTERVAL } from "../constants";
import { ProductContextProvider, initialProductState, productReducer } from "./ProductContext";

// Provider 컴포넌트
interface ProductProviderProps {
  children?: ReactNode;
}

const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialProductState);

  // 동적 프로모션 시스템 (main.original.js와 동일한 로직)
  useEffect(() => {
    // 번개세일 프로모션 (30초마다)
    const lightningDelay = Math.random() * 10000;
    const lightningTimer = setTimeout(() => {
      const lightningInterval = setInterval(() => {
        const availableProducts = state.productList.filter((p) => p.q > 0 && !p.onSale);
        if (availableProducts.length > 0) {
          const luckyProduct =
            availableProducts[Math.floor(Math.random() * availableProducts.length)];

          // 20% 할인 적용
          const discountedPrice = Math.round(luckyProduct.originalVal * 0.8);

          dispatch({
            type: "APPLY_LIGHTNING_SALE",
            payload: {
              productId: luckyProduct.id,
              discountedPrice,
            },
          });

          alert(`⚡번개세일! ${luckyProduct.name}이(가) 20% 할인 중입니다!`);
        }
      }, LIGHTNING_SALE_INTERVAL);

      return () => clearInterval(lightningInterval);
    }, lightningDelay);

    // 추천할인 프로모션 (60초마다)
    const suggestDelay = Math.random() * 20000;
    const suggestTimer = setTimeout(() => {
      const suggestInterval = setInterval(() => {
        // CartContext에서 lastSelectedProduct를 가져오는 대신
        // 현재 선택된 상품을 사용
        const currentSelectedProduct = state.selectedProductId;

        if (currentSelectedProduct) {
          const availableProducts = state.productList.filter(
            (p) => p.q > 0 && !p.suggestSale && p.id !== currentSelectedProduct,
          );

          if (availableProducts.length > 0) {
            const suggestProduct = availableProducts[0];

            // 5% 할인 적용
            const discountedPrice = Math.round(suggestProduct.val * 0.95);

            dispatch({
              type: "APPLY_SUGGEST_SALE",
              payload: {
                productId: suggestProduct.id,
                discountedPrice,
              },
            });

            alert(`💝 ${suggestProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          }
        }
      }, SUGGEST_SALE_INTERVAL);

      return () => clearInterval(suggestInterval);
    }, suggestDelay);

    return () => {
      clearTimeout(lightningTimer);
      clearTimeout(suggestTimer);
    };
  }, [state.productList, state.selectedProductId]);

  const contextValue = useCallback(() => ({ state, dispatch }), [state, dispatch]);

  return <ProductContextProvider value={contextValue()}>{children}</ProductContextProvider>;
};

export { ProductProvider };
