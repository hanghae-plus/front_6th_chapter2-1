import { useEffect, useRef } from "react";
import { TIMING, MESSAGES } from "../constants";
import { useAppContext } from "../context/AppContext";
import { useProductService } from "./useProductService";

export function useSaleService() {
  const { state, dispatch } = useAppContext();
  const { getRandomProduct, findAvailableProductForSuggestion } =
    useProductService();

  const stateRef = useRef(state);
  stateRef.current = state;

  const lightningDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lightningIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const suggestionDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  useEffect(() => {
    const lightningDelay = Math.random() * 10000; // 0-10초 랜덤 지연

    lightningDelayRef.current = setTimeout(() => {
      lightningIntervalRef.current = setInterval(() => {
        const currentState = stateRef.current;
        const luckyProduct = getRandomProduct(currentState.products);
        if (
          luckyProduct &&
          luckyProduct.quantity > 0 &&
          !luckyProduct.isOnLightningSale
        ) {
          alert(
            MESSAGES.LIGHTNING_SALE.replace("{productName}", luckyProduct.name)
          );
          dispatch({
            type: "APPLY_LIGHTNING_SALE",
            payload: { productId: luckyProduct.id },
          });
        }
      }, TIMING.LIGHTNING_SALE_INTERVAL);
    }, lightningDelay);

    const suggestedDelay = Math.random() * TIMING.SUGGESTION_DELAY_MAX;

    suggestionDelayRef.current = setTimeout(() => {
      suggestionIntervalRef.current = setInterval(() => {
        const currentState = stateRef.current;
        if (!currentState.lastSelectedProductId) return;

        const suggestedProduct = findAvailableProductForSuggestion(
          currentState.products,
          currentState.lastSelectedProductId
        );

        if (
          suggestedProduct &&
          suggestedProduct.quantity > 0 &&
          !suggestedProduct.isSuggestedSale
        ) {
          alert(
            MESSAGES.SUGGESTED_SALE.replace(
              "{productName}",
              suggestedProduct.name
            )
          );
          dispatch({
            type: "APPLY_SUGGESTED_SALE",
            payload: { productId: suggestedProduct.id },
          });
        }
      }, TIMING.SUGGESTION_INTERVAL);
    }, suggestedDelay);

    // 정리 함수
    return () => {
      if (lightningDelayRef.current) {
        clearTimeout(lightningDelayRef.current);
      }
      if (lightningIntervalRef.current) {
        clearInterval(lightningIntervalRef.current);
      }
      if (suggestionDelayRef.current) {
        clearTimeout(suggestionDelayRef.current);
      }
      if (suggestionIntervalRef.current) {
        clearInterval(suggestionIntervalRef.current);
      }
    };
  }, []);

  // 컴포넌트 언마운트 시에도 정리
  useEffect(() => {
    return () => {
      if (lightningDelayRef.current) clearTimeout(lightningDelayRef.current);
      if (lightningIntervalRef.current)
        clearInterval(lightningIntervalRef.current);
      if (suggestionDelayRef.current) clearTimeout(suggestionDelayRef.current);
      if (suggestionIntervalRef.current)
        clearInterval(suggestionIntervalRef.current);
    };
  }, []);
}
