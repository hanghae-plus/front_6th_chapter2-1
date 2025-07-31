import type { CartItem, PointsDetail } from '../types';
import { 
  BASE_POINTS_RATE, 
  TUESDAY_POINTS_MULTIPLIER,
  BONUS_POINTS,
  BONUS_POINTS_THRESHOLDS,
  KEYBOARD,
  MOUSE,
  MONITOR_ARM,
} from '../constants';


/**
 * 기본 포인트를 계산합니다.
 * @param {number} totalAmount - 총액
 * @returns {number} 기본 포인트
 */
export function calculateBasePoints(totalAmount: number): number {
  return Math.round(totalAmount / BASE_POINTS_RATE);
}

/**
 * 화요일 보너스 포인트를 계산합니다.
 * @param {number} basePoints - 기본 포인트
 * @param {boolean} isTuesday - 화요일 여부
 * @returns {number} 화요일 보너스 포인트
 */
export function calculateTuesdayBonus(basePoints: number, isTuesday: boolean): number {
  if (isTuesday) {
    return basePoints * (TUESDAY_POINTS_MULTIPLIER - 1); // 기본 포인트를 제외한 추가 포인트
  }
  return 0;
}

/**
 * 세트 구매 보너스 포인트를 계산합니다.
 * @param {CartItem[]} cartItems - 장바구니 아이템들
 * @returns {Object} 세트 보너스 정보
 */
export function calculateSetBonus(cartItems: CartItem[]): { bonus: number; description: string } {
  const hasKeyboard = cartItems.some(item => item.id === KEYBOARD);
  const hasMouse = cartItems.some(item => item.id === MOUSE);
  const hasMonitorArm = cartItems.some(item => item.id === MONITOR_ARM);

  // 풀세트 (키보드 + 마우스 + 모니터암)
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    return {
      bonus: BONUS_POINTS.FULL_SET,
      description: '풀세트 구매',
    };
  }

  // 키보드 + 마우스 세트
  if (hasKeyboard && hasMouse) {
    return {
      bonus: BONUS_POINTS.KEYBOARD_MOUSE_SET,
      description: '키보드+마우스 세트',
    };
  }

  return {
    bonus: 0,
    description: '',
  };
}

/**
 * 수량별 보너스 포인트를 계산합니다.
 * @param {number} totalQuantity - 총 수량
 * @returns {Object} 수량 보너스 정보
 */
export function calculateQuantityBonus(totalQuantity: number): { bonus: number; description: string } {
  if (totalQuantity >= BONUS_POINTS_THRESHOLDS.LARGE) {
    return {
      bonus: BONUS_POINTS.BULK_PURCHASE.LARGE,
      description: `대량구매(${BONUS_POINTS_THRESHOLDS.LARGE}개+)`,
    };
  } else if (totalQuantity >= BONUS_POINTS_THRESHOLDS.MEDIUM) {
    return {
      bonus: BONUS_POINTS.BULK_PURCHASE.MEDIUM,
      description: `대량구매(${BONUS_POINTS_THRESHOLDS.MEDIUM}개+)`,
    };
  } else if (totalQuantity >= BONUS_POINTS_THRESHOLDS.SMALL) {
    return {
      bonus: BONUS_POINTS.BULK_PURCHASE.SMALL,
      description: `대량구매(${BONUS_POINTS_THRESHOLDS.SMALL}개+)`,
    };
  }

  return {
    bonus: 0,
    description: '',
  };
}

/**
 * 총 포인트를 계산합니다.
 * @param {number} totalAmount - 총액
 * @param {CartItem[]} cartItems - 장바구니 아이템들
 * @param {boolean} isTuesday - 화요일 여부
 * @returns {Object} 포인트 계산 결과
 */
export function calculateTotalPoints(totalAmount: number, cartItems: CartItem[], isTuesday: boolean): {
  totalPoints: number;
  pointsDetail: PointsDetail[];
} {
  const basePoints = calculateBasePoints(totalAmount);
  const tuesdayBonus = calculateTuesdayBonus(basePoints, isTuesday);
  const setBonus = calculateSetBonus(cartItems);
  const quantityBonus = calculateQuantityBonus(
    cartItems.reduce((sum, item) => sum + item.quantity, 0)
  );

  const pointsDetail: PointsDetail[] = [];

  // 기본 포인트
  if (basePoints > 0) {
    pointsDetail.push({
      type: 'base',
      amount: basePoints,
      description: '기본',
    });
  }

  // 화요일 보너스
  if (tuesdayBonus > 0) {
    pointsDetail.push({
      type: 'tuesday',
      amount: tuesdayBonus,
      description: '화요일 2배',
    });
  }

  // 세트 보너스
  if (setBonus.bonus > 0) {
    pointsDetail.push({
      type: 'set',
      amount: setBonus.bonus,
      description: setBonus.description,
    });
  }

  // 수량 보너스
  if (quantityBonus.bonus > 0) {
    pointsDetail.push({
      type: 'bulk',
      amount: quantityBonus.bonus,
      description: quantityBonus.description,
    });
  }

  const totalPoints = basePoints + tuesdayBonus + setBonus.bonus + quantityBonus.bonus;

  return {
    totalPoints,
    pointsDetail,
  };
} 