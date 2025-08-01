/**
 * 프로모션 도메인 액션 타입 정의
 */
export type PromotionAction =
  | { type: 'promotion/APPLY_LIGHTNING_SALE'; payload: string }
  | { type: 'promotion/APPLY_SUGGESTED_SALE'; payload: string }
  | { type: 'promotion/RESET_PROMOTIONS'; payload: string }
  | { type: 'promotion/RESET_ALL_PROMOTIONS' };

// 프로모션 액션 생성자
export const promotionActions = {
  applyLightningSale: (productId: string): PromotionAction => ({
    type: 'promotion/APPLY_LIGHTNING_SALE',
    payload: productId,
  }),

  applySuggestedSale: (productId: string): PromotionAction => ({
    type: 'promotion/APPLY_SUGGESTED_SALE',
    payload: productId,
  }),

  resetPromotions: (productId: string): PromotionAction => ({
    type: 'promotion/RESET_PROMOTIONS',
    payload: productId,
  }),

  resetAllPromotions: (): PromotionAction => ({
    type: 'promotion/RESET_ALL_PROMOTIONS',
  }),
};
