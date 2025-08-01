/**
 * 도메인별 분리된 상태관리를 통합하는 combinedReducer
 * Cart, Product, Promotion 도메인을 결합
 */
import {
  cartReducer,
  type CartState,
  initialCartState,
} from '../../features/cart/model/reducer';
import {
  productReducer,
  type ProductState,
  initialProductState,
} from '../../features/product/model/reducer';
import {
  promotionReducer,
  type PromotionState,
  initialPromotionState,
} from '../../features/promotion/model/reducer';
import type { CartAction } from '../../features/cart/model/actions';
import type { ProductAction } from '../../features/product/model/actions';
import type { PromotionAction } from '../../features/promotion/model/actions';

export interface RootState {
  cart: CartState;
  product: ProductState;
  promotion: PromotionState;
}

// 모든 도메인 액션 통합
export type RootAction = CartAction | ProductAction | PromotionAction;

export const initialRootState: RootState = {
  cart: initialCartState,
  product: initialProductState,
  promotion: initialPromotionState,
};

// 각 도메인 리듀서를 결합하여 전체 상태 관리
export function combinedReducer(
  state: RootState,
  action: RootAction
): RootState {
  return {
    cart: cartReducer(state.cart, action as CartAction),
    product: productReducer(state.product, action as ProductAction),
    promotion: promotionReducer(state.promotion, action as PromotionAction),
  };
}
