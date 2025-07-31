import { CartItem } from '../types';
import { POINTS_CONFIG, WEEKDAYS } from '../constants/config';
import { PRODUCT_ONE, PRODUCT_TWO, PRODUCT_THREE } from '../constants/products';

// ==========================================
// 포인트 계산 서비스 🎁
// ==========================================

/**
 * 기본 포인트 계산
 */
export function calculateBasePoints(totalAmount: number): number {
  return Math.floor(totalAmount / POINTS_CONFIG.BASE_POINT_RATE);
}

/**
 * 화요일 포인트 배수 적용
 */
export function applyTuesdayPointBonus(points: number): number {
  const today = new Date();
  const isTuesday = today.getDay() === WEEKDAYS.TUESDAY;

  return isTuesday ? points * POINTS_CONFIG.TUESDAY_MULTIPLIER : points;
}

/**
 * 조합 보너스 포인트 계산
 */
export function calculateComboBonus(cartItems: CartItem[]): number {
  const productIds = cartItems.map((item) => item.id);
  const hasKeyboard = productIds.includes(PRODUCT_ONE);
  const hasMouse = productIds.includes(PRODUCT_TWO);
  const hasMonitorArm = productIds.includes(PRODUCT_THREE);

  let comboBonus = 0;

  // 풀세트 보너스 (키보드 + 마우스 + 모니터암)
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    comboBonus += POINTS_CONFIG.COMBO_BONUS.FULL_SET;
  }
  // 키보드 + 마우스 보너스
  else if (hasKeyboard && hasMouse) {
    comboBonus += POINTS_CONFIG.COMBO_BONUS.KEYBOARD_MOUSE;
  }

  return comboBonus;
}

/**
 * 대량구매 보너스 포인트 계산
 */
export function calculateBulkBonus(totalItemCount: number): number {
  if (totalItemCount >= 30) {
    return POINTS_CONFIG.BULK_BONUS.THIRTY_PLUS;
  } else if (totalItemCount >= 20) {
    return POINTS_CONFIG.BULK_BONUS.TWENTY_PLUS;
  } else if (totalItemCount >= 10) {
    return POINTS_CONFIG.BULK_BONUS.TEN_PLUS;
  }

  return 0;
}

/**
 * 총 포인트 계산
 */
export function calculateTotalPoints(
  cartItems: CartItem[],
  finalAmount: number
): number {
  const totalItemCount = cartItems.reduce(
    (sum, item) => sum + (item.cartQuantity || 1),
    0
  );

  let basePoints = calculateBasePoints(finalAmount);
  basePoints = applyTuesdayPointBonus(basePoints);

  const comboBonus = calculateComboBonus(cartItems);
  const bulkBonus = calculateBulkBonus(totalItemCount);

  return basePoints + comboBonus + bulkBonus;
}
