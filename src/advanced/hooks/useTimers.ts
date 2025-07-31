import { useEffect, useCallback, useRef } from 'react';
import { CartItemType, ProductType } from '../types';
import { PRODUCT_LIST } from '../constants';

export const useTimers = (
  updateProductList: (newProductList: ProductType[]) => void,
  updateCalculation: () => void,
  cartItems: CartItemType[],
  selectedProduct: string,
  lastSelectedProduct: string,
  onApplyDiscount: (productId: string, discountType: 'lightning' | 'suggest') => void
) => {
  // 타이머 참조를 저장하여 cleanup 시 사용
  const timerRefs = useRef<{
    lightningTimer?: NodeJS.Timeout;
    suggestTimer?: NodeJS.Timeout;
    lightningInterval?: NodeJS.Timeout;
    suggestInterval?: NodeJS.Timeout;
  }>({});

  // 사용 가능한 상품 필터링 함수 (메모이제이션)
  const getAvailableProducts = useCallback(() => {
    return PRODUCT_LIST.filter((product) => product.quantity > 0);
  }, []);

  // 랜덤 상품 선택 함수 (메모이제이션)
  const selectRandomProduct = useCallback((products: ProductType[], excludeId?: string) => {
    const availableProducts = excludeId
      ? products.filter((product) => product.id !== excludeId)
      : products;

    if (availableProducts.length === 0) return null;

    return availableProducts[Math.floor(Math.random() * availableProducts.length)];
  }, []);

  // 번개세일 실행 함수 (메모이제이션)
  const executeLightningSale = useCallback(() => {
    const availableProducts = getAvailableProducts();
    const randomProduct = selectRandomProduct(availableProducts);

    if (randomProduct) {
      onApplyDiscount(randomProduct.id, 'lightning');
      alert(`⚡ 번개세일! ${randomProduct.name} 20% 할인!`);
    }
  }, [getAvailableProducts, selectRandomProduct, onApplyDiscount]);

  // 추천할인 실행 함수 (메모이제이션)
  const executeSuggestSale = useCallback(() => {
    const availableProducts = getAvailableProducts();
    const randomProduct = selectRandomProduct(availableProducts, lastSelectedProduct);

    if (randomProduct) {
      onApplyDiscount(randomProduct.id, 'suggest');
      alert(`💝 추천할인! ${randomProduct.name} 5% 추가 할인!`);
    }
  }, [getAvailableProducts, selectRandomProduct, lastSelectedProduct, onApplyDiscount]);

  // 타이머 정리 함수
  const clearAllTimers = useCallback(() => {
    const { lightningTimer, suggestTimer, lightningInterval, suggestInterval } = timerRefs.current;

    if (lightningTimer) clearTimeout(lightningTimer);
    if (suggestTimer) clearTimeout(suggestTimer);
    if (lightningInterval) clearInterval(lightningInterval);
    if (suggestInterval) clearInterval(suggestInterval);

    timerRefs.current = {};
  }, []);

  useEffect(() => {
    // 이전 타이머들 정리
    clearAllTimers();

    // 초기 타이머 시작 (랜덤 딜레이)
    const lightningDelay = Math.random() * 10000; // 0~10초
    const suggestDelay = Math.random() * 20000; // 0~20초

    timerRefs.current.lightningTimer = setTimeout(executeLightningSale, lightningDelay);
    timerRefs.current.suggestTimer = setTimeout(executeSuggestSale, suggestDelay);

    // 주기적 타이머 설정
    timerRefs.current.lightningInterval = setInterval(executeLightningSale, 30000);
    timerRefs.current.suggestInterval = setInterval(executeSuggestSale, 60000);

    // 계산 결과 업데이트
    updateCalculation();

    // cleanup 함수
    return clearAllTimers;
  }, [executeLightningSale, executeSuggestSale, updateCalculation, clearAllTimers]);
};
