// src/services/pointsService.js

import { LOYALTY_POINTS, PRODUCT_ONE, PRODUCT_THREE, PRODUCT_TWO } from '../constants';
import { isTuesday } from '../utils/dateUtils';

export const calculateLoyaltyPoints = (cartData, totalAmount, totalItemCount) => {
  if (totalAmount <= 0) return { points: 0, details: [] };

  const basePoints = Math.floor(totalAmount * LOYALTY_POINTS.BASE_RATE);
  let finalPoints = basePoints;
  const pointsDetails = [`기본: ${basePoints}p`]; // 포인트 적립 내역

  // 화요일 2배 적립
  if (isTuesday() && basePoints > 0) {
    finalPoints = Math.round(basePoints * LOYALTY_POINTS.TUESDAY_MULTIPLIER); // 반올림 적용
    pointsDetails.push('화요일 2배');
  }

  let hasKeyboard = false;
  let hasMouse = false;
  let hasMonitorArm = false;

  // 장바구니에 특정 상품 포함 여부 확인
  cartData.forEach((item) => {
    if (item.id === PRODUCT_ONE) hasKeyboard = true;
    if (item.id === PRODUCT_TWO) hasMouse = true;
    if (item.id === PRODUCT_THREE) hasMonitorArm = true;
  });

  // 키보드 + 마우스 세트 보너스
  if (hasKeyboard && hasMouse) {
    finalPoints += LOYALTY_POINTS.KEYBOARD_MOUSE_BONUS;
    pointsDetails.push('키보드+마우스 세트 +50p');
  }

  // 풀세트 구매 보너스
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints += LOYALTY_POINTS.FULL_SET_BONUS;
    pointsDetails.push('풀세트 구매 +100p');
  }

  // 대량 구매 보너스
  if (totalItemCount >= 30) {
    finalPoints += LOYALTY_POINTS.BULK_BONUS_30;
    pointsDetails.push('대량구매(30개+) +100p');
  } else if (totalItemCount >= 20) {
    finalPoints += LOYALTY_POINTS.BULK_BONUS_20;
    pointsDetails.push('대량구매(20개+) +50p');
  } else if (totalItemCount >= 10) {
    finalPoints += LOYALTY_POINTS.BULK_BONUS_10;
    pointsDetails.push('대량구매(10개+) +20p');
  }

  return { points: finalPoints, details: pointsDetails };
};
