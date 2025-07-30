// 리액트처럼 간단한 state import
import { BUSINESS_CONSTANTS } from '../../../shared/constants/business.js';
import { updateProductSelector } from '../../product/services/productService.js';
import { productState } from '../../product/store/ProductStore.js';

import { applyFlashSale, applySuggestSale } from './PriceUpdater.js';

// PriceUpdater 클래스 제거하고 순수 함수 사용
export const initializeCartPromotion = () => {
  // 더 이상 인스턴스 생성 필요 없음
};

export const setupFlashSaleTimer = () => {
  const lightningDelay = Math.random() * BUSINESS_CONSTANTS.TIMERS.RANDOM_DELAY;

  setTimeout(() => {
    setInterval(() => {
      const products = productState.products;
      const luckyIdx = Math.floor(Math.random() * products.length);
      const luckyItem = products[luckyIdx];

      // 순수 함수로 번개세일 로직
      const saleApplied = applyFlashSale(
        luckyItem.id,
        BUSINESS_CONSTANTS.DISCOUNT.FLASH_SALE_DISCOUNT_RATE,
        products,
      );

      if (saleApplied) {
        const discountPercent =
          BUSINESS_CONSTANTS.DISCOUNT.FLASH_SALE_DISCOUNT_RATE * 100;
        alert(
          `⚡번개세일! ${luckyItem.name}이(가) ${discountPercent}% 할인 중입니다!`,
        );
        updateProductSelector();
        window.dispatchEvent(new CustomEvent('cart-updated'));
      }
    }, BUSINESS_CONSTANTS.TIMERS.FLASH_SALE_INTERVAL);
  }, lightningDelay);
};

export const setupRecommendationTimer = () => {
  setTimeout(() => {
    setInterval(() => {
      const cartDisplayElement = document.getElementById('cart-items');
      if (cartDisplayElement.children.length === 0) {
        return;
      }

      const lastSelectedProductId = productState.lastSelectedProduct;
      if (lastSelectedProductId) {
        let suggest = null;
        const products = productState.products;

        for (let k = 0; k < products.length; k++) {
          if (products[k].id !== lastSelectedProductId) {
            if (products[k].q > 0) {
              if (!products[k].suggestSale) {
                suggest = products[k];
                break;
              }
            }
          }
        }

        if (suggest) {
          // 순수 함수로 추천세일 로직
          const saleApplied = applySuggestSale(
            suggest.id,
            BUSINESS_CONSTANTS.DISCOUNT.SUGGEST_DISCOUNT_RATE,
            products,
          );

          if (saleApplied) {
            const discountPercent =
              BUSINESS_CONSTANTS.DISCOUNT.SUGGEST_DISCOUNT_RATE * 100;
            alert(
              `💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 ${discountPercent}% 추가 할인!`,
            );
            updateProductSelector();
            window.dispatchEvent(new CustomEvent('cart-updated'));
          }
        }
      }
    }, BUSINESS_CONSTANTS.TIMERS.SUGGEST_SALE_INTERVAL);
  }, Math.random() * BUSINESS_CONSTANTS.TIMERS.MAX_DELAY);
};
