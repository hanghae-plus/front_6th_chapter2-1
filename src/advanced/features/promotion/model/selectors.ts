/**
 * 프로모션 상태 선택자
 * 번개세일, 추천세일 상태에 대한 읽기 전용 접근 제공
 */
import type { PromotionState } from './reducer';

export const promotionSelectors = {
  // 번개세일 중인 상품 ID
  getLightningSaleProductId: (state: PromotionState): string | null =>
    state.lightningSaleProductId,

  // 추천세일 중인 상품 ID
  getSuggestedSaleProductId: (state: PromotionState): string | null =>
    state.suggestedSaleProductId,

  // 번개세일 활성화 상태
  isLightningSaleActive: (state: PromotionState): boolean =>
    state.isLightningSaleActive,

  // 추천세일 활성화 상태
  isSuggestedSaleActive: (state: PromotionState): boolean =>
    state.isSuggestedSaleActive,

  // 특정 상품이 번개세일 중인지 확인
  isProductOnLightningSale: (
    state: PromotionState,
    productId: string
  ): boolean =>
    state.lightningSaleProductId === productId && state.isLightningSaleActive,

  // 특정 상품이 추천세일 중인지 확인
  isProductOnSuggestedSale: (
    state: PromotionState,
    productId: string
  ): boolean =>
    state.suggestedSaleProductId === productId && state.isSuggestedSaleActive,

  // 활성화된 프로모션이 있는지 확인
  hasActivePromotions: (state: PromotionState): boolean =>
    state.isLightningSaleActive || state.isSuggestedSaleActive,
};
