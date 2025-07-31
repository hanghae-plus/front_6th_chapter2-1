import { useRef } from 'react';

import { DISCOUNT_RATE_SUGGESTION } from '@/advanced/data/discount.data';
import { SUGGESTION_SALE_INTERVAL, SUGGESTION_SALE_MAX_DELAY } from '@/advanced/data/time.data';
import { useCartStore, useProductStore } from '@/advanced/store';

export default function useSuggestionSaleTimer() {
  const { products, selectedProductId, setProductSuggestSale } = useProductStore();
  const { cartItems } = useCartStore();

  const suggestionIntervalId = useRef<number | null>(null);
  const suggestionTimeoutId = useRef<number | null>(null);

  function executeSuggestionSale() {
    // 장바구니가 비어있거나 마지막 선택한 상품이 없으면 실행하지 않음
    if (cartItems.length === 0 || !selectedProductId) {
      return;
    }

    // 마지막 선택한 상품과 다른 상품 중 추천할 상품 찾기
    let suggest = null;
    for (let k = 0; k < products.length; k++) {
      if (products[k].id !== selectedProductId) {
        if (products[k].stock > 0 && !products[k].suggestSale) {
          suggest = products[k];
          break;
        }
      }
    }

    if (suggest) {
      alert(
        '💝 ' +
          suggest.name +
          '은(는) 어떠세요? 지금 구매하시면 ' +
          DISCOUNT_RATE_SUGGESTION +
          '% 추가 할인!'
      );

      setProductSuggestSale(suggest.id, DISCOUNT_RATE_SUGGESTION);
    }
  }

  function startSuggestionSaleTimer() {
    const suggestionDelay = Math.random() * SUGGESTION_SALE_MAX_DELAY;

    suggestionTimeoutId.current = setTimeout(() => {
      suggestionIntervalId.current = setInterval(executeSuggestionSale, SUGGESTION_SALE_INTERVAL);
    }, suggestionDelay);
  }

  function stopSuggestionSaleTimer() {
    if (suggestionTimeoutId.current) {
      clearTimeout(suggestionTimeoutId.current);
      suggestionTimeoutId.current = null;
    }

    if (suggestionIntervalId.current) {
      clearInterval(suggestionIntervalId.current);
      suggestionIntervalId.current = null;
    }
  }

  function restartSuggestionSaleTimer() {
    stopSuggestionSaleTimer();
    startSuggestionSaleTimer();
  }

  return {
    start: startSuggestionSaleTimer,
    stop: stopSuggestionSaleTimer,
    restart: restartSuggestionSaleTimer,
  };
}
