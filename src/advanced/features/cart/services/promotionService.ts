/**
 * 프로모션 서비스 (TypeScript version)
 * 프로모션 관련 비즈니스 로직
 */

import { Product } from '@/advanced/features/cart/utils/stockUtils.ts';
import { applyFlashSale, applySuggestSale } from './promotionPriceService.ts';
import { BUSINESS_CONSTANTS } from '@/advanced/shared/constants/business.ts';

interface PromotionCallbacks {
  onPromotionApplied: (type: PromotionType, product: Product) => void;
  updateProductList: () => void;
}

/**
 * 유틸리티 함수들
 */
const PromotionUtils = {
  /**
   * 랜덤 지연 시간 생성
   */
  generateRandomDelay: (maxDelay: number): number => Math.random() * maxDelay,

  /**
   * 랜덤 상품 선택
   */
  selectRandomProduct: (products: Product[]): Product => {
    const randomIndex = Math.floor(Math.random() * products.length);
    return products[randomIndex];
  },
} as const;

/**
 * 추천 상품 찾기 (순수 함수)
 */
const findRecommendation = (
  products: Product[],
  lastSelectedId: string | null,
): Product | null => {
  return (
    products.find(
      product =>
        product.id !== lastSelectedId && product.q > 0 && !product.suggestSale,
    ) || null
  );
};

/**
 * 프로모션 알림 타입
 */
type PromotionType = 'flash' | 'recommendation';

/**
 * 프로모션 알림 표시 (통합)
 */
const showPromotionAlert = (
  type: PromotionType,
  product: Product,
  discountRate: number,
): void => {
  const discountPercent = discountRate * 100;

  const messages = {
    flash: `⚡번개세일! ${product.name}이(가) ${discountPercent}% 할인 중입니다!`,
    recommendation: `💝 ${product.name}은(는) 어떠세요? 지금 구매하시면 ${discountPercent}% 추가 할인!`,
  };

  alert(messages[type]);
};

/**
 * 프로모션 타이머 설정 (통합)
 */
export const setupPromotionTimers = (
  getProducts: () => Product[],
  getLastSelected: () => string | null,
  getCartItemCount: () => number,
  callbacks: PromotionCallbacks,
): void => {
  // 번개세일 타이머
  const flashSaleDelay = PromotionUtils.generateRandomDelay(
    BUSINESS_CONSTANTS.TIMERS.RANDOM_DELAY,
  );
  setTimeout(() => {
    setInterval(() => {
      const products = getProducts();
      const luckyItem = PromotionUtils.selectRandomProduct(products);

      const saleApplied = applyFlashSale(
        luckyItem.id,
        BUSINESS_CONSTANTS.DISCOUNT.FLASH_SALE_DISCOUNT_RATE,
        products,
      );

      if (saleApplied) {
        showPromotionAlert(
          'flash',
          luckyItem,
          BUSINESS_CONSTANTS.DISCOUNT.FLASH_SALE_DISCOUNT_RATE,
        );
        callbacks.onPromotionApplied('flash', luckyItem);
        callbacks.updateProductList();
      }
    }, BUSINESS_CONSTANTS.TIMERS.FLASH_SALE_INTERVAL);
  }, flashSaleDelay);

  // 추천세일 타이머
  const recommendationDelay = PromotionUtils.generateRandomDelay(
    BUSINESS_CONSTANTS.TIMERS.MAX_DELAY,
  );
  setTimeout(() => {
    setInterval(() => {
      if (getCartItemCount() === 0) return;

      const lastSelectedProduct = getLastSelected();
      if (!lastSelectedProduct) return;

      const products = getProducts();
      const suggest = findRecommendation(products, lastSelectedProduct);

      if (suggest) {
        const saleApplied = applySuggestSale(
          suggest.id,
          BUSINESS_CONSTANTS.DISCOUNT.SUGGEST_DISCOUNT_RATE,
          products,
        );

        if (saleApplied) {
          showPromotionAlert(
            'recommendation',
            suggest,
            BUSINESS_CONSTANTS.DISCOUNT.SUGGEST_DISCOUNT_RATE,
          );
          callbacks.onPromotionApplied('recommendation', suggest);
          callbacks.updateProductList();
        }
      }
    }, BUSINESS_CONSTANTS.TIMERS.SUGGEST_SALE_INTERVAL);
  }, recommendationDelay);
};
