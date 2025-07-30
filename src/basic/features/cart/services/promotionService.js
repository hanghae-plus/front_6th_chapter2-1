/**
 * 프로모션 서비스
 * 프로모션 관련 비즈니스 로직
 */

import { BUSINESS_CONSTANTS } from '../../../shared/constants/business.js';
import { findElement } from '../../../shared/core/domUtils.js';
import { updateProductSelector } from '../../product/services/productService.js';
import { productState } from '../../product/store/ProductStore.js';

import { applyFlashSale, applySuggestSale } from './promotionPriceService.js';

/**
 * 프로모션 서비스 초기화
 */
export const initializeCartPromotion = () => {
  // 순수 함수 - 부수 효과 없음
};

/**
 * 랜덤 지연 시간 생성 (순수 함수)
 * @param {number} maxDelay - 최대 지연 시간
 * @returns {number} 지연 시간
 */
const generateRandomDelay = maxDelay => {
  return Math.random() * maxDelay;
};

/**
 * 랜덤 상품 선택 (순수 함수)
 * @param {Array} products - 상품 목록
 * @returns {object} 선택된 상품
 */
const selectRandomProduct = products => {
  const luckyIdx = Math.floor(Math.random() * products.length);
  return products[luckyIdx];
};

/**
 * 추천 상품 찾기 (순수 함수)
 * @param {Array} products - 상품 목록
 * @param {string} lastSelectedId - 마지막 선택된 상품 ID
 * @returns {object|null} 추천 상품
 */
const findRecommendation = (products, lastSelectedId) => {
  return products.find(
    product =>
      product.id !== lastSelectedId && product.q > 0 && !product.suggestSale,
  );
};

/**
 * 번개세일 알림 표시 (부수 효과)
 * @param {object} product - 상품 정보
 * @param {number} discountRate - 할인율
 */
const showFlashSaleAlert = (product, discountRate) => {
  const discountPercent = discountRate * 100;
  alert(`⚡번개세일! ${product.name}이(가) ${discountPercent}% 할인 중입니다!`);
};

/**
 * 추천세일 알림 표시 (부수 효과)
 * @param {object} product - 상품 정보
 * @param {number} discountRate - 할인율
 */
const showRecommendationAlert = (product, discountRate) => {
  const discountPercent = discountRate * 100;
  alert(
    `💝 ${product.name}은(는) 어떠세요? 지금 구매하시면 ${discountPercent}% 추가 할인!`,
  );
};

/**
 * 카트 업데이트 이벤트 발생 (부수 효과)
 */
const triggerCartUpdate = () => {
  window.dispatchEvent(new CustomEvent('cart-updated'));
};

/**
 * 번개세일 타이머 설정
 */
export const setupFlashSaleTimer = () => {
  const lightningDelay = generateRandomDelay(
    BUSINESS_CONSTANTS.TIMERS.RANDOM_DELAY,
  );

  setTimeout(() => {
    setInterval(() => {
      const products = productState.products;
      const luckyItem = selectRandomProduct(products);

      // 순수 함수로 번개세일 로직
      const saleApplied = applyFlashSale(
        luckyItem.id,
        BUSINESS_CONSTANTS.DISCOUNT.FLASH_SALE_DISCOUNT_RATE,
        products,
      );

      if (saleApplied) {
        showFlashSaleAlert(
          luckyItem,
          BUSINESS_CONSTANTS.DISCOUNT.FLASH_SALE_DISCOUNT_RATE,
        );
        updateProductSelector();
        triggerCartUpdate();
      }
    }, BUSINESS_CONSTANTS.TIMERS.FLASH_SALE_INTERVAL);
  }, lightningDelay);
};

/**
 * 추천세일 타이머 설정
 */
export const setupRecommendationTimer = () => {
  const initialDelay = generateRandomDelay(BUSINESS_CONSTANTS.TIMERS.MAX_DELAY);

  setTimeout(() => {
    setInterval(() => {
      const cartDisplayElement = findElement('#cart-items');
      if (!cartDisplayElement || cartDisplayElement.children.length === 0) {
        return;
      }

      const { lastSelectedProduct, products } = productState;

      if (!lastSelectedProduct) return;

      const suggest = findRecommendation(products, lastSelectedProduct);

      if (suggest) {
        // 순수 함수로 추천세일 로직
        const saleApplied = applySuggestSale(
          suggest.id,
          BUSINESS_CONSTANTS.DISCOUNT.SUGGEST_DISCOUNT_RATE,
          products,
        );

        if (saleApplied) {
          showRecommendationAlert(
            suggest,
            BUSINESS_CONSTANTS.DISCOUNT.SUGGEST_DISCOUNT_RATE,
          );
          updateProductSelector();
          triggerCartUpdate();
        }
      }
    }, BUSINESS_CONSTANTS.TIMERS.SUGGEST_SALE_INTERVAL);
  }, initialDelay);
};
