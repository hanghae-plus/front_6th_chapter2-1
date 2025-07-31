// TimerHandler.js - 타이머 이벤트 핸들러 관리 유틸리티

import { UI_CONSTANTS } from '../constants/index.js';
import { applySale, applySuggestSale } from '../services/product/ProductService.js';

/**
 * 번개 세일 타이머 설정
 * @param {Array} products - 상품 목록
 * @param {Function} updateProductOptions - 상품 옵션 업데이트 함수
 * @param {Function} updateCartPrices - 장바구니 가격 업데이트 함수
 */
export function setupLightningSaleTimer(products, updateProductOptions, updateCartPrices) {
  const lightningDelay = Math.random() * UI_CONSTANTS.LIGHTNING_SALE_DELAY;

  setTimeout(() => {
    setInterval(() => {
      const luckyIndex = Math.floor(Math.random() * products.length);
      const luckyItem = products[luckyIndex];

      if (luckyItem.quantity > 0 && !luckyItem.onSale) {
        const result = applySale(products, luckyItem.id, 0.2);
        if (result.success) {
          // products 배열 업데이트
          Object.assign(products, result.products);
          alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
          updateProductOptions();
          updateCartPrices();
        }
      }
    }, UI_CONSTANTS.LIGHTNING_SALE_INTERVAL);
  }, lightningDelay);
}

/**
 * 추천 할인 타이머 설정
 * @param {Array} products - 상품 목록
 * @param {HTMLElement} cartDisplayElement - 장바구니 표시 요소
 * @param {string} lastSelectedProductId - 마지막 선택된 상품 ID
 * @param {Function} updateProductOptions - 상품 옵션 업데이트 함수
 * @param {Function} updateCartPrices - 장바구니 가격 업데이트 함수
 */
export function setupSuggestSaleTimer(
  products,
  cartDisplayElement,
  lastSelectedProductId,
  updateProductOptions,
  updateCartPrices,
) {
  setTimeout(() => {
    setInterval(() => {
      if (lastSelectedProductId && cartDisplayElement.children.length > 0) {
        let suggestProduct = null;

        for (let i = 0; i < products.length; i++) {
          const product = products[i];
          if (
            product.id !== lastSelectedProductId &&
            product.quantity > 0 &&
            !product.suggestSale
          ) {
            suggestProduct = product;
            break;
          }
        }

        if (suggestProduct) {
          alert(`💝 ${suggestProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          const result = applySuggestSale(products, suggestProduct.id, 0.05);
          if (result.success) {
            // products 배열 업데이트
            Object.assign(products, result.products);
            updateProductOptions();
            updateCartPrices();
          }
        }
      }
    }, UI_CONSTANTS.SUGGEST_SALE_INTERVAL);
  }, Math.random() * UI_CONSTANTS.SUGGEST_SALE_DELAY);
}

/**
 * 모든 타이머 설정
 * @param {Object} config - 타이머 설정 객체
 */
export function setupAllTimers(config) {
  const {
    products,
    cartDisplayElement,
    lastSelectedProductId,
    updateProductOptions,
    updateCartPrices,
  } = config;

  // 번개 세일 타이머 설정
  setupLightningSaleTimer(products, updateProductOptions, updateCartPrices);

  // 추천 할인 타이머 설정
  setupSuggestSaleTimer(
    products,
    cartDisplayElement,
    lastSelectedProductId,
    updateProductOptions,
    updateCartPrices,
  );
}
