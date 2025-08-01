/**
 * 프로모션 타이머를 관리하는 Custom Hook
 */

import { useEffect, useRef } from 'react';

interface UsePromotionTimerProps {
  callback: () => void;
  interval: number;
  delay: number;
  dependencies: readonly unknown[];
}

export const usePromotionTimer = ({ 
  callback, 
  interval, 
  delay, 
  dependencies 
}: UsePromotionTimerProps) => {
  const callbackRef = useRef(callback);
  
  // callback을 ref에 저장하여 의존성 문제 해결
  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    // 초기 딜레이 후 프로모션 시작
    const initialTimer = setTimeout(() => {
      callbackRef.current();
      
      // 주기적으로 프로모션 실행
      const intervalTimer = setInterval(() => {
        callbackRef.current();
      }, interval);
      
      return () => clearInterval(intervalTimer);
    }, delay);

    return () => {
      clearTimeout(initialTimer);
    };
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps
};