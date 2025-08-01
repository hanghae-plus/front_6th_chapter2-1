/**
 * 프로모션 가격 서비스 (TypeScript version)
 * 프로모션 관련 가격 업데이트 로직
 */

import { Product } from '@/advanced/features/cart/utils/stockUtils.ts';
import { findProductById } from '@/advanced/features/product/utils/productUtils.ts';

/**
 * 번개세일 적용 (순수 함수)
 */
export const applyFlashSale = (
  productId: string,
  discountRate: number,
  productList: Product[],
): boolean => {
  const product = findProductById(productId, productList);

  if (!product || product.q <= 0 || product.onSale) {
    return false;
  }

  // 원가 저장 (아직 저장되지 않은 경우)
  if (!product.originalVal || product.originalVal === product.val) {
    product.originalVal = product.val;
  }

  // 할인 적용
  product.val = Math.round(product.originalVal * (1 - discountRate));
  product.onSale = true;

  return true;
};

/**
 * 추천세일 적용 (순수 함수)
 */
export const applySuggestSale = (
  productId: string,
  discountRate: number,
  productList: Product[],
): boolean => {
  const product = findProductById(productId, productList);

  if (!product || product.q <= 0 || product.suggestSale) {
    return false;
  }

  // 원가 저장 (아직 저장되지 않은 경우)
  if (!product.originalVal || product.originalVal === product.val) {
    product.originalVal = product.val;
  }

  // 할인 적용
  product.val = Math.round(product.originalVal * (1 - discountRate));
  product.suggestSale = true;

  return true;
};

/**
 * 세일 포맷팅으로 가격 디스플레이 업데이트
 */
export const formatSalePrice = (product: Product): string => {
  if (product.onSale && product.suggestSale) {
    // 번개세일 + 추천세일
    return `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-purple-600">₩${product.val.toLocaleString()}</span>`;
  } else if (product.onSale) {
    // 번개세일만
    return `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-red-500">₩${product.val.toLocaleString()}</span>`;
  } else if (product.suggestSale) {
    // 추천세일만
    return `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-blue-500">₩${product.val.toLocaleString()}</span>`;
  } else {
    // 일반 가격
    return `₩${product.val.toLocaleString()}`;
  }
};

/**
 * 세일 인디케이터로 이름 포맷팅
 */
export const formatSaleName = (product: Product): string => {
  if (product.onSale && product.suggestSale) {
    return `⚡💝${product.name}`;
  } else if (product.onSale) {
    return `⚡${product.name}`;
  } else if (product.suggestSale) {
    return `💝${product.name}`;
  }
  return product.name;
};
