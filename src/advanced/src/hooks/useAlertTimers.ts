import { useEffect } from "react";
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
  // 알럿 타이머 초기화 (한 번만 실행)
  useEffect(() => {
    // 번개세일 타이머 시작
    startLightningSaleTimer({
      products,
      onProductUpdate,
    });

    // 추천할인 타이머 시작
    startRecommendationTimer({
      products,
      onProductUpdate,
    });

    // 클린업 함수
    return () => {
      clearAllTimers();
    };
  }, [products, onProductUpdate]);
};
