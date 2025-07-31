import { Product } from '../types';

/**
 * 상품의 표시 이름을 생성합니다.
 * 번개세일, 추천세일 등의 정보를 포함하여 반환합니다.
 *
 * @param product - 상품 정보
 * @returns 표시용 상품명
 */
export const formatProductName = (product: Product): string => {
  let displayName = product.name;

  if (product.lightningSale) {
    displayName += ' ⚡번개세일!';
  }
  if (product.suggestSale) {
    displayName += ' 💝추천세일!';
  }

  return displayName;
};

export const displayProductPriceText = (product: Product): string => {
  if (product.lightningSale && product.originalPrice) {
    return `${product.originalPrice.toLocaleString()}원 → ${product.price.toLocaleString()}원`;
  }
  return `${product.price.toLocaleString()}원`;
};
