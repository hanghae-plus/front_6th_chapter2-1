// services/points.ts
import { PRODUCT_IDS, POINTS } from '../constants/index.js';
import {
  getTotalAmount,
  getTotalQuantity,
  getCartItems,
  setBonusPoints,
} from '../store/state.js';

export function calculatePoints(): void {
  const cartItems = getCartItems();

  if (Object.keys(cartItems).length === 0) {
    setBonusPoints(0);
    return;
  }

  const totalAmount = getTotalAmount();
  const totalQuantity = getTotalQuantity();

  // 기본 포인트는 총액을 1000으로 나눈 후 소수점 버림
  let basePoints = Math.floor(totalAmount / 1000);
  let finalPoints = basePoints;

  // 화요일 2배 적용
  const isTuesday = new Date().getDay() === 2;
  if (isTuesday && basePoints > 0) {
    finalPoints = basePoints * 2;
  }

  // 세트 보너스
  const hasKeyboard = cartItems[PRODUCT_IDS.KEYBOARD];
  const hasMouse = cartItems[PRODUCT_IDS.MOUSE];
  const hasMonitorArm = cartItems[PRODUCT_IDS.MONITOR_ARM];

  if (hasKeyboard && hasMouse) {
    finalPoints += POINTS.BONUS.SET;
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints += POINTS.BONUS.FULL_SET;
  }

  // 수량 보너스
  if (totalQuantity >= 30) {
    finalPoints += POINTS.BONUS.BULK_30;
  } else if (totalQuantity >= 20) {
    finalPoints += POINTS.BONUS.BULK_20;
  } else if (totalQuantity >= 10) {
    finalPoints += POINTS.BONUS.BULK_10;
  }

  setBonusPoints(finalPoints);
}