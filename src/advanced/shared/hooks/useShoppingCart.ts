/**
 * 통합 쇼핑카트 Hook
 * 장바구니, 상품, 프로모션 도메인을 통합하여 관리
 * 기존 useShoppingCart API와 호환성 유지
 */
import { useReducer, useMemo } from 'react';
import { combinedReducer, initialRootState } from '../core/combinedReducer';
import { useCart } from '../../features/cart/hooks/useCart';
import { useProducts } from '../../features/product/hooks/useProducts';
import { usePromotion } from '../../features/promotion/hooks/usePromotion';
import { calculateTotals } from '../services/calculationService';
import type { ShoppingCartState, ShoppingCartActions } from '../types';

export function useShoppingCart() {
  const [rootState, dispatch] = useReducer(combinedReducer, initialRootState);

  // 각 도메인별 hook 사용
  const cart = useCart(rootState, dispatch);
  const products = useProducts(rootState, dispatch);
  const promotion = usePromotion(rootState, dispatch);

  // 계산된 값들
  const calculatedTotals = useMemo(
    () => calculateTotals(rootState),
    [rootState]
  );

  // 통합된 상태 (기존 API와 호환)
  const state: ShoppingCartState = useMemo(
    () => ({
      // 기본 상태 데이터
      products: products.products,
      cartItems: cart.cartItems,
      selectedProductId: products.selectedProductId,
      lastSelectedProductId: products.lastSelectedProductId,

      // 계산된 데이터
      itemCount: calculatedTotals.itemCount,
      totalAmount: calculatedTotals.totalAmount,
      subtotal: calculatedTotals.subtotal,
      bonusPoints: calculatedTotals.bonusPoints,
      discountInfo: calculatedTotals.discountInfo,
      isTuesdaySpecial: calculatedTotals.isTuesdaySpecial,
      pointsDetails: calculatedTotals.pointsDetails,

      // 프로모션 상태
      lightningSaleProductId: promotion.lightningSaleProductId,
      suggestedSaleProductId: promotion.suggestedSaleProductId,
      isLightningSaleActive: promotion.isLightningSaleActive,
      isSuggestedSaleActive: promotion.isSuggestedSaleActive,
    }),
    [
      products.products,
      products.selectedProductId,
      products.lastSelectedProductId,
      cart.cartItems,
      calculatedTotals,
      promotion.lightningSaleProductId,
      promotion.suggestedSaleProductId,
      promotion.isLightningSaleActive,
      promotion.isSuggestedSaleActive,
    ]
  );

  // 통합된 액션들 (기존 API와 호환)
  const actions: ShoppingCartActions = useMemo(
    () => ({
      // 상품 관련
      selectProduct: products.selectProduct,
      getProductById: products.getProductById,

      // 장바구니 관련
      addToCart: cart.addToCart,
      updateQuantity: cart.updateQuantity,
      removeFromCart: cart.removeFromCart,
      clearCart: cart.clearCart,

      // 프로모션 관련
      applyLightningSale: promotion.applyLightningSale,
      applySuggestedSale: promotion.applySuggestedSale,
      resetPromotions: promotion.resetPromotions,
      resetAllPromotions: promotion.resetAllPromotions,
    }),
    [
      products.selectProduct,
      products.getProductById,
      cart.addToCart,
      cart.updateQuantity,
      cart.removeFromCart,
      cart.clearCart,
      promotion.applyLightningSale,
      promotion.applySuggestedSale,
      promotion.resetPromotions,
      promotion.resetAllPromotions,
    ]
  );

  return {
    state,
    actions,
    // 기존 hook과의 호환성을 위한 추가 메서드
    getProductById: products.getProductById,
  };
}
