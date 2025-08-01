import {
  PRODUCT_KEYBOARD,
  PRODUCT_MOUSE,
  PRODUCT_MONITOR_ARM,
  POINT_RATES_BULK_BONUS,
} from '../constants/constants';
import { CartItem } from '../types';

export const calculateBonusPoints = (
  cartItems: CartItem[],
  finalTotal: number,
  itemCount: number,
): { points: number; details: string[] } => {
  if (cartItems.length === 0) {
    return { points: 0, details: [] };
  }

  const basePoints = Math.floor(finalTotal / 1000);
  let finalPoints = 0;
  const pointsDetail: string[] = [];

  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push(`기본: ${basePoints}p`);
  }

  // 화요일 2배
  const isTuesday = new Date().getDay() === 2;
  if (isTuesday && basePoints > 0) {
    finalPoints = basePoints * 2;
    pointsDetail.push('화요일 2배');
  }

  // 세트 보너스 확인
  const hasKeyboard = cartItems.some((item) => item.id === PRODUCT_KEYBOARD);
  const hasMouse = cartItems.some((item) => item.id === PRODUCT_MOUSE);
  const hasMonitorArm = cartItems.some(
    (item) => item.id === PRODUCT_MONITOR_ARM,
  );

  if (hasKeyboard && hasMouse) {
    finalPoints += 50;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints += 100;
    pointsDetail.push('풀세트 구매 +100p');
  }

  // 대량구매 보너스
  if (itemCount >= 30) {
    finalPoints += POINT_RATES_BULK_BONUS.LARGE;
    pointsDetail.push('대량구매(30개+) +100p');
  } else if (itemCount >= 20) {
    finalPoints += POINT_RATES_BULK_BONUS.MEDIUM;
    pointsDetail.push('대량구매(20개+) +50p');
  } else if (itemCount >= 10) {
    finalPoints += POINT_RATES_BULK_BONUS.SMALL;
    pointsDetail.push('대량구매(10개+) +20p');
  }

  return { points: finalPoints, details: pointsDetail };
};
