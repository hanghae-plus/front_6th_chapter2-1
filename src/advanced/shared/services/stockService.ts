/**
 * 재고 관리 서비스
 * 재고 검증 및 재고 부족 에러 처리
 */
import type { Product, CartItem } from '../types';

export class StockValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StockValidationError';
  }
}

// 재고 검증 및 관리 서비스
export const stockService = {
  canAddToCart: (product: Product | undefined): boolean => {
    return !!product && product.stock > 0;
  },

  canUpdateQuantity: (
    product: Product | undefined,
    currentQuantity: number,
    newQuantity: number
  ): boolean => {
    if (!product) return false;
    const quantityDiff = newQuantity - currentQuantity;
    return quantityDiff <= 0 || product.stock >= quantityDiff;
  },

  validateAddToCart: (product: Product | undefined): void => {
    if (!product) {
      throw new StockValidationError('상품을 찾을 수 없습니다.');
    }
    if (product.stock === 0) {
      throw new StockValidationError('재고가 부족합니다.');
    }
  },

  validateQuantityUpdate: (
    product: Product | undefined,
    currentQuantity: number,
    newQuantity: number
  ): void => {
    if (!product) {
      throw new StockValidationError('상품을 찾을 수 없습니다.');
    }

    const quantityDiff = newQuantity - currentQuantity;
    if (quantityDiff > 0 && product.stock < quantityDiff) {
      throw new StockValidationError('재고가 부족합니다.');
    }
  },
};
