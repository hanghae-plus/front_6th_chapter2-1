/**
 * Points Calculation Utilities
 * 리액트 친화적인 순수 함수들로 구성
 */

import {
  calculateBasePoints,
  isTuesday,
  getProductIdsFromCart,
} from '@/basic/features/point/utils/pointsUtils.js';
import { ELEMENT_IDS } from '@/basic/shared/constants/elementIds.js';
import {
  setStyle,
  setTextContent,
  setInnerHTML,
} from '@/basic/shared/core/domUtils.js';

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

  const basePoints = calculateBasePoints(totalAmount);
  const baseDetails = basePoints > 0 ? [`기본: ${basePoints}p`] : [];

  const todayIsTuesday = isTuesday();
  const tuesdayPoints =
    todayIsTuesday && basePoints > 0 ? basePoints * 2 : basePoints;
  const tuesdayDetails = todayIsTuesday && basePoints > 0 ? ['화요일 2배'] : [];

  const setBonusResult = calculateSetBonuses(
    cartItems,
    productList,
    constants,
    productIds,
  );

  const bulkBonusResult = calculateBulkBonuses(totalItemCount, constants);

  const finalPoints =
    tuesdayPoints + setBonusResult.points + bulkBonusResult.points;
  const pointsDetail = [
    ...baseDetails,
    ...tuesdayDetails,
    ...setBonusResult.details,
    ...bulkBonusResult.details,
  ];

  renderPointsToDOM(finalPoints, pointsDetail);

  return {
    points: finalPoints,
    details: pointsDetail,
  };
};

/**
 * 세트 보너스 계산 (불변성)
 */
const calculateSetBonuses = (cartItems, productList, constants, productIds) => {
  const productIdsInCart = getProductIdsFromCart(cartItems, productList);
  const bonusDetails = [];

  const hasKeyboard = productIdsInCart.includes(productIds.KEYBOARD);
  const hasMouse = productIdsInCart.includes(productIds.MOUSE);
  const hasMonitorArm = productIdsInCart.includes(productIds.MONITOR_ARM);

  const keyboardMouseBonus =
    hasKeyboard && hasMouse ? constants.POINTS.KEYBOARD_MOUSE_BONUS : 0;

  if (keyboardMouseBonus > 0) {
    bonusDetails.push(`키보드+마우스 세트 +${keyboardMouseBonus}p`);
  }

  const fullSetBonus =
    hasKeyboard && hasMouse && hasMonitorArm
      ? constants.POINTS.FULL_SET_BONUS
      : 0;

  if (fullSetBonus > 0) {
    bonusDetails.push(`풀세트 구매 +${fullSetBonus}p`);
  }

  const totalBonusPoints = keyboardMouseBonus + fullSetBonus;

  return { points: totalBonusPoints, details: bonusDetails };
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
 * 포인트를 DOM에 렌더링 (선언적)
 */
const renderPointsToDOM = (finalPoints, pointsDetail) => {
  const ptsTag = document.getElementById(ELEMENT_IDS.LOYALTY_POINTS);

  if (!ptsTag) return;

  if (finalPoints > 0) {
    setInnerHTML(
      ptsTag,
      /* html */ `
        <div>적립 포인트: <span class="font-bold">${finalPoints}p</span></div>
        <div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>
    `,
    );
    setStyle(ptsTag, 'display', 'block');
  } else {
    setTextContent(ptsTag, '적립 포인트: 0p');
    setStyle(ptsTag, 'display', 'block');
  }
};

/**
 * 포인트 디스플레이 숨기기 (선언적)
 */
const hidePointsDisplay = () => {
  const ptsTag = document.getElementById(ELEMENT_IDS.LOYALTY_POINTS);
  if (ptsTag) {
    setStyle(ptsTag, 'display', 'none');
  }
};
