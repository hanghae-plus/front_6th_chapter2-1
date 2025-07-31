/**
 * 프로모션 관련 함수들
 * 번개세일, 추천할인 등의 프로모션 기능을 관리
 */
import {
  LIGHTNING_SALE_INTERVAL,
  LIGHTNING_SALE_RATE,
  SUGGEST_SALE_INTERVAL,
  SUGGEST_SALE_RATE,
} from "../constants/productConstants.js";
import { updatePricesInCart } from "../ui/cartUI.js";
import { updateSelectOptions } from "../ui/productUI.js";
import { delayedExecution, periodicExecution } from "../utils/asyncManager.js";
import { showPromotion } from "../utils/notificationManager.js";

/**
 * 프로모션 시작
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 */
export function startPromotions(productList, appState) {
  // 번개세일 시작
  startLightningSale(productList, appState);

  // 추천할인 시작
  startSuggestSale(productList, appState);
}

/**
 * 번개세일 시작
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 */
export function startLightningSale(productList, appState) {
  const lightningDelay = Math.random() * 10000;

  delayedExecution(() => {
    periodicExecution(() => {
      const luckyIndex = Math.floor(Math.random() * productList.length);
      const luckyItem = productList[luckyIndex];

      if (luckyItem.q > 0 && !luckyItem.onSale) {
        luckyItem.val = Math.round(luckyItem.originalVal * (1 - LIGHTNING_SALE_RATE));
        luckyItem.onSale = true;

        showPromotion(
          `⚡번개세일! ${luckyItem.name}이(가) ${LIGHTNING_SALE_RATE * 100}% 할인 중입니다!`,
        );

        updateSelectOptions(appState.productSelector, productList);
        updatePricesInCart(Array.from(appState.cartDisplay.children), productList);
      }
    }, LIGHTNING_SALE_INTERVAL);
  }, lightningDelay);
}

/**
 * 추천할인 시작
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 */
export function startSuggestSale(productList, appState) {
  const suggestDelay = Math.random() * 20000;

  delayedExecution(() => {
    periodicExecution(() => {
      if (appState.cartDisplay.children.length === 0) return;

      if (appState.lastSelectedProduct) {
        const suggestProduct = findSuggestProduct(productList, appState.lastSelectedProduct);

        if (suggestProduct) {
          showPromotion(
            `💝 ${suggestProduct.name}은(는) 어떠세요? 지금 구매하시면 ${SUGGEST_SALE_RATE * 100}% 추가 할인!`,
          );

          suggestProduct.val = Math.round(suggestProduct.val * (1 - SUGGEST_SALE_RATE));
          suggestProduct.suggestSale = true;

          updateSelectOptions(appState.productSelector, productList);
          updatePricesInCart(Array.from(appState.cartDisplay.children), productList);
        }
      }
    }, SUGGEST_SALE_INTERVAL);
  }, suggestDelay);
}

/**
 * 추천 상품 찾기
 * @param {Array} productList - 상품 목록
 * @param {string} lastSelectedId - 마지막 선택된 상품 ID
 * @returns {Object|null} 추천할 상품 또는 null
 */
export function findSuggestProduct(productList, lastSelectedId) {
  for (const product of productList) {
    if (product.id !== lastSelectedId && product.q > 0 && !product.suggestSale) {
      return product;
    }
  }
  return null;
}
