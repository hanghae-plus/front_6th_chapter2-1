import { createStore } from ".";
import { PRODUCTS, PRODUCT_IDS } from "../constants/product.constant";

const initialProductState = {
  products: PRODUCTS,
  productIds: PRODUCT_IDS,
};

const productActions = {
  // 상품 재고 업데이트
  updateStock: (state, productId, newQuantity) => {
    return {
      ...state,
      products: state.products.map((product) =>
        product.id === productId
          ? { ...product, quantity: newQuantity }
          : product
      ),
    };
  },
};

const productStore = createStore(initialProductState, productActions);

export default productStore;
