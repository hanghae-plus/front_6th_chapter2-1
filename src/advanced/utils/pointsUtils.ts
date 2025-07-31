import { CartItem } from '../types/index.js';
import { POINTS_POLICY, PRODUCT_IDS } from '../constants/index.js';
import { isTuesday } from './dateUtils.js';

// ============== 포인트 계산 관련 유틸리티 함수들 ==============

// 기본 포인트 계산
export const calculateBasePoints = (totalAmount: number): number => {
  const basePoints = Math.floor(totalAmount * POINTS_POLICY.BASE_RATE);
  const tuesdayMultiplier = isTuesday() ? POINTS_POLICY.TUESDAY_MULTIPLIER : 1;
  return basePoints * tuesdayMultiplier;
};

// 상품 조합 보너스 계산
export const calculateProductBonus = (items: CartItem[]): { points: number; descriptions: string[] } => {
  let bonusPoints = 0;
  const descriptions: string[] = [];

  const productIds = items.map(item => item.id);
  const hasKeyboard = productIds.includes(PRODUCT_IDS.KEYBOARD);
  const hasMouse = productIds.includes(PRODUCT_IDS.MOUSE);
  const hasMonitorArm = productIds.includes(PRODUCT_IDS.MONITOR_ARM);

  // 키보드+마우스 세트 보너스
  if (hasKeyboard && hasMouse) {
    bonusPoints += POINTS_POLICY.KEYBOARD_MOUSE_BONUS;
    descriptions.push('키보드+마우스 세트');
  }

  // 풀세트 보너스 (키보드+마우스+모니터암)
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    bonusPoints += POINTS_POLICY.FULL_SET_BONUS;
    descriptions.push('풀세트 구매');
  }

  return { points: bonusPoints, descriptions };
};

// 수량별 보너스 계산
export const calculateBulkBonus = (totalItemCount: number): { points: number; descriptions: string[] } => {
  let bonusPoints = 0;
  const descriptions: string[] = [];

  const bulkBonusThresholds = Object.keys(POINTS_POLICY.BULK_PURCHASE_BONUS)
    .map(Number)
    .sort((a, b) => b - a); // 내림차순 정렬

  for (const threshold of bulkBonusThresholds) {
    if (totalItemCount >= threshold) {
      bonusPoints += POINTS_POLICY.BULK_PURCHASE_BONUS[threshold];
      descriptions.push(`대량구매(${threshold}개+)`);
      break; // 가장 높은 보너스만 적용
    }
  }

  return { points: bonusPoints, descriptions };
};

// 포인트 설명 생성
export const generatePointDescriptions = (
  basePoints: number, 
  bonusDescriptions: string[]
): string[] => {
  const descriptions: string[] = [];
  descriptions.push(`기본: ${basePoints}p`);
  
  if (isTuesday()) {
    descriptions.push('화요일 2배');
  }
  
  if (bonusDescriptions.length > 0) {
    descriptions.push(...bonusDescriptions);
  }

  return descriptions;
}; 