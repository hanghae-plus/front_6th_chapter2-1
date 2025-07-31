// src/services/PointsCalculationService.js
import {
  BASE_POINTS_RATE,
  TUESDAY_POINTS_MULTIPLIER,
  BONUS_POINTS,
  BONUS_POINTS_THRESHOLDS,
  KEYBOARD,
  MOUSE,
  MONITOR_ARM,
} from '../constants.js';
import { isTuesday } from '../utils/date.js';
import { findProductById } from '../utils/product.js';

/**
 * 보너스 포인트를 계산합니다.
 * @param {Object} params - 계산에 필요한 파라미터들
 * @param {Array} params.productList - 상품 목록
 * @param {HTMLElement} params.cartDisp - 장바구니 표시 요소
 * @param {Object} params.cartState - 장바구니 상태
 * @returns {Object} 포인트 계산 결과
 */
export function calculateBonusPoints(params) {
  const { productList, cartDisp, cartState } = params;

  if (cartDisp.children.length === 0) {
    hideLoyaltyPoints();
    return { bonusPoints: 0, pointsDetail: [] };
  }

  const basePoints = Math.floor(cartState.total / BASE_POINTS_RATE);
  const pointsDetail = [];
  let finalPoints = 0;

  // 기본 포인트 계산
  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push(`기본: ${basePoints}p`);
  }

  // 화요일 보너스
  if (isTuesday() && basePoints > 0) {
    finalPoints = basePoints * TUESDAY_POINTS_MULTIPLIER;
    pointsDetail.push('화요일 2배');
  }

  // 세트 보너스 계산
  const setBonus = calculateSetBonus(productList, cartDisp);
  finalPoints += setBonus.points;
  pointsDetail.push(...setBonus.details);

  // 대량구매 보너스 계산
  const bulkBonus = calculateBulkPurchaseBonus(cartState.itemCount);
  finalPoints += bulkBonus.points;
  pointsDetail.push(...bulkBonus.details);

  return {
    bonusPoints: finalPoints,
    pointsDetail,
  };
}

/**
 * 세트 보너스를 계산합니다.
 * @param {Array} productList - 상품 목록
 * @param {HTMLElement} cartDisp - 장바구니 표시 요소
 * @returns {Object} 세트 보너스 결과
 */
function calculateSetBonus(productList, cartDisp) {
  let points = 0;
  const details = [];

  const { hasKeyboard, hasMouse, hasMonitorArm } = getProductFlags(productList, cartDisp);

  // 키보드+마우스 세트 보너스
  if (hasKeyboard && hasMouse) {
    points += BONUS_POINTS.KEYBOARD_MOUSE_SET;
    details.push(`키보드+마우스 세트 +${BONUS_POINTS.KEYBOARD_MOUSE_SET}p`);
  }

  // 풀세트 보너스
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    points += BONUS_POINTS.FULL_SET;
    details.push(`풀세트 구매 +${BONUS_POINTS.FULL_SET}p`);
  }

  return { points, details };
}

/**
 * 대량구매 보너스를 계산합니다.
 * @param {number} itemCount - 아이템 수
 * @returns {Object} 대량구매 보너스 결과
 */
function calculateBulkPurchaseBonus(itemCount) {
  let points = 0;
  const details = [];

  if (itemCount >= BONUS_POINTS_THRESHOLDS.LARGE) {
    points += BONUS_POINTS.BULK_PURCHASE.LARGE;
    details.push(
      `대량구매(${BONUS_POINTS_THRESHOLDS.LARGE}개+) +${BONUS_POINTS.BULK_PURCHASE.LARGE}p`
    );
  } else if (itemCount >= BONUS_POINTS_THRESHOLDS.MEDIUM) {
    points += BONUS_POINTS.BULK_PURCHASE.MEDIUM;
    details.push(
      `대량구매(${BONUS_POINTS_THRESHOLDS.MEDIUM}개+) +${BONUS_POINTS.BULK_PURCHASE.MEDIUM}p`
    );
  } else if (itemCount >= BONUS_POINTS_THRESHOLDS.SMALL) {
    points += BONUS_POINTS.BULK_PURCHASE.SMALL;
    details.push(
      `대량구매(${BONUS_POINTS_THRESHOLDS.SMALL}개+) +${BONUS_POINTS.BULK_PURCHASE.SMALL}p`
    );
  }

  return { points, details };
}

/**
 * 상품 플래그를 가져옵니다.
 * @param {Array} productList - 상품 목록
 * @param {HTMLElement} cartDisp - 장바구니 표시 요소
 * @returns {Object} 상품 플래그들
 */
function getProductFlags(productList, cartDisp) {
  let hasKeyboard = false;
  let hasMouse = false;
  let hasMonitorArm = false;

  const nodes = cartDisp.children;

  for (const node of nodes) {
    const product = findProductById(productList, node.id);
    if (!product) continue;

    if (product.id === KEYBOARD) {
      hasKeyboard = true;
    } else if (product.id === MOUSE) {
      hasMouse = true;
    } else if (product.id === MONITOR_ARM) {
      hasMonitorArm = true;
    }
  }

  return { hasKeyboard, hasMouse, hasMonitorArm };
}

/**
 * 로열티 포인트 표시를 업데이트합니다.
 * @param {number} bonusPoints - 보너스 포인트
 * @param {Array} pointsDetail - 포인트 상세 내역
 */
export function updateLoyaltyPointsDisplay(bonusPoints, pointsDetail) {
  const loyaltyPoints = document.getElementById('loyalty-points');
  if (loyaltyPoints) {
    loyaltyPoints.innerHTML = createLoyaltyPointsTag(bonusPoints, pointsDetail);
    loyaltyPoints.style.display = 'block';
  }
}

/**
 * 로열티 포인트를 숨깁니다.
 */
export function hideLoyaltyPoints() {
  const loyaltyPoints = document.getElementById('loyalty-points');
  if (loyaltyPoints) {
    loyaltyPoints.style.display = 'none';
  }
}

/**
 * 로열티 포인트 태그를 생성합니다.
 * @param {number} bonusPoints - 보너스 포인트
 * @param {Array} pointsDetail - 포인트 상세 내역
 * @returns {string} 로열티 포인트 태그 HTML
 */
function createLoyaltyPointsTag(bonusPoints, pointsDetail) {
  if (bonusPoints === 0) {
    return '적립 포인트: 0p';
  }

  return `
    <div>적립 포인트: <span class="font-bold">${bonusPoints}p</span></div>
    ${
      pointsDetail.length > 0
        ? `<div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>`
        : ''
    }
  `;
}

/**
 * 포인트 계산 서비스를 생성합니다.
 * @param {Array} productList - 상품 목록
 * @param {HTMLElement} cartDisp - 장바구니 표시 요소
 * @param {Object} cartState - 장바구니 상태
 * @returns {Object} 포인트 계산 서비스 객체
 */
export function createPointsCalculationService(productList, cartDisp, cartState) {
  return {
    calculateBonusPoints: () => calculateBonusPoints({ productList, cartDisp, cartState }),
    updateLoyaltyPointsDisplay,
    hideLoyaltyPoints,
  };
}
