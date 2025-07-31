// src/services/LightningSaleService.js
import {
  LIGHTNING_SALE_DISCOUNT,
  LIGHTNING_SALE_INTERVAL,
  LIGHTNING_DELAY_RANGE,
} from '../constants.js';

// 타이머 상태를 관리하는 객체
const timerState = {
  lightningSaleInterval: null,
  lightningSaleTimeout: null,
};

/**
 * 번개세일 타이머를 시작합니다.
 * @param {Array} productList - 상품 목록
 * @param {Function} doUpdatePricesInCart - 가격 업데이트 함수
 */
export function startLightningSaleTimer(productList, doUpdatePricesInCart) {
  const lightningDelay = Math.random() * LIGHTNING_DELAY_RANGE;

  timerState.lightningSaleTimeout = setTimeout(() => {
    timerState.lightningSaleInterval = setInterval(() => {
      triggerLightningSale(productList, doUpdatePricesInCart);
    }, LIGHTNING_SALE_INTERVAL);
  }, lightningDelay);
}

/**
 * 번개세일을 트리거합니다.
 * @param {Array} productList - 상품 목록
 * @param {Function} doUpdatePricesInCart - 가격 업데이트 함수
 */
function triggerLightningSale(productList, doUpdatePricesInCart) {
  const luckyIdx = Math.floor(Math.random() * productList.length);
  const luckyItem = productList[luckyIdx];

  if (luckyItem.q > 0 && !luckyItem.onSale) {
    luckyItem.val = Math.round((luckyItem.originalVal * (100 - LIGHTNING_SALE_DISCOUNT)) / 100);
    luckyItem.onSale = true;

    alert(`⚡번개세일! ${luckyItem.name} 이(가) ${LIGHTNING_SALE_DISCOUNT}% 할인 중입니다!`);

    doUpdatePricesInCart();
  }
}

/**
 * 번개세일 타이머를 중지합니다.
 */
export function stopLightningSaleTimer() {
  if (timerState.lightningSaleTimeout) {
    clearTimeout(timerState.lightningSaleTimeout);
    timerState.lightningSaleTimeout = null;
  }

  if (timerState.lightningSaleInterval) {
    clearInterval(timerState.lightningSaleInterval);
    timerState.lightningSaleInterval = null;
  }
}

/**
 * 번개세일 상태를 초기화합니다.
 * @param {Array} productList - 상품 목록
 */
export function resetLightningSale(productList) {
  productList.forEach((product) => {
    if (product.onSale) {
      product.val = product.originalVal;
      product.onSale = false;
    }
  });
}

/**
 * 번개세일 서비스를 생성합니다.
 * @param {Array} productList - 상품 목록
 * @param {Function} doUpdatePricesInCart - 가격 업데이트 함수
 * @returns {Object} 번개세일 서비스 객체
 */
export function createLightningSaleService(productList, doUpdatePricesInCart) {
  return {
    startLightningSaleTimer: () => startLightningSaleTimer(productList, doUpdatePricesInCart),
    stopLightningSaleTimer,
    resetLightningSale: () => resetLightningSale(productList),
  };
}
