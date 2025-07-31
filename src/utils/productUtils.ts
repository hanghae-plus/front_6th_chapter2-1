import { Product } from '../types';

/**
 * 상품 배열에서 특정 ID로 상품을 찾습니다.
 *
 * @param products - 상품 배열
 * @param productId - 찾을 상품 ID
 * @returns 찾은 상품 또는 undefined
 */
export const findProductById = (products: Product[], productId: string): Product | undefined => {
  return products.find((p) => p.id === productId);
};

/**
 * 상품의 가격 텍스트를 생성합니다.
 * 번개세일인 경우 원가와 할인가를 모두 표시합니다.
 *
 * @param product - 상품 정보
 * @returns 가격 표시 텍스트
 */
