import { useCallback } from 'react';
import { CartState, PointsInfo, UsePointsReturn } from '../types/index.js';
import { 
  calculateBasePoints, 
  calculateProductBonus, 
  calculateBulkBonus, 
  generatePointDescriptions 
} from '../utils/pointsUtils.js';
import { isTuesday } from '../utils/dateUtils.js';

/**
 * 포인트 계산을 위한 커스텀 훅
 */
export const usePoints = (): UsePointsReturn => {
  
  const calculatePoints = useCallback((cartState: CartState): PointsInfo => {
    const { items, totalAmount, totalItemCount } = cartState;
    
    if (items.length === 0) {
      return {
        base: 0,
        bonus: 0,
        total: 0,
        description: [],
        isTuesdayDouble: false,
      };
    }

    // 기본 포인트 계산
    const basePoints = calculateBasePoints(totalAmount);

    // 보너스 포인트 계산
    const productBonus = calculateProductBonus(items);
    const bulkBonus = calculateBulkBonus(totalItemCount);
    
    const totalBonusPoints = productBonus.points + bulkBonus.points;
    const allBonusDescriptions = [...productBonus.descriptions, ...bulkBonus.descriptions];

    // 설명 텍스트 생성
    const descriptions = generatePointDescriptions(basePoints, allBonusDescriptions);

    return {
      base: basePoints,
      bonus: totalBonusPoints,
      total: basePoints + totalBonusPoints,
      description: descriptions,
      isTuesdayDouble: isTuesday(),
    };
  }, []);

  return {
    calculatePoints,
  };
};