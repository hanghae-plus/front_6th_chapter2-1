import { useEffect, useRef } from 'react';

import { useCartContext } from '@/store/CartContext';
import { useProductContext } from '@/store/ProductContext';
import { applyLightningSale, applySuggestSale } from '@/usecase/discountEvent';

/** 번개세일 및 추천세일 실행 */
export const useDiscountEvent = () => {
  const { products, updateProduct } = useProductContext();
  const { lastAddedItem } = useCartContext();

  // 타이머 ID 저장용 ref (언마운트 시 clearInterval 위해)
  const lightningIntervalRef = useRef<number | null>(null);
  const suggestIntervalRef = useRef<number | null>(null);
  const lightningTimeoutRef = useRef<number | null>(null);
  const suggestTimeoutRef = useRef<number | null>(null);

  // 초기 한 번만 실행시키기 위해 참조값들은 useRef에 저장
  const productsRef = useRef(products);
  const lastAddedItemRef = useRef(lastAddedItem);
  productsRef.current = products;
  lastAddedItemRef.current = lastAddedItem;

  useEffect(() => {
    const lightningDelay = Math.random() * 10000;

    // 번개세일 실행 함수
    const tryApplyLightningSale = () => {
      const result = applyLightningSale(productsRef.current);
      if (result) {
        updateProduct(result.id, result.changes);
        window.alert(result.message);
      }
    };

    // 번개세일 초기 딜레이 후 30초마다 실행
    lightningTimeoutRef.current = setTimeout(() => {
      tryApplyLightningSale();

      lightningIntervalRef.current = setInterval(() => {
        tryApplyLightningSale();
      }, 30000);
    }, lightningDelay);

    // 추천세일
    const suggestDelay = Math.random() * 20000;

    const tryApplySuggestSale = () => {
      const result = applySuggestSale(productsRef.current, lastAddedItemRef.current);
      if (result) {
        updateProduct(result.id, result.changes);
        window.alert(result.message);
      }
    };
    suggestTimeoutRef.current = setTimeout(() => {
      tryApplySuggestSale();

      suggestIntervalRef.current = setInterval(() => {
        tryApplySuggestSale();
      }, 60000);
    }, suggestDelay);

    return () => {
      if (lightningIntervalRef.current) clearInterval(lightningIntervalRef.current);
      if (suggestIntervalRef.current) clearInterval(suggestIntervalRef.current);
      if (lightningTimeoutRef.current) clearTimeout(lightningTimeoutRef.current);
      if (suggestTimeoutRef.current) clearTimeout(suggestTimeoutRef.current);
    };
  }, []);
};
