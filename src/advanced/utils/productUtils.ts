import { Product } from '../types/index.js';
import { UI_CONSTANTS } from '../constants/ui.js';

// ============== 상품 관련 유틸리티 함수들 ==============

// 상품의 할인 상태 확인
export const getProductSaleStatus = (product: Product): {
  isOnSale: boolean;
  isSuggestedSale: boolean;
  isDualSale: boolean;
} => {
  const isOnSale = product.isOnSale || false;
  const isSuggestedSale = product.isSuggestedSale || false;
  const isDualSale = isOnSale && isSuggestedSale;

  return { isOnSale, isSuggestedSale, isDualSale };
};

// 상품 옵션 텍스트 생성
export const createProductOptionText = (product: Product): string => {
  const { isOnSale, isSuggestedSale, isDualSale } = getProductSaleStatus(product);
  
  let discountText = '';
  if (isOnSale) discountText += UI_CONSTANTS.TEXT.SALE_SUFFIX;
  if (isSuggestedSale) discountText += UI_CONSTANTS.TEXT.RECOMMENDED_SUFFIX;

  // 품절 상품 처리
  if (product.stock === 0) {
    return `${product.name} - ${product.price}원 (${UI_CONSTANTS.TEXT.OUT_OF_STOCK})${discountText}`;
  }

  // 할인 상품 표시
  if (isDualSale) {
    return `${UI_CONSTANTS.ICONS.DUAL_SALE}${product.name} - ${product.originalPrice}원 → ${product.price}원 (${UI_CONSTANTS.TEXT.SUPER_SALE})`;
  } else if (isOnSale) {
    return `${UI_CONSTANTS.ICONS.LIGHTNING}${product.name} - ${product.originalPrice}원 → ${product.price}원 (${UI_CONSTANTS.TEXT.LIGHTNING_SALE})`;
  } else if (isSuggestedSale) {
    return `${UI_CONSTANTS.ICONS.RECOMMENDED}${product.name} - ${product.originalPrice}원 → ${product.price}원 (${UI_CONSTANTS.TEXT.RECOMMENDED_SALE})`;
  } else {
    return `${product.name} - ${product.price}원${discountText}`;
  }
};

// 상품 옵션 스타일 클래스 생성
export const getProductOptionStyleClass = (product: Product): string => {
  if (product.stock === 0) {
    return UI_CONSTANTS.COLORS.OUT_OF_STOCK;
  }

  const { isOnSale, isSuggestedSale, isDualSale } = getProductSaleStatus(product);
  
  if (isDualSale) {
    return `${UI_CONSTANTS.COLORS.DUAL_SALE} font-bold`;
  } else if (isOnSale) {
    return `${UI_CONSTANTS.COLORS.LIGHTNING_SALE} font-bold`;
  } else if (isSuggestedSale) {
    return `${UI_CONSTANTS.COLORS.RECOMMENDED_SALE} font-bold`;
  }
  
  return '';
};

// 상품 이름 접두사 생성
export const getProductNamePrefix = (product: Product): string => {
  const { isOnSale, isSuggestedSale, isDualSale } = getProductSaleStatus(product);
  
  if (isDualSale) return UI_CONSTANTS.ICONS.DUAL_SALE;
  if (isOnSale) return UI_CONSTANTS.ICONS.LIGHTNING;
  if (isSuggestedSale) return UI_CONSTANTS.ICONS.RECOMMENDED;
  
  return '';
};

// 상품 가격 표시 색상 클래스 생성
export const getProductPriceColorClass = (product: Product): string => {
  const { isOnSale, isSuggestedSale, isDualSale } = getProductSaleStatus(product);
  
  if (isDualSale) return UI_CONSTANTS.COLORS.DUAL_SALE;
  if (isOnSale) return UI_CONSTANTS.COLORS.LIGHTNING_SALE;
  if (isSuggestedSale) return UI_CONSTANTS.COLORS.RECOMMENDED_SALE;
  
  return '';
}; 