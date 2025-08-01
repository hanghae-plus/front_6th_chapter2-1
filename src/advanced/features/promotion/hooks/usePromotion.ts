/**
 * 프로모션 도메인 Hook
 * 번개세일, 추천세일 자동 관리 및 수동 제어
 * 타이머 기반 프로모션 매니저 통합
 */
import { useCallback, useEffect, useRef } from 'react';
import type {
  RootState,
  RootAction,
} from '../../../shared/core/combinedReducer';
import { promotionActions } from '../model/actions';
import { promotionSelectors } from '../model/selectors';
import { productActions } from '../../product/model/actions';
import { productSelectors } from '../../product/model/selectors';
import { createLightningSaleManager } from '../services/LightningSaleService';
import { createSuggestedSaleManager } from '../services/SuggestedSaleService';
import { DISCOUNT_RATES } from '../../../shared/constants';

export function usePromotion(
  state: RootState,
  dispatch: (action: RootAction) => void
) {
  const lightningSaleManager = useRef<{
    start: () => void;
    stop: () => void;
  } | null>(null);
  const suggestedSaleManager = useRef<{
    start: () => void;
    stop: () => void;
  } | null>(null);

  const applyLightningSale = useCallback(
    (productId: string) => {
      const product = productSelectors.getProductById(state.product, productId);
      if (!product) return;

      // 프로모션 상태 업데이트
      dispatch(promotionActions.applyLightningSale(productId));

      // 상품 정보 업데이트 (가격, 세일 상태)
      const discountedPrice = Math.floor(
        product.originalPrice * (1 - DISCOUNT_RATES.LIGHTNING)
      );
      dispatch(productActions.setPrice(productId, discountedPrice));
      dispatch(productActions.setLightningSale(productId, true));
    },
    [state.product, dispatch]
  );

  const applySuggestedSale = useCallback(
    (productId: string) => {
      const product = productSelectors.getProductById(state.product, productId);
      if (!product) return;

      dispatch(promotionActions.applySuggestedSale(productId));

      const discountedPrice = Math.floor(
        product.originalPrice * (1 - DISCOUNT_RATES.SUGGEST)
      );
      dispatch(productActions.setPrice(productId, discountedPrice));
      dispatch(productActions.setSuggestedSale(productId, true));
    },
    [state.product, dispatch]
  );

  const resetPromotions = useCallback(
    (productId: string) => {
      dispatch(promotionActions.resetPromotions(productId));
      dispatch(productActions.setLightningSale(productId, false));
      dispatch(productActions.setSuggestedSale(productId, false));
      dispatch(productActions.resetProduct(productId));
    },
    [dispatch]
  );

  const resetAllPromotions = useCallback(() => {
    const products = productSelectors.getProducts(state.product);
    products.forEach((product) => {
      if (product.isOnSale || product.isSuggestedSale) {
        dispatch(productActions.resetProduct(product.id));
      }
    });
    dispatch(promotionActions.resetAllPromotions());
  }, [state.product, dispatch]);

  // 프로모션 매니저 초기화
  useEffect(() => {
    lightningSaleManager.current = createLightningSaleManager(
      () => productSelectors.getProducts(state.product),
      applyLightningSale,
      resetPromotions
    );

    suggestedSaleManager.current = createSuggestedSaleManager(
      () => productSelectors.getProducts(state.product),
      () => productSelectors.getLastSelectedProductId(state.product),
      applySuggestedSale,
      resetPromotions
    );

    lightningSaleManager.current.start();
    suggestedSaleManager.current.start();

    return () => {
      lightningSaleManager.current?.stop();
      suggestedSaleManager.current?.stop();
    };
  }, [applyLightningSale, applySuggestedSale, resetPromotions, state.product]);

  return {
    lightningSaleProductId: promotionSelectors.getLightningSaleProductId(
      state.promotion
    ),
    suggestedSaleProductId: promotionSelectors.getSuggestedSaleProductId(
      state.promotion
    ),
    isLightningSaleActive: promotionSelectors.isLightningSaleActive(
      state.promotion
    ),
    isSuggestedSaleActive: promotionSelectors.isSuggestedSaleActive(
      state.promotion
    ),
    hasActivePromotions: promotionSelectors.hasActivePromotions(
      state.promotion
    ),
    applyLightningSale,
    applySuggestedSale,
    resetPromotions,
    resetAllPromotions,
    isProductOnLightningSale: (productId: string) =>
      promotionSelectors.isProductOnLightningSale(state.promotion, productId),
    isProductOnSuggestedSale: (productId: string) =>
      promotionSelectors.isProductOnSuggestedSale(state.promotion, productId),
  };
}
