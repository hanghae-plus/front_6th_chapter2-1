import React from "react";
import { PRODUCT_DATA, PRODUCT_ONE } from "../constants";
import type { Product } from "../types";
import { createSafeContext } from "../utils/createSafeContext";

// 상품 상태 타입
export interface ProductState {
  productList: Product[];
  selectedProductId: string;
}

// 상품 액션 타입
export type ProductAction =
  | { type: "SELECT_PRODUCT"; payload: { productId: string } }
  | { type: "UPDATE_PRODUCTS"; payload: { products: Product[] } }
  | { type: "APPLY_LIGHTNING_SALE"; payload: { productId: string; discountedPrice: number } }
  | { type: "APPLY_SUGGEST_SALE"; payload: { productId: string; discountedPrice: number } }
  | { type: "RESET_PRODUCTS" };

// 초기 상품 상태
export const initialProductState: ProductState = {
  productList: Object.values(PRODUCT_DATA),
  selectedProductId: PRODUCT_ONE,
};

// 상품 리듀서
export function productReducer(state: ProductState, action: ProductAction): ProductState {
  switch (action.type) {
    case "SELECT_PRODUCT": {
      const { productId } = action.payload;
      return {
        ...state,
        selectedProductId: productId,
      };
    }

    case "UPDATE_PRODUCTS": {
      const { products } = action.payload;
      return {
        ...state,
        productList: products,
      };
    }

    case "APPLY_LIGHTNING_SALE": {
      const { productId, discountedPrice } = action.payload;
      return {
        ...state,
        productList: state.productList.map((product) =>
          product.id === productId
            ? {
                ...product,
                val: discountedPrice,
                onSale: true,
              }
            : product,
        ),
      };
    }

    case "APPLY_SUGGEST_SALE": {
      const { productId, discountedPrice } = action.payload;
      return {
        ...state,
        productList: state.productList.map((product) =>
          product.id === productId
            ? {
                ...product,
                val: discountedPrice,
                suggestSale: true,
              }
            : product,
        ),
      };
    }

    case "RESET_PRODUCTS": {
      return {
        ...state,
        productList: Object.values(PRODUCT_DATA),
      };
    }

    default:
      return state;
  }
}

// Context 생성
export interface ProductContextType {
  state: ProductState;
  dispatch: React.Dispatch<ProductAction>;
}

export const [ProductContextProvider, useProductContext] =
  createSafeContext<ProductContextType>("Product");
