/**
 * 장바구니 도메인 Hook
 * 장바구니 관련 상태와 액션을 관리
 * 재고 검증과 알림 처리 포함
 */
import { useCallback } from 'react';
import type {
  RootState,
  RootAction,
} from '../../../shared/core/combinedReducer';
import { cartActions } from '../model/actions';
import { cartSelectors } from '../model/selectors';
import { productSelectors } from '../../product/model/selectors';
import { productActions } from '../../product/model/actions';
import {
  stockService,
  StockValidationError,
} from '../../../shared/services/stockService';
import { notificationService } from '../../../shared/services/notificationService';

export function useCart(
  state: RootState,
  dispatch: (action: RootAction) => void
) {
  const cartItems = cartSelectors.getItems(state.cart);
  const products = productSelectors.getProducts(state.product);

  const addToCart = useCallback(
    (productId: string) => {
      try {
        const product = productSelectors.getProductById(
          state.product,
          productId
        );
        stockService.validateAddToCart(product);

        dispatch(cartActions.addToCart(productId));
        dispatch(productActions.updateStock(productId, -1));
      } catch (error) {
        if (error instanceof StockValidationError) {
          notificationService.showError(error.message);
        }
      }
    },
    [state.product, dispatch]
  );

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      try {
        const product = productSelectors.getProductById(state.product, id);
        const currentItem = cartSelectors.getItemById(state.cart, id);

        if (!currentItem) return;

        if (quantity <= 0) {
          dispatch(cartActions.removeFromCart(id));
          dispatch(productActions.updateStock(id, currentItem.quantity));
          return;
        }

        stockService.validateQuantityUpdate(
          product,
          currentItem.quantity,
          quantity
        );

        const quantityDiff = quantity - currentItem.quantity;
        dispatch(cartActions.updateQuantity(id, quantity));
        dispatch(productActions.updateStock(id, -quantityDiff));
      } catch (error) {
        if (error instanceof StockValidationError) {
          notificationService.showError(error.message);
        }
      }
    },
    [state.cart, state.product, dispatch]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      const itemToRemove = cartSelectors.getItemById(state.cart, productId);
      if (!itemToRemove) return;

      dispatch(cartActions.removeFromCart(productId));
      dispatch(productActions.updateStock(productId, itemToRemove.quantity));
    },
    [state.cart, dispatch]
  );

  const clearCart = useCallback(() => {
    // 모든 재고 복원
    cartItems.forEach((item) => {
      dispatch(productActions.updateStock(item.id, item.quantity));
    });
    dispatch(cartActions.clearCart());
  }, [cartItems, dispatch]);

  return {
    cartItems,
    itemCount: cartSelectors.getItemCount(state.cart),
    isEmpty: cartSelectors.isEmpty(state.cart),
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };
}
