/**
 * 상품 도메인 액션 타입 정의
 */
export type ProductAction =
  | { type: 'product/SELECT_PRODUCT'; payload: string }
  | {
      type: 'product/UPDATE_STOCK';
      payload: { id: string; stockChange: number };
    }
  | { type: 'product/SET_PRICE'; payload: { id: string; price: number } }
  | { type: 'product/RESET_PRODUCT'; payload: string }
  | {
      type: 'product/SET_LIGHTNING_SALE';
      payload: { id: string; isOnSale: boolean };
    }
  | {
      type: 'product/SET_SUGGESTED_SALE';
      payload: { id: string; isSuggestedSale: boolean };
    };

// 상품 액션 생성자
export const productActions = {
  selectProduct: (productId: string): ProductAction => ({
    type: 'product/SELECT_PRODUCT',
    payload: productId,
  }),

  updateStock: (id: string, stockChange: number): ProductAction => ({
    type: 'product/UPDATE_STOCK',
    payload: { id, stockChange },
  }),

  setPrice: (id: string, price: number): ProductAction => ({
    type: 'product/SET_PRICE',
    payload: { id, price },
  }),

  resetProduct: (id: string): ProductAction => ({
    type: 'product/RESET_PRODUCT',
    payload: id,
  }),

  setLightningSale: (id: string, isOnSale: boolean): ProductAction => ({
    type: 'product/SET_LIGHTNING_SALE',
    payload: { id, isOnSale },
  }),

  setSuggestedSale: (id: string, isSuggestedSale: boolean): ProductAction => ({
    type: 'product/SET_SUGGESTED_SALE',
    payload: { id, isSuggestedSale },
  }),
};
