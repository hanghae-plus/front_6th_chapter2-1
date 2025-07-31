import { useEffect, useRef } from "react";
import type { Product } from "../types";
import {
  startLightningSaleTimer,
  startRecommendationTimer,
  clearAllTimers,
} from "../services/alertService";

interface UseAlertTimersProps {
  products: Product[];
  onProductUpdate: () => void;
}

export const useAlertTimers = ({
  products,
  onProductUpdate,
}: UseAlertTimersProps) => {
  // 최신 값들을 ref로 저장
  const productsRef = useRef(products);
  const onProductUpdateRef = useRef(onProductUpdate);

  // ref 업데이트
  useEffect(() => {
    productsRef.current = products;
    onProductUpdateRef.current = onProductUpdate;
  }, [products, onProductUpdate]);

  // 알럿 타이머 초기화 (한 번만 실행)
  useEffect(() => {
    // 번개세일 타이머 시작
    startLightningSaleTimer({
      products: productsRef.current,
      onProductUpdate: onProductUpdateRef.current,
    });

    // 추천할인 타이머 시작
    startRecommendationTimer({
      products: productsRef.current,
      onProductUpdate: onProductUpdateRef.current,
    });

    // 클린업 함수
    return () => {
      clearAllTimers();
    };
  }, []); // 빈 의존성 배열로 한 번만 실행
};
