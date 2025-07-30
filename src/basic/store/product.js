import { createStore } from ".";
import { productIds, products } from "../constants/product.constant";

const initialProductState = {
  products,
  productIds,
};

const productActions = {
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
