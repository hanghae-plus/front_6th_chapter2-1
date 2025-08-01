/**
 * 상품 도메인 Hook
 * 상품 선택, 재고 관리, 가격 설정 등 상품 관련 기능
 */
import { useCallback } from 'react';
import type {
  RootState,
  RootAction,
} from '../../../shared/core/combinedReducer';
import { productActions } from '../model/actions';
import { productSelectors } from '../model/selectors';

export function useProducts(
  state: RootState,
  dispatch: (action: RootAction) => void
) {
  const products = productSelectors.getProducts(state.product);
  const selectedProductId = productSelectors.getSelectedProductId(
    state.product
  );
  const lastSelectedProductId = productSelectors.getLastSelectedProductId(
    state.product
  );

  const selectProduct = useCallback(
    (productId: string) => {
      dispatch(productActions.selectProduct(productId));
    },
    [dispatch]
  );

  const getProductById = useCallback(
    (id: string) => {
      return productSelectors.getProductById(state.product, id);
    },
    [state.product]
  );

  const updateStock = useCallback(
    (id: string, stockChange: number) => {
      dispatch(productActions.updateStock(id, stockChange));
    },
    [dispatch]
  );

  const setPrice = useCallback(
    (id: string, price: number) => {
      dispatch(productActions.setPrice(id, price));
    },
    [dispatch]
  );

  const resetProduct = useCallback(
    (id: string) => {
      dispatch(productActions.resetProduct(id));
    },
    [dispatch]
  );

  return {
    products,
    selectedProductId,
    lastSelectedProductId,
    availableProducts: productSelectors.getAvailableProducts(state.product),
    productsOnSale: productSelectors.getProductsOnSale(state.product),
    suggestedProducts: productSelectors.getSuggestedProducts(state.product),
    selectProduct,
    getProductById,
    updateStock,
    setPrice,
    resetProduct,
  };
}
