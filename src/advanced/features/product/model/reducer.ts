import type { Product } from '../../../shared/types';
import type { ProductAction } from './actions';
import { PRODUCT_IDS } from '../../../shared/constants';

export interface ProductState {
  products: Product[];
  selectedProductId: string;
  lastSelectedProductId: string | null;
}

export const initialProductState: ProductState = {
  products: [
    {
      id: PRODUCT_IDS.KEYBOARD,
      name: '버그 없애는 키보드',
      price: 10000,
      originalPrice: 10000,
      stock: 50,
      isOnSale: false,
      isSuggestedSale: false,
    },
    {
      id: PRODUCT_IDS.MOUSE,
      name: '생산성 폭발 마우스',
      price: 20000,
      originalPrice: 20000,
      stock: 30,
      isOnSale: false,
      isSuggestedSale: false,
    },
    {
      id: PRODUCT_IDS.MONITOR,
      name: '거북목 탈출 모니터암',
      price: 30000,
      originalPrice: 30000,
      stock: 20,
      isOnSale: false,
      isSuggestedSale: false,
    },
    {
      id: PRODUCT_IDS.HEADPHONE,
      name: '에러 방지 노트북 파우치',
      price: 15000,
      originalPrice: 15000,
      stock: 0,
      isOnSale: false,
      isSuggestedSale: false,
    },
    {
      id: PRODUCT_IDS.SPEAKER,
      name: '코딩할 때 듣는 Lo-Fi 스피커',
      price: 25000,
      originalPrice: 25000,
      stock: 10,
      isOnSale: false,
      isSuggestedSale: false,
    },
  ],
  selectedProductId: '',
  lastSelectedProductId: null,
};

export function productReducer(
  state: ProductState,
  action: ProductAction
): ProductState {
  switch (action.type) {
    case 'product/SELECT_PRODUCT': {
      return {
        ...state,
        selectedProductId: action.payload,
        lastSelectedProductId: action.payload,
      };
    }

    case 'product/UPDATE_STOCK': {
      const { id, stockChange } = action.payload;
      const newProducts = state.products.map((product) =>
        product.id === id
          ? { ...product, stock: Math.max(0, product.stock + stockChange) }
          : product
      );
      return { ...state, products: newProducts };
    }

    case 'product/SET_PRICE': {
      const { id, price } = action.payload;
      const newProducts = state.products.map((product) =>
        product.id === id ? { ...product, price } : product
      );
      return { ...state, products: newProducts };
    }

    case 'product/RESET_PRODUCT': {
      const id = action.payload;
      const newProducts = state.products.map((product) =>
        product.id === id
          ? {
              ...product,
              price: product.originalPrice,
              isOnSale: false,
              isSuggestedSale: false,
            }
          : product
      );
      return { ...state, products: newProducts };
    }

    case 'product/SET_LIGHTNING_SALE': {
      const { id, isOnSale } = action.payload;
      const newProducts = state.products.map((product) =>
        product.id === id ? { ...product, isOnSale } : product
      );
      return { ...state, products: newProducts };
    }

    case 'product/SET_SUGGESTED_SALE': {
      const { id, isSuggestedSale } = action.payload;
      const newProducts = state.products.map((product) =>
        product.id === id ? { ...product, isSuggestedSale } : product
      );
      return { ...state, products: newProducts };
    }

    default:
      return state;
  }
}
