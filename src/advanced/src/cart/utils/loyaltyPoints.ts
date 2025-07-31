import { CartItem } from 'types';

// 포인트 계산 관련 상수
const LOYALTY_POINT_RATES = {
  BASE_RATE: 1000, // 1000원당 1포인트
  TUESDAY_MULTIPLIER: 2, // 화요일 2배
  KEYBOARD_MOUSE_BONUS: 50, // 키보드+마우스 세트 보너스
  FULL_SET_BONUS: 100, // 풀세트 보너스
  QUANTITY_BONUSES: {
    TEN_ITEMS: 20,
    TWENTY_ITEMS: 50,
    THIRTY_ITEMS: 100,
  },
} as const;

// 화요일 여부 확인
const isTuesday = (): boolean => {
  return new Date().getDay() === 2;
};

/**
 * 기본 포인트 계산
 * 최종 금액을 기준으로 기본 포인트를 계산
 */
export const getBasePoints = (finalTotal: number): number => {
  return Math.floor(finalTotal / LOYALTY_POINT_RATES.BASE_RATE);
};

/**
 * 화요일 보너스 계산
 * 화요일인 경우 기본 포인트에 2배 보너스 적용
 */
export const getTuesdayBonus = (basePoints: number): number => {
  if (!isTuesday() || basePoints <= 0) return 0;
  return basePoints * (LOYALTY_POINT_RATES.TUESDAY_MULTIPLIER - 1); // 추가 보너스만 반환
};

/**
 * 상품 세트 보너스 계산
 * 키보드+마우스 세트와 풀세트 보너스를 계산
 */
export const getSetBonus = (cartItems: CartItem[]): number => {
  const hasKeyboard = cartItems.some((item) => item.product.id === 'p1');
  const hasMouse = cartItems.some((item) => item.product.id === 'p2');
  const hasMonitorArm = cartItems.some((item) => item.product.id === 'p3');

  let bonus = 0;

  // 키보드+마우스 세트 보너스
  if (hasKeyboard && hasMouse) {
    bonus += LOYALTY_POINT_RATES.KEYBOARD_MOUSE_BONUS;
  }

  // 풀세트 보너스 (키보드+마우스+모니터암)
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    bonus += LOYALTY_POINT_RATES.FULL_SET_BONUS;
  }

  return bonus;
};

/**
 * 수량 보너스 계산
 * 총 구매 수량에 따른 보너스 포인트를 계산
 */
export const getQuantityBonus = (cartItems: CartItem[]): number => {
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (totalQuantity >= 30) {
    return LOYALTY_POINT_RATES.QUANTITY_BONUSES.THIRTY_ITEMS;
  }
  if (totalQuantity >= 20) {
    return LOYALTY_POINT_RATES.QUANTITY_BONUSES.TWENTY_ITEMS;
  }
  if (totalQuantity >= 10) {
    return LOYALTY_POINT_RATES.QUANTITY_BONUSES.TEN_ITEMS;
  }

  return 0;
};

/**
 * 총 포인트 계산
 * 모든 보너스를 포함한 최종 포인트를 계산
 */
export const getLoyaltyPoints = (
  cartItems: CartItem[],
  finalTotal: number
): number => {
  const basePoints = getBasePoints(finalTotal);
  const tuesdayBonus = getTuesdayBonus(basePoints);
  const setBonus = getSetBonus(cartItems);
  const quantityBonus = getQuantityBonus(cartItems);

  return basePoints + tuesdayBonus + setBonus + quantityBonus;
};
