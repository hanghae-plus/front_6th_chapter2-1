/**
 * 상품 상태 선택자
 * 상품 데이터에 대한 읽기 전용 접근 제공
 */
import type { ProductState } from './reducer';
import type { Product } from '../../../shared/types';

export const productSelectors = {
  // 전체 상품 목록
  getProducts: (state: ProductState): Product[] => state.products,

  // 특정 ID 상품 조회
  getProductById: (state: ProductState, id: string): Product | undefined =>
    state.products.find((product) => product.id === id),

  // 현재 선택된 상품 ID
  getSelectedProductId: (state: ProductState): string =>
    state.selectedProductId,

  // 마지막으로 선택된 상품 ID (추천 세일용)
  getLastSelectedProductId: (state: ProductState): string | null =>
    state.lastSelectedProductId,

  // 현재 선택된 상품 객체
  getSelectedProduct: (state: ProductState): Product | undefined =>
    state.products.find((product) => product.id === state.selectedProductId),

  // 재고가 있는 상품들
  getAvailableProducts: (state: ProductState): Product[] =>
    state.products.filter((product) => product.stock > 0),

  // 번개세일 중인 상품들
  getProductsOnSale: (state: ProductState): Product[] =>
    state.products.filter((product) => product.isOnSale),

  // 추천세일 중인 상품들
  getSuggestedProducts: (state: ProductState): Product[] =>
    state.products.filter((product) => product.isSuggestedSale),
};
