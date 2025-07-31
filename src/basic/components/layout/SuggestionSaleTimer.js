import { DISCOUNT_RATE_SUGGESTION } from '../../data/discount.data.js';
import { PRODUCT_LIST } from '../../data/product.data.js';
import { SUGGESTION_SALE_INTERVAL, SUGGESTION_SALE_MAX_DELAY } from '../../data/time.data.js';

/**
 * 추천할인 타이머를 관리하는 컴포넌트
 * @param {Function} doUpdatePricesInCart - 장바구니 가격 업데이트 콜백
 * @param {Object} state - 앱 상태 객체 (lastSelect, cartDisplay 포함)
 * @returns {Object} 타이머 시작/중지 메서드를 포함한 객체
 */
export function createSuggestionSaleTimer(doUpdatePricesInCart, state) {
  let suggestionIntervalId = null;
  let suggestionTimeoutId = null;

  /**
   * 추천할인 이벤트를 실행합니다
   */
  function executeSuggestionSale() {
    // 장바구니가 비어있거나 마지막 선택한 상품이 없으면 실행하지 않음
    if (state.cartDisplay.children.length === 0 || !state.lastSelect) {
      return;
    }

    // 마지막 선택한 상품과 다른 상품 중 추천할 상품 찾기
    let suggest = null;
    for (let k = 0; k < PRODUCT_LIST.length; k++) {
      if (PRODUCT_LIST[k].id !== state.lastSelect) {
        if (PRODUCT_LIST[k].q > 0 && !PRODUCT_LIST[k].suggestSale) {
          suggest = PRODUCT_LIST[k];
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

      suggest.val = Math.round((suggest.val * (100 - DISCOUNT_RATE_SUGGESTION)) / 100);
      suggest.suggestSale = true;

      doUpdatePricesInCart();
    }
  }

  /**
   * 추천할인 타이머를 시작합니다
   */
  function startSuggestionSaleTimer() {
    const suggestionDelay = Math.random() * SUGGESTION_SALE_MAX_DELAY;

    suggestionTimeoutId = setTimeout(() => {
      suggestionIntervalId = setInterval(executeSuggestionSale, SUGGESTION_SALE_INTERVAL);
    }, suggestionDelay);
  }

  /**
   * 추천할인 타이머를 중지합니다
   */
  function stopSuggestionSaleTimer() {
    if (suggestionTimeoutId) {
      clearTimeout(suggestionTimeoutId);
      suggestionTimeoutId = null;
    }

    if (suggestionIntervalId) {
      clearInterval(suggestionIntervalId);
      suggestionIntervalId = null;
    }
  }

  /**
   * 추천할인 타이머를 재시작합니다
   */
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
