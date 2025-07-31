import { useState, useCallback, useEffect, useRef } from 'react';
import { SaleEvent, UseAutoEventsReturn } from '../types/index.js';
import { AUTO_EVENT_CONFIG, DISCOUNT_POLICY, EVENT_CONSTANTS } from '../constants/index.js';
import { 
  getRandomProduct, 
  createSaleEvent, 
  filterExistingEvents 
} from '../utils';

// 타이머 타입
type TimerRef = React.MutableRefObject<number | null>;

// 타이머 정리
const clearTimer = (timerRef: TimerRef): void => {
  if (timerRef.current) {
    clearTimeout(timerRef.current);
    clearInterval(timerRef.current);
    timerRef.current = EVENT_CONSTANTS.TIMER_INITIAL;
  }
};

// 자동 이벤트 (번개세일, 추천할인)를 위한 커스텀 훅
export const useAutoEvents = (): UseAutoEventsReturn => {
  const [activeSales, setActiveSales] = useState<SaleEvent[]>([]);
  const lightningTimerRef = useRef<number | null>(EVENT_CONSTANTS.TIMER_INITIAL);
  const suggestedTimerRef = useRef<number | null>(EVENT_CONSTANTS.TIMER_INITIAL);
  const isRunningRef = useRef<boolean>(EVENT_CONSTANTS.EVENT_STATUS.STOPPED);

  // 번개세일 이벤트 생성 및 적용
  const createLightningSaleEvent = useCallback((): void => {
    try {
      const randomProduct = getRandomProduct();
      const lightningEvent = createSaleEvent(
        'lightning',
        randomProduct,
        DISCOUNT_POLICY.LIGHTNING_SALE_RATE
      );
      
      setActiveSales(prev => {
        const filtered = filterExistingEvents(prev, lightningEvent);
        return [...filtered, lightningEvent];
      });
    } catch (error) {
      console.error('번개세일 이벤트 생성 실패:', error);
    }
  }, []);

  // 추천할인 이벤트 생성 및 적용
  const createSuggestedSaleEvent = useCallback((excludeProductId: string): void => {
    try {
      const suggestedProduct = getRandomProduct(excludeProductId);
      const suggestedEvent = createSaleEvent(
        'suggested',
        suggestedProduct,
        DISCOUNT_POLICY.SUGGESTED_SALE_RATE
      );
      
      setActiveSales(prev => {
        const filtered = filterExistingEvents(prev, suggestedEvent);
        return [...filtered, suggestedEvent];
      });
    } catch (error) {
      console.error('추천할인 이벤트 생성 실패:', error);
    }
  }, []);

  // 번개세일 타이머 설정
  const setupLightningSaleTimer = useCallback((): void => {
    lightningTimerRef.current = setTimeout(() => {
      const interval = setInterval(createLightningSaleEvent, AUTO_EVENT_CONFIG.LIGHTNING_SALE_INTERVAL);
      lightningTimerRef.current = interval;
    }, AUTO_EVENT_CONFIG.LIGHTNING_SALE_DELAY);
  }, [createLightningSaleEvent]);

  // 추천할인 타이머 설정
  const setupSuggestedSaleTimer = useCallback((lastSelectedProductId: string): void => {
    if (!lastSelectedProductId) return;
    
    suggestedTimerRef.current = setTimeout(() => {
      const interval = setInterval(
        () => createSuggestedSaleEvent(lastSelectedProductId),
        AUTO_EVENT_CONFIG.SUGGESTED_SALE_INTERVAL
      );
      suggestedTimerRef.current = interval;
    }, AUTO_EVENT_CONFIG.SUGGESTED_SALE_DELAY);
  }, [createSuggestedSaleEvent]);

  // 자동 이벤트 시작
  const startAutoEvents = useCallback((lastSelectedProductId: string): void => {
    if (isRunningRef.current) {
      console.warn('자동 이벤트가 이미 실행 중입니다.');
      return;
    }
    
    isRunningRef.current = EVENT_CONSTANTS.EVENT_STATUS.RUNNING;
    
    try {
      setupLightningSaleTimer();
      setupSuggestedSaleTimer(lastSelectedProductId);
    } catch (error) {
      console.error('자동 이벤트 시작 실패:', error);
      isRunningRef.current = EVENT_CONSTANTS.EVENT_STATUS.STOPPED;
    }
  }, [setupLightningSaleTimer, setupSuggestedSaleTimer]);

  // 자동 이벤트 중지
  const stopAutoEvents = useCallback((): void => {
    isRunningRef.current = EVENT_CONSTANTS.EVENT_STATUS.STOPPED;
    
    clearTimer(lightningTimerRef);
    clearTimer(suggestedTimerRef);
    setActiveSales([]);
  }, []);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      stopAutoEvents();
    };
  }, [stopAutoEvents]);

  return {
    activeSales,
    startAutoEvents,
    stopAutoEvents,
  };
};