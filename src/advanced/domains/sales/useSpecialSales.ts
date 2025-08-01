import { useState, useEffect, useCallback } from "react";
import { IProduct } from "../../types";
import { SALE_INTERVALS } from "./constants";
import { DISCOUNT_RULES } from "../discounts/constants";

interface LightningSaleEvent {
  productId: string;
  productName: string;
  discountRate: number;
  timestamp: number;
}

interface RecommendationEvent {
  productId: string;
  productName: string;
  discountRate: number;
  timestamp: number;
}

interface SpecialSalesState {
  isLightningSaleActive: boolean;
  isRecommendationActive: boolean;
  lastLightningSale: LightningSaleEvent | null;
  lastRecommendation: RecommendationEvent | null;
}

/**
 * Sales 도메인 - 특별 세일 타이머 훅
 *
 * 기존 startSpecialSaleTimers 함수를 React 훅으로 변환
 * - useEffect로 타이머 관리
 * - 번개세일 랜덤 타이머
 * - 추천할인 타이머
 * - 알림 이벤트 처리
 */
export function useSpecialSales(
  products: IProduct[],
  lastSelectedProductId: string | null,
  hasCartItems: boolean,
  onLightningSale: (product: IProduct) => void,
  onRecommendationSale: (product: IProduct) => void,
  onShowAlert: (message: string) => void,
) {
  const [salesState, setSalesState] = useState<SpecialSalesState>({
    isLightningSaleActive: false,
    isRecommendationActive: false,
    lastLightningSale: null,
    lastRecommendation: null,
  });

  /**
   * 번개세일 실행
   */
  const executeLightningSale = useCallback(() => {
    const availableProducts = products.filter((product) => product.quantity > 0 && !product.onSale);

    if (availableProducts.length === 0) return;

    const luckyIdx = Math.floor(Math.random() * availableProducts.length);
    const luckyItem = availableProducts[luckyIdx];

    // 번개세일 상태 업데이트
    const saleEvent: LightningSaleEvent = {
      productId: luckyItem.id,
      productName: luckyItem.name,
      discountRate: DISCOUNT_RULES.LIGHTNING_SALE_RATE,
      timestamp: Date.now(),
    };

    setSalesState((prev) => ({
      ...prev,
      isLightningSaleActive: true,
      lastLightningSale: saleEvent,
    }));

    // 상품 세일 상태 업데이트
    onLightningSale(luckyItem);

    // 알림 표시
    onShowAlert(`⚡번개세일! ${luckyItem.name}이(가) ${DISCOUNT_RULES.LIGHTNING_SALE_RATE}% 할인 중입니다!`);

    // 일정 시간 후 번개세일 상태 비활성화
    setTimeout(() => {
      setSalesState((prev) => ({
        ...prev,
        isLightningSaleActive: false,
      }));
    }, SALE_INTERVALS.LIGHTNING_SALE_INTERVAL);
  }, [products, onLightningSale, onShowAlert]);

  /**
   * 추천할인 실행
   */
  const executeRecommendation = useCallback(() => {
    if (!hasCartItems || !lastSelectedProductId) return;

    const availableProducts = products.filter(
      (product) => product.id !== lastSelectedProductId && product.quantity > 0 && !product.suggestSale,
    );

    if (availableProducts.length === 0) return;

    const suggest = availableProducts[0]; // 첫 번째 추천 상품

    // 추천할인 상태 업데이트
    const recommendationEvent: RecommendationEvent = {
      productId: suggest.id,
      productName: suggest.name,
      discountRate: DISCOUNT_RULES.RECOMMENDATION_DISCOUNT_RATE,
      timestamp: Date.now(),
    };

    setSalesState((prev) => ({
      ...prev,
      isRecommendationActive: true,
      lastRecommendation: recommendationEvent,
    }));

    // 상품 추천 할인 적용
    onRecommendationSale(suggest);

    // 알림 표시
    onShowAlert(
      `💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 ${DISCOUNT_RULES.RECOMMENDATION_DISCOUNT_RATE}% 추가 할인!`,
    );

    // 일정 시간 후 추천할인 상태 비활성화
    setTimeout(() => {
      setSalesState((prev) => ({
        ...prev,
        isRecommendationActive: false,
      }));
    }, SALE_INTERVALS.RECOMMENDATION_INTERVAL);
  }, [products, lastSelectedProductId, hasCartItems, onRecommendationSale, onShowAlert]);

  /**
   * 번개세일 타이머 설정
   */
  useEffect(() => {
    const lightningDelay = Math.random() * SALE_INTERVALS.LIGHTNING_SALE_INITIAL_DELAY;

    const initialTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        executeLightningSale();
      }, SALE_INTERVALS.LIGHTNING_SALE_INTERVAL);

      return () => clearInterval(interval);
    }, lightningDelay);

    return () => clearTimeout(initialTimeout);
  }, [executeLightningSale]);

  /**
   * 추천할인 타이머 설정
   */
  useEffect(() => {
    const recommendationDelay = Math.random() * 20000; // 0-20초 랜덤 딜레이

    const initialTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        executeRecommendation();
      }, SALE_INTERVALS.RECOMMENDATION_INTERVAL);

      return () => clearInterval(interval);
    }, recommendationDelay);

    return () => clearTimeout(initialTimeout);
  }, [executeRecommendation]);

  /**
   * 특별 세일 상태 초기화
   */
  const resetSalesState = useCallback(() => {
    setSalesState({
      isLightningSaleActive: false,
      isRecommendationActive: false,
      lastLightningSale: null,
      lastRecommendation: null,
    });
  }, []);

  return {
    salesState,
    resetSalesState,
    executeLightningSale,
    executeRecommendation,
  };
}
