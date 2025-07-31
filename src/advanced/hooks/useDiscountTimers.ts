import { useEffect, useRef } from 'react';

import { UseDiscountTimersProps } from '../types';

export function useDiscountTimers({
  products,
  updateProductSaleStatus,
  updateProductRecommendStatus,
  lastSelectedProductId,
}: UseDiscountTimersProps) {
  const lightningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recommendTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const productsRef = useRef(products);
  const updateProductSaleStatusRef = useRef(updateProductSaleStatus);
  const updateProductRecommendStatusRef = useRef(updateProductRecommendStatus);
  const lastSelectedProductIdRef = useRef(lastSelectedProductId);

  // 최신 props들을 ref에 동기화
  useEffect(() => {
    productsRef.current = products;
    updateProductSaleStatusRef.current = updateProductSaleStatus;
    updateProductRecommendStatusRef.current = updateProductRecommendStatus;
    lastSelectedProductIdRef.current = lastSelectedProductId;
  }, [products, updateProductSaleStatus, updateProductRecommendStatus, lastSelectedProductId]);

  useEffect(() => {
    const startLightningSale = () => {
      const availableProducts = productsRef.current.filter((p) => p.stock > 0 && !p.isOnSale);

      if (availableProducts.length > 0) {
        const product = getRandomItem(availableProducts);
        const salePrice = Math.round(product.originalPrice * 0.8);

        updateProductSaleStatusRef.current(product.productId, true, salePrice);
        alert(`⚡번개세일! ${product.name}이(가) 20% 할인 중입니다!`);
      }

      lightningTimerRef.current = setTimeout(startLightningSale, 30000);
    };

    const startRecommendation = () => {
      const selectedId = lastSelectedProductIdRef.current;

      if (selectedId) {
        const availableProducts = productsRef.current.filter(
          (p) => p.productId !== selectedId && p.stock > 0 && !p.isRecommended
        );

        if (availableProducts.length > 0) {
          const product = getRandomItem(availableProducts);
          const recommendPrice = Math.round(product.price * 0.95);

          updateProductRecommendStatusRef.current(product.productId, true, recommendPrice);
          alert(`💝 ${product.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
        }
      }

      recommendTimerRef.current = setTimeout(startRecommendation, 60000);
    };

    const lightningDelay = Math.random() * 10000;
    const recommendDelay = Math.random() * 20000;

    lightningTimerRef.current = setTimeout(startLightningSale, lightningDelay);
    recommendTimerRef.current = setTimeout(startRecommendation, recommendDelay);

    return () => {
      if (lightningTimerRef.current) clearTimeout(lightningTimerRef.current);
      if (recommendTimerRef.current) clearTimeout(recommendTimerRef.current);
    };
  }, []);

  return null;
}

// utils
function getRandomItem<T>(list: T[]): T {
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}
