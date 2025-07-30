import { findProductById } from "../../utils/findProductById";

export const applyFlashSale = (state, productId) => {
  const { productState } = state;

  const product = findProductById(productState, productId);
  if (!product) return;

  product.changedPrice = Math.round(product.originalPrice * 0.8); // 20% 할인
  product.onSale = true;

};

export const applySuggestSale = (state, productId) => {
  const { productState } = state;

  const product = findProductById(productState, productId);
  if (!product) return;

  product.changedPrice = Math.round(product.changedPrice * 0.95); // 5% 추가 할인
  product.suggestSale = true;
};
