// ==========================================
// 타이머 서비스
// ==========================================

import { DISCOUNT_RATES, TIMERS } from '../constant/index.js';

/**
 * 번개세일 타이머 설정
 */
export function setupLightningSaleTimer(
  products,
  updateProductSelectUI,
  updateCartPricesUI,
  getTotalStock,
  canApplyLightningDiscount,
) {
  const lightningDelay = Math.random() * TIMERS.MAX_LIGHTNING_DELAY;

  setTimeout(() => {
    setInterval(() => {
      const luckyIdx = Math.floor(Math.random() * products.length);
      const luckyItem = products[luckyIdx];

      if (canApplyLightningDiscount(luckyItem)) {
        luckyItem.val = Math.round(
          luckyItem.originalVal * (1 - DISCOUNT_RATES.LIGHTNING_SALE),
        );
        luckyItem.onSale = true;
        alert(
          `⚡번개세일! ${luckyItem.name}이(가) ${DISCOUNT_RATES.LIGHTNING_SALE * 100}% 할인 중입니다!`,
        );
        updateProductSelectUI(products, getTotalStock());
        updateCartPricesUI(products);
      }
    }, TIMERS.LIGHTNING_SALE_INTERVAL);
  }, lightningDelay);
}

/**
 * 추천할인 타이머 설정
 */
export function setupSuggestSaleTimer(
  products,
  uiElements,
  updateProductSelectUI,
  updateCartPricesUI,
  DISCOUNT_RATES,
  getTotalStock,
) {
  setTimeout(() => {
    setInterval(() => {
      if (uiElements.cartDisplay.children.length === 0) {
        return;
      }

      const suggest = products.find(
        product => product.quantity > 0 && !product.suggestSale,
      );

      if (suggest) {
        alert(
          `💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 ${DISCOUNT_RATES.SUGGEST_SALE * 100}% 추가 할인!`,
        );
        suggest.val = Math.round(
          suggest.val * (1 - DISCOUNT_RATES.SUGGEST_SALE),
        );
        suggest.suggestSale = true;
        updateProductSelectUI(products, getTotalStock());
        updateCartPricesUI(products);
      }
    }, TIMERS.SUGGEST_SALE_INTERVAL);
  }, Math.random() * TIMERS.MAX_INITIAL_DELAY);
}
