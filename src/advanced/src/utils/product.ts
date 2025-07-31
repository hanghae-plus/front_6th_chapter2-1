import type { Product } from '../types';
import { PRODUCT_DISCOUNTS } from '../constants';

/**
 * 상품 ID로 상품을 찾습니다.
 * @param {Product[]} products - 상품 목록
 * @param {string} productId - 상품 ID
 * @returns {Product | undefined} 찾은 상품 또는 undefined
 */
export function findProductById(products: Product[], productId: string): Product | undefined {
  return products.find((product) => product.id === productId);
}

/**
 * 상품이 할인 중인지 확인합니다.
 * @param {Product} product - 상품 정보
 * @returns {boolean} 할인 여부
 */
export function isProductOnSale(product: Product): boolean {
  return product.onSale || product.suggestSale;
}

/**
 * 상품의 할인 정보를 가져옵니다.
 * @param {Product} product - 상품 정보
 * @returns {Object} 할인 정보
 */
export function getProductDiscountInfo(product: Product) {
  const discountStates: string[] = [];
  
  if (product.onSale) {
    discountStates.push('⚡SALE');
  }
  if (product.suggestSale) {
    discountStates.push('💝SUGGEST');
  }

  const discountRate = product.originalVal > 0 
    ? ((product.originalVal - product.val) / product.originalVal) * 100 
    : 0;

  return {
    isOnSale: discountStates.length > 0,
    discountStates,
    discountRate,
    savedAmount: product.originalVal - product.val,
  };
}

/**
 * 상품의 할인 아이콘을 가져옵니다.
 * @param {Object} params - 파라미터
 * @param {boolean} params.onSale - 번개세일 여부
 * @param {boolean} params.suggestSale - 추천할인 여부
 * @returns {string} 할인 아이콘
 */
export function getProductDiscountIcon({ onSale, suggestSale }: { onSale: boolean; suggestSale: boolean }): string {
  if (onSale && suggestSale) {
    return '⚡💝 ';
  } else if (onSale) {
    return '⚡ ';
  } else if (suggestSale) {
    return '💝 ';
  }
  return '';
}

/**
 * 상품의 할인 스타일을 가져옵니다.
 * @param {Object} params - 파라미터
 * @param {boolean} params.onSale - 번개세일 여부
 * @param {boolean} params.suggestSale - 추천할인 여부
 * @returns {string} CSS 클래스명
 */
export function getProductDiscountStyle({ onSale, suggestSale }: { onSale: boolean; suggestSale: boolean }): string {
  if (onSale && suggestSale) {
    return 'text-orange-500 font-bold';
  } else if (onSale) {
    return 'text-red-500 font-semibold';
  } else if (suggestSale) {
    return 'text-pink-500 font-semibold';
  }
  return 'text-black';
}

/**
 * 상품 가격을 포맷팅합니다.
 * @param {Product} product - 상품 정보
 * @param {boolean} useLocaleString - 로케일 문자열 사용 여부
 * @returns {string} 포맷팅된 가격
 */
export function formatProductPrice(product: Product, useLocaleString = false): string {
  const price = useLocaleString ? product.val.toLocaleString() : product.val.toString();
  return `₩${price}`;
}

/**
 * 상품의 표시 이름을 가져옵니다.
 * @param {Product} product - 상품 정보
 * @returns {string} 표시 이름
 */
export function getProductDisplayName(product: Product): string {
  const discountInfo = getProductDiscountInfo(product);
  const discountIcon = getProductDiscountIcon(product);
  
  return `${discountIcon}${product.name}`;
} 