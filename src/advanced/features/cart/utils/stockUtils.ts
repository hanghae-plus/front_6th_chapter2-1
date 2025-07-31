/**
 * 재고 관련 유틸 함수들 (React 버전)
 * 재고 검증 및 관리 로직
 */

import { Product } from '@/advanced/features/product/types/index.ts';

export const stockValidators = {
  /**
   * 재고 부족 여부 확인
   */
  isInsufficientStock: (
    currentQuantity: number,
    newQuantity: number,
    availableStock: number,
  ): boolean => {
    return newQuantity > currentQuantity + availableStock;
  },

  /**
   * 품절 여부 확인
   */
  isOutOfStock: (stock: number): boolean => stock <= 0,

  /**
   * 수량 증가 가능 여부 확인
   */
  canIncreaseQuantity: (change: number, availableStock: number): boolean => {
    return change <= 0 || availableStock >= change;
  },

  /**
   * 사용 가능한 재고가 있는지 확인
   */
  hasAvailableStock: (product: Product): boolean => {
    return product && product.q > 0;
  },
};

export const quantityManagers = {
  /**
   * 새 수량 계산
   */
  calculateNewQuantity: (currentQuantity: number, change: number): number => {
    return Math.max(0, currentQuantity + change);
  },

  /**
   * 수량 변경이 유효한지 확인
   */
  isValidQuantityChange: (currentQuantity: number, change: number): boolean => {
    return quantityManagers.calculateNewQuantity(currentQuantity, change) >= 0;
  },
};

export const stockManagers = {
  /**
   * 재고 업데이트
   */
  updateStock: (product: Product, amount: number): Product => {
    return {
      ...product,
      q: Math.max(0, product.q + amount),
    };
  },

  /**
   * 재고 감소
   */
  decreaseStock: (product: Product, amount: number = 1): Product => {
    return stockManagers.updateStock(product, -amount);
  },

  /**
   * 재고 증가
   */
  increaseStock: (product: Product, amount: number): Product => {
    return stockManagers.updateStock(product, amount);
  },
};
