import type { CartItem } from '../types/cart';
import { QUANTITY_THRESHOLDS, POINT_RATES } from '../constants/shopPolicy';
import { KEYBOARD_ID, MOUSE_ID } from '../constants/productId';

// 기본 포인트 계산 (결제 금액의 0.1%)
function calculateBasePoints(totalAmount: number, isTuesday: boolean = false) {
  const basePoints = Math.floor(totalAmount * POINT_RATES.BASE_RATE);
  const multiplier = isTuesday ? POINT_RATES.TUESDAY_MULTIPLIER : 1;
  
  return {
    points: basePoints * multiplier,
    description: isTuesday ? `기본: ${basePoints}p × 2 (화요일)` : `기본: ${basePoints}p`
  };
}

// 세트 구매 보너스 계산
function calculateSetBonus(items: CartItem[]) {
  const hasKeyboard = items.some(item => item.id === KEYBOARD_ID && item.quantity > 0);
  const hasMouse = items.some(item => item.id === MOUSE_ID && item.quantity > 0);
  const hasAllProducts = items.length >= 5 && items.every(item => item.quantity > 0);
  
  const bonuses: { points: number; description: string }[] = [];
  
  if (hasAllProducts) {
    // 풀세트 보너스 (키보드+마우스 보너스 포함)
    bonuses.push({
      points: POINT_RATES.SETS.FULL_SET,
      description: `풀세트 보너스 +${POINT_RATES.SETS.FULL_SET}p`
    });
  } else if (hasKeyboard && hasMouse) {
    // 키보드+마우스 세트 보너스
    bonuses.push({
      points: POINT_RATES.SETS.KEYBOARD_MOUSE,
      description: `키보드+마우스 세트 +${POINT_RATES.SETS.KEYBOARD_MOUSE}p`
    });
  }
  
  return bonuses;
}

// 대량구매 보너스 계산
function calculateBulkBonus(itemCount: number) {
  const bonuses: { points: number; description: string }[] = [];
  
  if (itemCount >= QUANTITY_THRESHOLDS.BONUS_LARGE) {
    bonuses.push({
      points: POINT_RATES.BULK_BONUS.LARGE,
      description: `대량구매 보너스 (30개↑) +${POINT_RATES.BULK_BONUS.LARGE}p`
    });
  } else if (itemCount >= QUANTITY_THRESHOLDS.BONUS_MEDIUM) {
    bonuses.push({
      points: POINT_RATES.BULK_BONUS.MEDIUM,
      description: `대량구매 보너스 (20개↑) +${POINT_RATES.BULK_BONUS.MEDIUM}p`
    });
  } else if (itemCount >= QUANTITY_THRESHOLDS.BONUS_SMALL) {
    bonuses.push({
      points: POINT_RATES.BULK_BONUS.SMALL,
      description: `대량구매 보너스 (10개↑) +${POINT_RATES.BULK_BONUS.SMALL}p`
    });
  }
  
  return bonuses;
}

// 메인 포인트 계산 함수
export function calculateLoyaltyPoints(
  items: CartItem[],
  totalAmount: number
): { loyaltyPoints: number; pointsBreakdown: string[] } {
  const isTuesday = new Date().getDay() === 2;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // 각종 포인트 계산
  const basePoints = calculateBasePoints(totalAmount, isTuesday);
  const setBonuses = calculateSetBonus(items);
  const bulkBonuses = calculateBulkBonus(itemCount);
  
  // 총 포인트 계산
  const totalBonusPoints = [
    ...setBonuses,
    ...bulkBonuses
  ].reduce((sum, bonus) => sum + bonus.points, 0);
  
  const finalLoyaltyPoints = basePoints.points + totalBonusPoints;
  
  // 포인트 내역 생성
  const pointsBreakdown = [
    basePoints.description,
    ...setBonuses.map(bonus => bonus.description),
    ...bulkBonuses.map(bonus => bonus.description)
  ];
  
  return {
    loyaltyPoints: finalLoyaltyPoints,
    pointsBreakdown
  };
}