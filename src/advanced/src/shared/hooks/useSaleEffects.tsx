import { useEffect } from 'react';
import { useCart } from 'cart/context';
import { useSaleManager } from './useSaleManager';

/**
 * 실시간 세일 효과 Hook
 * 타이머 설정만 담당하고 비즈니스 로직은 useSaleManager에 위임
 */
export function useSaleEffects() {
  const { products, updateSaleStatus } = useCart();
  const {
    startLightningSale,
    startSuggestionSale,
    lightningSaleConfig,
    suggestionSaleConfig,
  } = useSaleManager({ products, updateSaleStatus });

  useEffect(() => {
    let lightningInterval: ReturnType<typeof setInterval> | null = null;
    let suggestionInterval: ReturnType<typeof setInterval> | null = null;

    // 번개세일 시작 (basic과 동일한 로직)
    const lightningTimer = setTimeout(() => {
      startLightningSale(); // 즉시 한 번 실행
      lightningInterval = setInterval(
        startLightningSale,
        lightningSaleConfig.interval
      );
    }, lightningSaleConfig.delay);

    // 추천세일 시작 (basic과 동일한 로직)
    const suggestionTimer = setTimeout(() => {
      startSuggestionSale(); // 즉시 한 번 실행
      suggestionInterval = setInterval(
        startSuggestionSale,
        suggestionSaleConfig.interval
      );
    }, suggestionSaleConfig.delay);

    return () => {
      clearTimeout(lightningTimer);
      clearTimeout(suggestionTimer);
      if (lightningInterval) clearInterval(lightningInterval);
      if (suggestionInterval) clearInterval(suggestionInterval);
    };
  }, [
    startLightningSale,
    startSuggestionSale,
    lightningSaleConfig,
    suggestionSaleConfig,
  ]);
}
