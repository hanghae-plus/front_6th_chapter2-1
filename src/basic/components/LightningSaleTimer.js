import { DISCOUNT_RATE_LIGHTNING } from "../data/discount.data.js";
import { PRODUCT_LIST } from "../data/product.data.js";
import { LIGHTNING_SALE_MAX_DELAY, LIGHTNING_SALE_INTERVAL } from "../data/time.data.js";

/**
 * 번개세일 타이머를 관리하는 컴포넌트
 * @param {Function} onUpdateSelectOptions - 상품 옵션 업데이트 콜백
 * @param {Function} doUpdatePricesInCart - 장바구니 가격 업데이트 콜백
 * @returns {Object} 타이머 시작/중지 메서드를 포함한 객체
 */
export function createLightningSaleTimer(doUpdatePricesInCart) {
  let lightningIntervalId = null;
  let lightningTimeoutId = null;

  /**
   * 번개세일 이벤트를 실행합니다
   */
  function executeLightningSale() {
    const luckyIdx = Math.floor(Math.random() * PRODUCT_LIST.length);
    const luckyItem = PRODUCT_LIST[luckyIdx];

    if (luckyItem.q > 0 && !luckyItem.onSale) {
      luckyItem.val = Math.round((luckyItem.originalVal * (100 - DISCOUNT_RATE_LIGHTNING)) / 100);
      luckyItem.onSale = true;

      alert(
        "⚡번개세일! " + luckyItem.name + "이(가) " + DISCOUNT_RATE_LIGHTNING + "% 할인 중입니다!"
      );

      doUpdatePricesInCart();
    }
  }

  /**
   * 번개세일 타이머를 시작합니다
   */
  function startLightningSaleTimer() {
    const lightningDelay = Math.random() * LIGHTNING_SALE_MAX_DELAY;

    lightningTimeoutId = setTimeout(() => {
      lightningIntervalId = setInterval(executeLightningSale, LIGHTNING_SALE_INTERVAL);
    }, lightningDelay);
  }

  /**
   * 번개세일 타이머를 중지합니다
   */
  function stopLightningSaleTimer() {
    if (lightningTimeoutId) {
      clearTimeout(lightningTimeoutId);
      lightningTimeoutId = null;
    }

    if (lightningIntervalId) {
      clearInterval(lightningIntervalId);
      lightningIntervalId = null;
    }
  }

  /**
   * 번개세일 타이머를 재시작합니다
   */
  function restartLightningSaleTimer() {
    stopLightningSaleTimer();
    startLightningSaleTimer();
  }

  return {
    start: startLightningSaleTimer,
    stop: stopLightningSaleTimer,
    restart: restartLightningSaleTimer,
  };
}
