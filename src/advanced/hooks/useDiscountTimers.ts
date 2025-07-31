import { useEffect, useRef, useCallback } from 'react';
import { TIMER_CONFIG } from '../constants/config';

interface UseDiscountTimersProps {
  onLightningSale: () => void;
  onSuggestionSale: () => void;
}

export function useDiscountTimers({
  onLightningSale,
  onSuggestionSale,
}: UseDiscountTimersProps) {
  const lightningTimerRef = useRef<number | null>(null);
  const suggestionTimerRef = useRef<number | null>(null);

  const setupLightningTimer = useCallback(() => {
    const lightningDelay =
      Math.random() * TIMER_CONFIG.LIGHTNING_SALE_MAX_DELAY;
    console.log(`⚡ 번개세일 ${lightningDelay.toFixed(0)}ms 후 시작`);

    const lightningTimeout = setTimeout(() => {
      console.log('⚡ 번개세일 타이머 활성화!');
      lightningTimerRef.current = setInterval(
        onLightningSale,
        TIMER_CONFIG.LIGHTNING_SALE_INTERVAL
      );
    }, lightningDelay);

    return lightningTimeout;
  }, [onLightningSale]);

  const setupSuggestionTimer = useCallback(() => {
    const suggestionDelay = Math.random() * TIMER_CONFIG.SUGGESTION_MAX_DELAY;
    console.log(`💝 추천할인 ${suggestionDelay.toFixed(0)}ms 후 시작`);

    const suggestionTimeout = setTimeout(() => {
      console.log('💝 추천할인 타이머 활성화!');
      suggestionTimerRef.current = setInterval(
        onSuggestionSale,
        TIMER_CONFIG.SUGGESTION_INTERVAL
      );
    }, suggestionDelay);

    return suggestionTimeout;
  }, [onSuggestionSale]);

  const cleanupTimers = useCallback(
    (lightningTimeout: number, suggestionTimeout: number) => {
      clearTimeout(lightningTimeout);
      clearTimeout(suggestionTimeout);
      if (lightningTimerRef.current) clearInterval(lightningTimerRef.current);
      if (suggestionTimerRef.current) clearInterval(suggestionTimerRef.current);
    },
    []
  );

  useEffect(() => {
    console.log('⏰ 타이머 설정 시작');

    const lightningTimeout = setupLightningTimer();
    const suggestionTimeout = setupSuggestionTimer();

    return () => cleanupTimers(lightningTimeout, suggestionTimeout);
  }, [setupLightningTimer, setupSuggestionTimer, cleanupTimers]);

  return {
    lightningTimerRef,
    suggestionTimerRef,
  };
}
