// ==========================================
// 보너스 포인트 커스텀 훅
// ==========================================

import { useMemo } from 'react';
import { calculateBonusPoints, type PointCalculationResult } from '../services/pointService';
import type { Product } from '../types';

/**
 * 보너스 포인트 계산 커스텀 훅
 *
 * @param totalAmount - 총 구매 금액
 * @param cartItems - 장바구니 아이템들
 * @param itemCount - 총 아이템 개수
 * @returns 계산된 포인트 정보
 */
export const useBonusPoints = (
  totalAmount: number,
  cartItems: Product[],
  itemCount: number
): PointCalculationResult => {
  return useMemo(() => {
    return calculateBonusPoints(totalAmount, cartItems, itemCount);
  }, [totalAmount, cartItems, itemCount]);
};