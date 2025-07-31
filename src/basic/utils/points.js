// ================================================
// 포인트 계산 유틸리티
// ================================================

import {
  BASE_POINTS_RATE,
  TUESDAY_POINTS_MULTIPLIER,
  BONUS_POINTS,
  BONUS_POINTS_THRESHOLDS,
  KEYBOARD,
  MOUSE,
  MONITOR_ARM,
} from '../constants.js';

/**
 * 기본 포인트 계산
 * @param {number} totalAmount - 총 결제 금액
 * @returns {number} 기본 포인트
 */
export function calculateBasePoints(totalAmount) {
  return Math.floor(totalAmount / BASE_POINTS_RATE);
}

/**
 * 화요일 보너스 포인트 계산
 * @param {number} basePoints - 기본 포인트
 * @param {boolean} isTuesday - 화요일 여부
 * @returns {Object} 화요일 보너스 정보
 */
export function calculateTuesdayBonus(basePoints, isTuesday) {
  if (!isTuesday || basePoints <= 0) {
    return { bonus: 0, multiplier: 1 };
  }

  const bonus = basePoints * (TUESDAY_POINTS_MULTIPLIER - 1);
  return { bonus, multiplier: TUESDAY_POINTS_MULTIPLIER };
}

/**
 * 세트 보너스 포인트 계산
 * @param {Array} cartItems - 장바구니 아이템들
 * @returns {Object} 세트 보너스 정보
 */
export function calculateSetBonus(cartItems) {
  const productIds = cartItems.map((item) => item.product.id);

  const hasKeyboard = productIds.includes(KEYBOARD);
  const hasMouse = productIds.includes(MOUSE);
  const hasMonitorArm = productIds.includes(MONITOR_ARM);

  let setBonus = 0;
  const setDetails = [];

  // 키보드+마우스 세트
  if (hasKeyboard && hasMouse) {
    setBonus += BONUS_POINTS.KEYBOARD_MOUSE_SET;
    setDetails.push(`키보드+마우스 세트 +${BONUS_POINTS.KEYBOARD_MOUSE_SET}p`);
  }

  // 풀세트 (키보드+마우스+모니터암)
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    setBonus += BONUS_POINTS.FULL_SET;
    setDetails.push(`풀세트 구매 +${BONUS_POINTS.FULL_SET}p`);
  }

  return { bonus: setBonus, details: setDetails };
}

/**
 * 수량별 보너스 포인트 계산
 * @param {number} totalQuantity - 총 수량
 * @returns {Object} 수량별 보너스 정보
 */
export function calculateQuantityBonus(totalQuantity) {
  let quantityBonus = 0;
  const quantityDetails = [];

  if (totalQuantity >= BONUS_POINTS_THRESHOLDS.LARGE) {
    quantityBonus = BONUS_POINTS.BULK_PURCHASE.LARGE;
    quantityDetails.push(
      `대량구매(${BONUS_POINTS_THRESHOLDS.LARGE}개+) +${BONUS_POINTS.BULK_PURCHASE.LARGE}p`
    );
  } else if (totalQuantity >= BONUS_POINTS_THRESHOLDS.MEDIUM) {
    quantityBonus = BONUS_POINTS.BULK_PURCHASE.MEDIUM;
    quantityDetails.push(
      `대량구매(${BONUS_POINTS_THRESHOLDS.MEDIUM}개+) +${BONUS_POINTS.BULK_PURCHASE.MEDIUM}p`
    );
  } else if (totalQuantity >= BONUS_POINTS_THRESHOLDS.SMALL) {
    quantityBonus = BONUS_POINTS.BULK_PURCHASE.SMALL;
    quantityDetails.push(
      `대량구매(${BONUS_POINTS_THRESHOLDS.SMALL}개+) +${BONUS_POINTS.BULK_PURCHASE.SMALL}p`
    );
  }

  return { bonus: quantityBonus, details: quantityDetails };
}

/**
 * 전체 포인트 계산
 * @param {number} totalAmount - 총 결제 금액
 * @param {Array} cartItems - 장바구니 아이템들
 * @param {boolean} isTuesday - 화요일 여부
 * @returns {Object} 전체 포인트 정보
 */
export function calculateTotalPoints(totalAmount, cartItems, isTuesday) {
  const basePoints = calculateBasePoints(totalAmount);
  const tuesdayBonus = calculateTuesdayBonus(basePoints, isTuesday);
  const setBonus = calculateSetBonus(cartItems);
  const quantityBonus = calculateQuantityBonus(cartItems.length);

  let finalPoints = basePoints;
  const pointsDetail = [];

  // 기본 포인트
  if (basePoints > 0) {
    pointsDetail.push(`기본: ${basePoints}p`);
  }

  // 화요일 보너스
  if (tuesdayBonus.bonus > 0) {
    finalPoints += tuesdayBonus.bonus;
    pointsDetail.push('화요일 2배');
  }

  // 세트 보너스
  if (setBonus.bonus > 0) {
    finalPoints += setBonus.bonus;
    pointsDetail.push(...setBonus.details);
  }

  // 수량별 보너스
  if (quantityBonus.bonus > 0) {
    finalPoints += quantityBonus.bonus;
    pointsDetail.push(...quantityBonus.details);
  }

  return {
    basePoints,
    tuesdayBonus: tuesdayBonus.bonus,
    setBonus: setBonus.bonus,
    quantityBonus: quantityBonus.bonus,
    finalPoints,
    pointsDetail,
  };
}
