/**
 * 프로모션 서비스 (TypeScript version)
 * 프로모션 관련 비즈니스 로직
 */

import { Product } from '@/advanced/features/cart/utils/stockUtils.ts';
import { applyFlashSale, applySuggestSale } from './promotionPriceService.ts';
import { BUSINESS_CONSTANTS } from '@/advanced/shared/constants/business.ts';

interface PromotionCallbacks {
  onFlashSale: (product: Product) => void;
  onSuggestSale: (product: Product) => void;
  updateProductList: () => void;
}

/**
 * 랜덤 지연 시간 생성 (순수 함수)
 */
const generateRandomDelay = (maxDelay: number): number => {
  return Math.random() * maxDelay;
};

/**
 * 랜덤 상품 선택 (순수 함수)
 */
const selectRandomProduct = (products: Product[]): Product => {
  const luckyIdx = Math.floor(Math.random() * products.length);
  return products[luckyIdx];
};

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
 * 번개세일 알림 표시
 */
const showFlashSaleAlert = (product: Product, discountRate: number): void => {
  const discountPercent = discountRate * 100;
  alert(`⚡번개세일! ${product.name}이(가) ${discountPercent}% 할인 중입니다!`);
};

/**
 * 추천세일 알림 표시
 */
const showRecommendationAlert = (
  product: Product,
  discountRate: number,
): void => {
  const discountPercent = discountRate * 100;
  alert(
    `💝 ${product.name}은(는) 어떠세요? 지금 구매하시면 ${discountPercent}% 추가 할인!`,
  );
};

/**
 * 번게세일 타이머 설정
 */
export const setupFlashSaleTimer = (
  getProducts: () => Product[],
  callbacks: PromotionCallbacks,
): void => {
  const lightningDelay = generateRandomDelay(
    BUSINESS_CONSTANTS.TIMERS.RANDOM_DELAY,
  );

  setTimeout(() => {
    setInterval(() => {
      const products = getProducts();
      const luckyItem = selectRandomProduct(products);

      // 번개세일 적용
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
        callbacks.onFlashSale(luckyItem);
        callbacks.updateProductList();
      }
    }, BUSINESS_CONSTANTS.TIMERS.FLASH_SALE_INTERVAL);
  }, lightningDelay);
};

/**
 * 추천세일 타이머 설정
 */
export const setupRecommendationTimer = (
  getProducts: () => Product[],
  getLastSelected: () => string | null,
  getCartItemCount: () => number,
  callbacks: PromotionCallbacks,
): void => {
  const initialDelay = generateRandomDelay(BUSINESS_CONSTANTS.TIMERS.MAX_DELAY);

  setTimeout(() => {
    setInterval(() => {
      // 장바구니가 비어있으면 패스
      if (getCartItemCount() === 0) {
        return;
      }

      const lastSelectedProduct = getLastSelected();
      if (!lastSelectedProduct) return;

      const products = getProducts();
      const suggest = findRecommendation(products, lastSelectedProduct);

      if (suggest) {
        // 추천세일 적용
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
          callbacks.onSuggestSale(suggest);
          callbacks.updateProductList();
        }
      }
    }, BUSINESS_CONSTANTS.TIMERS.SUGGEST_SALE_INTERVAL);
  }, initialDelay);
};
