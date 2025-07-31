// services/points.ts
import { PRODUCT_IDS, POINTS } from '../constants/index.js';
import {
  getTotalAmount,
  getTotalQuantity,
  getCartItems,
  setBonusPoints,
  getElements,
} from '../store/state.js';

export function calculatePoints(): void {
  const cartItems = getCartItems();
  const elements = getElements();

  if (Object.keys(cartItems).length === 0) {
    elements.loyaltyPoints.style.display = 'none';
    return;
  }

  const totalAmount = getTotalAmount();
  const totalQuantity = getTotalQuantity();

  // 기본 포인트는 총액을 1000으로 나눈 후 소수점 버림
  let basePoints = Math.floor(totalAmount / 1000);
  let finalPoints = basePoints;
  let pointsDetail: string[] = [];

  if (basePoints > 0) {
    pointsDetail.push(`기본: ${basePoints}p`);
  }

  // 화요일 2배 적용
  const isTuesday = new Date().getDay() === 2;
  if (isTuesday && basePoints > 0) {
    finalPoints = basePoints * 2;
    pointsDetail.push('화요일 2배');
  }

  // 세트 보너스
  const hasKeyboard = cartItems[PRODUCT_IDS.KEYBOARD];
  const hasMouse = cartItems[PRODUCT_IDS.MOUSE];
  const hasMonitorArm = cartItems[PRODUCT_IDS.MONITOR_ARM];

  if (hasKeyboard && hasMouse) {
    finalPoints += POINTS.BONUS.SET;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints += POINTS.BONUS.FULL_SET;
    pointsDetail.push('풀세트 구매 +100p');
  }

  // 수량 보너스
  if (totalQuantity >= 30) {
    finalPoints += POINTS.BONUS.BULK_30;
    pointsDetail.push('대량구매(30개+) +100p');
  } else if (totalQuantity >= 20) {
    finalPoints += POINTS.BONUS.BULK_20;
    pointsDetail.push('대량구매(20개+) +50p');
  } else if (totalQuantity >= 10) {
    finalPoints += POINTS.BONUS.BULK_10;
    pointsDetail.push('대량구매(10개+) +20p');
  }

  setBonusPoints(finalPoints);

  // UI 업데이트
  if (finalPoints > 0) {
    elements.loyaltyPoints.innerHTML =
      `<div>적립 포인트: <span class="font-bold">${finalPoints}p</span></div>` +
      `<div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>`;
    elements.loyaltyPoints.style.display = 'block';
  } else {
    elements.loyaltyPoints.textContent = '적립 포인트: 0p';
    elements.loyaltyPoints.style.display = 'block';
  }
}