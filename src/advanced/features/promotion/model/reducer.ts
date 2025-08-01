import type { PromotionAction } from './actions';

export interface PromotionState {
  lightningSaleProductId: string | null;
  suggestedSaleProductId: string | null;
  isLightningSaleActive: boolean;
  isSuggestedSaleActive: boolean;
}

export const initialPromotionState: PromotionState = {
  lightningSaleProductId: null,
  suggestedSaleProductId: null,
  isLightningSaleActive: false,
  isSuggestedSaleActive: false,
};

export function promotionReducer(
  state: PromotionState,
  action: PromotionAction
): PromotionState {
  switch (action.type) {
    case 'promotion/APPLY_LIGHTNING_SALE': {
      return {
        ...state,
        lightningSaleProductId: action.payload,
        isLightningSaleActive: true,
      };
    }

    case 'promotion/APPLY_SUGGESTED_SALE': {
      return {
        ...state,
        suggestedSaleProductId: action.payload,
        isSuggestedSaleActive: true,
      };
    }

    case 'promotion/RESET_PROMOTIONS': {
      const productId = action.payload;
      return {
        ...state,
        lightningSaleProductId:
          state.lightningSaleProductId === productId
            ? null
            : state.lightningSaleProductId,
        suggestedSaleProductId:
          state.suggestedSaleProductId === productId
            ? null
            : state.suggestedSaleProductId,
        isLightningSaleActive:
          state.lightningSaleProductId === productId
            ? false
            : state.isLightningSaleActive,
        isSuggestedSaleActive:
          state.suggestedSaleProductId === productId
            ? false
            : state.isSuggestedSaleActive,
      };
    }

    case 'promotion/RESET_ALL_PROMOTIONS': {
      return initialPromotionState;
    }

    default:
      return state;
  }
}
