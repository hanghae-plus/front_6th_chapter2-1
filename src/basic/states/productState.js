import { DISCOUNT_RATE } from '../constants/constants';
import { findProductById } from '../libs/findProductById';

export const applyFlashSale = (state, productId) => {
  const { productState } = state;

  const product = findProductById(productState, productId);
  if (!product) return;

  product.changedPrice = Math.round(product.originalPrice * (1 - DISCOUNT_RATE.FLASH)); // 20% 할인
  product.flashSale = true;
};

export const applySuggestSale = (state, productId) => {
  const { productState } = state;

  const product = findProductById(productState, productId);
  if (!product) return;

  product.changedPrice = Math.round(product.changedPrice * (1 - DISCOUNT_RATE.SUGGEST)); // 5% 추가 할인
  product.suggestSale = true;
};
