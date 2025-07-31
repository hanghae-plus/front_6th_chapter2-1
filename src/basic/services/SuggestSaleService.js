// src/services/SuggestSaleService.js
import { SUGGEST_SALE_DISCOUNT, SUGGEST_SALE_INTERVAL, SUGGEST_DELAY_RANGE } from '../constants.js';

// 타이머 상태를 관리하는 객체
const timerState = {
  suggestSaleInterval: null,
  suggestSaleTimeout: null,
};

/**
 * 추천할인 타이머를 시작합니다.
 * @param {Array} productList - 상품 목록
 * @param {Object} productState - 상품 상태
 * @param {Function} doUpdatePricesInCart - 가격 업데이트 함수
 */
export function startSuggestSaleTimer(productList, productState, doUpdatePricesInCart) {
  const delay = Math.random() * SUGGEST_DELAY_RANGE;

  timerState.suggestSaleTimeout = setTimeout(() => {
    timerState.suggestSaleInterval = setInterval(() => {
      triggerSuggestSale(productList, productState, doUpdatePricesInCart);
    }, SUGGEST_SALE_INTERVAL);
  }, delay);
}

/**
 * 추천할인을 트리거합니다.
 * @param {Array} productList - 상품 목록
 * @param {Object} productState - 상품 상태
 * @param {Function} doUpdatePricesInCart - 가격 업데이트 함수
 */
function triggerSuggestSale(productList, productState, doUpdatePricesInCart) {
  if (productState.selectedProduct) {
    const suggest = findSuggestProduct(productList, productState.selectedProduct);

    if (suggest) {
      alert(
        `�� ${suggest.name} 은(는) 어떠세요? 지금 구매하시면 ${SUGGEST_SALE_DISCOUNT}% 추가 할인!`
      );

      applySuggestSale(suggest);
      doUpdatePricesInCart();
    }
  }
}

/**
 * 추천할 상품을 찾습니다.
 * @param {Array} productList - 상품 목록
 * @param {string} selectedProductId - 선택된 상품 ID
 * @returns {Object|null} 추천할 상품 또는 null
 */
function findSuggestProduct(productList, selectedProductId) {
  return productList.find(
    (product) => product.id !== selectedProductId && product.quantity > 0 && !product.suggestSale
  );
}

/**
 * 추천할인을 적용합니다.
 * @param {Object} product - 상품 정보
 */
function applySuggestSale(product) {
  product.val = Math.round((product.val * (100 - SUGGEST_SALE_DISCOUNT)) / 100);
  product.suggestSale = true;
}

/**
 * 추천할인 타이머를 중지합니다.
 */
export function stopSuggestSaleTimer() {
  if (timerState.suggestSaleTimeout) {
    clearTimeout(timerState.suggestSaleTimeout);
    timerState.suggestSaleTimeout = null;
  }

  if (timerState.suggestSaleInterval) {
    clearInterval(timerState.suggestSaleInterval);
    timerState.suggestSaleInterval = null;
  }
}

/**
 * 추천할인 상태를 초기화합니다.
 * @param {Array} productList - 상품 목록
 */
export function resetSuggestSale(productList) {
  productList.forEach((product) => {
    if (product.suggestSale) {
      product.val = product.originalVal;
      product.suggestSale = false;
    }
  });
}

/**
 * 추천할인 서비스를 생성합니다.
 * @param {Array} productList - 상품 목록
 * @param {Object} productState - 상품 상태
 * @param {Function} doUpdatePricesInCart - 가격 업데이트 함수
 * @returns {Object} 추천할인 서비스 객체
 */
export function createSuggestSaleService(productList, productState, doUpdatePricesInCart) {
  return {
    startSuggestSaleTimer: () =>
      startSuggestSaleTimer(productList, productState, doUpdatePricesInCart),
    stopSuggestSaleTimer,
    resetSuggestSale: () => resetSuggestSale(productList),
  };
}
