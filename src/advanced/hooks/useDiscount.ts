import { useCallback } from 'react';
import { CartState, DiscountInfo, UseDiscountReturn } from '../types/index.js';
import { createDiscountInfo } from '../utils/discountUtils.js';

/**
 * 할인 계산을 위한 커스텀 훅
 */
export const useDiscount = (): UseDiscountReturn => {
  
  const calculateDiscount = useCallback((cartState: CartState): DiscountInfo | null => {
    const { items, totalItemCount } = cartState;
    
    if (items.length === 0) {
      return null;
    }

    return createDiscountInfo(items, totalItemCount);
  }, []);

  const applyLightningSale = useCallback((productId: string) => {
    // 번개세일 로직은 상품 상태를 직접 변경하므로 
    // 실제로는 상품 관리 훅에서 처리해야 함
    console.log(`번개세일 적용: ${productId}`);
  }, []);

  const applySuggestedSale = useCallback((productId: string, lastSelectedProductId: string) => {
    // 추천할인 로직도 상품 상태를 직접 변경하므로
    // 실제로는 상품 관리 훅에서 처리해야 함
    console.log(`추천할인 적용: ${productId}, 마지막 선택: ${lastSelectedProductId}`);
  }, []);

  const resetSaleStatus = useCallback((productId: string) => {
    console.log(`세일 상태 초기화: ${productId}`);
  }, []);

  return {
    calculateDiscount,
    applyLightningSale,
    applySuggestedSale,
    resetSaleStatus,
  };
};