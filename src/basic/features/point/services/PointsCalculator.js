/**
 * Points Calculation Utilities
 * 리액트 친화적인 순수 함수들로 구성
 */

import { ELEMENT_IDS } from '../../../shared/constants/element-ids.js';
import {
  calculateBasePoints,
  isTuesday,
  getProductIdsFromCart,
} from '../utils/pointsUtils.js';

/**
 * 포인트 계산 및 렌더링 (메인 함수)
 * @param {number} totalAmount - Total cart amount
 * @param {number} totalItemCount - Total item count
 * @param {HTMLCollection} cartElements - DOM cart elements
 * @param {Array} productList - Product list
 * @param {object} constants - Business constants
 * @param {object} productIds - Product ID mappings
 * @returns {object} Points calculation result
 */
export const calculateAndRenderPoints = (
  totalAmount,
  totalItemCount,
  cartElements,
  productList,
  constants,
  productIds,
) => {
  const cartItems = Array.from(cartElements);

  // 빈 장바구니 체크
  if (cartItems.length === 0) {
    hidePointsDisplay();
    return { points: 0, details: [] };
  }

  // 1. 기본 포인트 계산
  const basePoints = calculateBasePoints(totalAmount);
  let finalPoints = basePoints;
  const pointsDetail = [];

  if (basePoints > 0) {
    pointsDetail.push(`기본: ${basePoints}p`);
  }

  // 2. 화요일 2배 적용
  const todayIsTuesday = isTuesday();
  if (todayIsTuesday && finalPoints > 0) {
    finalPoints = basePoints * 2;
    pointsDetail.push('화요일 2배');
  }

  // 3. 세트 보너스 계산
  const setBonusResult = calculateSetBonuses(
    cartItems,
    productList,
    constants,
    productIds,
  );
  finalPoints += setBonusResult.points;
  pointsDetail.push(...setBonusResult.details);

  // 4. 대량 구매 보너스 계산
  const bulkBonusResult = calculateBulkBonuses(totalItemCount, constants);
  finalPoints += bulkBonusResult.points;
  pointsDetail.push(...bulkBonusResult.details);

  // 5. DOM에 렌더링
  renderPointsToDOM(finalPoints, pointsDetail);

  return {
    points: finalPoints,
    details: pointsDetail,
  };
};

/**
 * 세트 보너스 계산
 */
const calculateSetBonuses = (cartItems, productList, constants, productIds) => {
  const productIdsInCart = getProductIdsFromCart(cartItems, productList);
  let bonusPoints = 0;
  const bonusDetails = [];

  const hasKeyboard = productIdsInCart.includes(productIds.KEYBOARD);
  const hasMouse = productIdsInCart.includes(productIds.MOUSE);
  const hasMonitorArm = productIdsInCart.includes(productIds.MONITOR_ARM);

  // 키보드 + 마우스 세트 보너스
  if (hasKeyboard && hasMouse) {
    bonusPoints += constants.POINTS.KEYBOARD_MOUSE_BONUS;
    bonusDetails.push(
      `키보드+마우스 세트 +${constants.POINTS.KEYBOARD_MOUSE_BONUS}p`,
    );
  }

  // 풀세트 보너스 (키보드 + 마우스 + 모니터암)
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    bonusPoints += constants.POINTS.FULL_SET_BONUS;
    bonusDetails.push(`풀세트 구매 +${constants.POINTS.FULL_SET_BONUS}p`);
  }

  return { points: bonusPoints, details: bonusDetails };
};

/**
 * 대량 구매 보너스 계산
 */
const calculateBulkBonuses = (totalItemCount, constants) => {
  const { TIER_1, TIER_2, TIER_3 } = constants.POINTS.BULK_PURCHASE_BONUSES;

  if (totalItemCount >= TIER_3.threshold) {
    return {
      points: TIER_3.bonus,
      details: [`대량구매(${TIER_3.threshold}개+) +${TIER_3.bonus}p`],
    };
  } else if (totalItemCount >= TIER_2.threshold) {
    return {
      points: TIER_2.bonus,
      details: [`대량구매(${TIER_2.threshold}개+) +${TIER_2.bonus}p`],
    };
  } else if (totalItemCount >= TIER_1.threshold) {
    return {
      points: TIER_1.bonus,
      details: [`대량구매(${TIER_1.threshold}개+) +${TIER_1.bonus}p`],
    };
  }

  return { points: 0, details: [] };
};

/**
 * 포인트를 DOM에 렌더링
 */
const renderPointsToDOM = (finalPoints, pointsDetail) => {
  const ptsTag = document.getElementById(ELEMENT_IDS.LOYALTY_POINTS);

  if (!ptsTag) return;

  if (finalPoints > 0) {
    ptsTag.innerHTML = `
      <div>적립 포인트: <span class="font-bold">${finalPoints}p</span></div>
      <div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>
    `;
    ptsTag.style.display = 'block';
  } else {
    ptsTag.textContent = '적립 포인트: 0p';
    ptsTag.style.display = 'block';
  }
};

/**
 * 포인트 디스플레이 숨기기
 */
const hidePointsDisplay = () => {
  const ptsTag = document.getElementById(ELEMENT_IDS.LOYALTY_POINTS);
  if (ptsTag) {
    ptsTag.style.display = 'none';
  }
};
