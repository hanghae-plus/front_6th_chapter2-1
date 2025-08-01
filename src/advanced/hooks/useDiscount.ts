import { useCallback, useEffect, useState } from 'react';

import { DiscountState } from '../lib/discount';
import { PRODUCTS } from '../lib/product';

export const useDiscount = () => {
  const [discountState, setDiscountState] = useState<DiscountState>({
    lightningSale: {
      isActive: false,
      productId: null,
      startTime: null,
    },
    recommendation: {
      isActive: false,
      productId: null,
      startTime: null,
    },
  });

  const [lastSelectedProduct, setLastSelectedProduct] = useState<string | null>(null);

  // 무작위 상품 선택 (재고가 있는 상품만)
  const getRandomProductWithStock = useCallback(() => {
    const availableProducts = PRODUCTS.filter((product) => product.stock > 0);
    if (availableProducts.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * availableProducts.length);
    return availableProducts[randomIndex].id;
  }, []);

  // 번개세일 시작
  const startLightningSale = useCallback(() => {
    const productId = getRandomProductWithStock();
    if (!productId) return;

    setDiscountState((prev) => ({
      ...prev,
      lightningSale: {
        isActive: true,
        productId,
        startTime: Date.now(),
      },
    }));

    // 알림창 표시
    const product = PRODUCTS.find((p) => p.id === productId);
    if (product) {
      alert(`⚡ 번개세일! ${product.name} 20% 할인!`);
    }
  }, [getRandomProductWithStock]);

  // 추천할인 시작
  const startRecommendation = useCallback(() => {
    if (!lastSelectedProduct) return;

    // 마지막 선택 상품과 다른 상품 선택
    const otherProducts = PRODUCTS.filter(
      (product) => product.id !== lastSelectedProduct && product.stock > 0,
    );

    if (otherProducts.length === 0) return;

    const randomIndex = Math.floor(Math.random() * otherProducts.length);
    const productId = otherProducts[randomIndex].id;

    setDiscountState((prev) => ({
      ...prev,
      recommendation: {
        isActive: true,
        productId,
        startTime: Date.now(),
      },
    }));

    // 알림창 표시
    const product = PRODUCTS.find((p) => p.id === productId);
    if (product) {
      alert(`💝 추천할인! ${product.name} 5% 추가 할인!`);
    }
  }, [lastSelectedProduct]);

  // 번개세일 종료
  const stopLightningSale = useCallback(() => {
    setDiscountState((prev) => ({
      ...prev,
      lightningSale: {
        isActive: false,
        productId: null,
        startTime: null,
      },
    }));
  }, []);

  // 추천할인 종료
  const stopRecommendation = useCallback(() => {
    setDiscountState((prev) => ({
      ...prev,
      recommendation: {
        isActive: false,
        productId: null,
        startTime: null,
      },
    }));
  }, []);

  // 마지막 선택 상품 업데이트
  const updateLastSelectedProduct = useCallback((productId: string) => {
    setLastSelectedProduct(productId);
  }, []);

  // 번개세일 타이머 (30초마다)
  useEffect(() => {
    const lightningSaleTimer = setInterval(() => {
      if (discountState.lightningSale.isActive) {
        stopLightningSale();
      }
      startLightningSale();
    }, 30000);

    return () => clearInterval(lightningSaleTimer);
  }, [discountState.lightningSale.isActive, startLightningSale, stopLightningSale]);

  // 추천할인 타이머 (60초마다)
  useEffect(() => {
    const recommendationTimer = setInterval(() => {
      if (discountState.recommendation.isActive) {
        stopRecommendation();
      }
      startRecommendation();
    }, 60000);

    return () => clearInterval(recommendationTimer);
  }, [discountState.recommendation.isActive, startRecommendation, stopRecommendation]);

  // 초기 번개세일 시작 (0~10초 사이)
  useEffect(() => {
    const initialDelay = Math.random() * 10000; // 0~10초
    const timer = setTimeout(() => {
      startLightningSale();
    }, initialDelay);

    return () => clearTimeout(timer);
  }, [startLightningSale]);

  // 초기 추천할인 시작 (0~20초 사이)
  useEffect(() => {
    const initialDelay = Math.random() * 20000; // 0~20초
    const timer = setTimeout(() => {
      startRecommendation();
    }, initialDelay);

    return () => clearTimeout(timer);
  }, [startRecommendation]);

  return {
    discountState,
    lastSelectedProduct,
    updateLastSelectedProduct,
  };
};
