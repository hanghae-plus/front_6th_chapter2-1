import {
  POINT_BONUS_FULL_SET,
  POINT_BONUS_KEYBOARD_MOUSE_SET,
  POINT_BONUS_QUANTITY_TIER1,
  POINT_BONUS_QUANTITY_TIER2,
  POINT_BONUS_QUANTITY_TIER3,
  POINT_RATE_BASE,
} from "../data/point.data.js";
import { PRODUCT_1, PRODUCT_2, PRODUCT_3 } from "../data/product.data.js";
import {
  MIN_QUANTITY_FOR_POINT_BONUS_TIER1,
  MIN_QUANTITY_FOR_POINT_BONUS_TIER2,
  MIN_QUANTITY_FOR_POINT_BONUS_TIER3,
} from "../data/quantity.data.js";
/**
 *
 * 기본 포인트를 계산하는 함수
 * @param {number} totalAmount - 총액
 * @returns {number} 기본 포인트
 */
export function calculateBasePoints(totalAmount) {
  return Math.floor(totalAmount / POINT_RATE_BASE);
}

/**
 * 기본 포인트를 계산하는 함수
 * @param {number} totalAmount - 총액
 * @returns {number} 기본 포인트
 */
export function calculateBasePoints(totalAmount) {
  return Math.floor(totalAmount / POINT_RATE_BASE);
}

/**
 * 보너스 포인트를 계산하는 함수
 * @param {Array} cartItems - 장바구니 아이템 목록
 * @param {Array} productList - 상품 목록
 * @param {number} itemCounts - 총 아이템 수
 * @returns {Object} 보너스 포인트 정보
 */
export function calculateBonusPoints(cartItems, productList, itemCounts) {
  const bonusDetails = [];
  let bonusPoints = 0;

  // 상품 조합 보너스 확인
  const hasKeyboard = cartItems.some(
    item => findProductById(item.id, productList)?.id === PRODUCT_1
  );
  const hasMouse = cartItems.some(item => findProductById(item.id, productList)?.id === PRODUCT_2);
  const hasMonitorArm = cartItems.some(
    item => findProductById(item.id, productList)?.id === PRODUCT_3
  );

  // 키보드+마우스 세트 보너스
  if (hasKeyboard && hasMouse) {
    bonusPoints += POINT_BONUS_KEYBOARD_MOUSE_SET;
    bonusDetails.push(`키보드+마우스 세트 +${POINT_BONUS_KEYBOARD_MOUSE_SET}p`);
  }

  // 풀세트 보너스
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    bonusPoints += POINT_BONUS_FULL_SET;
    bonusDetails.push(`풀세트 구매 +${POINT_BONUS_FULL_SET}p`);
  }

  // 수량별 보너스
  if (itemCounts >= MIN_QUANTITY_FOR_POINT_BONUS_TIER3) {
    bonusPoints += POINT_BONUS_QUANTITY_TIER3;
    bonusDetails.push(
      `대량구매(${MIN_QUANTITY_FOR_POINT_BONUS_TIER3}개+) +${POINT_BONUS_QUANTITY_TIER3}p`
    );
  } else if (itemCounts >= MIN_QUANTITY_FOR_POINT_BONUS_TIER2) {
    bonusPoints += POINT_BONUS_QUANTITY_TIER2;
    bonusDetails.push(
      `대량구매(${MIN_QUANTITY_FOR_POINT_BONUS_TIER2}개+) +${POINT_BONUS_QUANTITY_TIER2}p`
    );
  } else if (itemCounts >= MIN_QUANTITY_FOR_POINT_BONUS_TIER1) {
    bonusPoints += POINT_BONUS_QUANTITY_TIER1;
    bonusDetails.push(
      `대량구매(${MIN_QUANTITY_FOR_POINT_BONUS_TIER1}개+) +${POINT_BONUS_QUANTITY_TIER1}p`
    );
  }

  return { bonusPoints, bonusDetails };
}

/**
 * 총 포인트를 계산하는 함수
 * @param {number} totalAmount - 총액
 * @param {Array} cartItems - 장바구니 아이템 목록
 * @param {Array} productList - 상품 목록
 * @param {number} itemCounts - 총 아이템 수
 * @returns {Object} 총 포인트 정보
 */
export function calculateTotalPoints(totalAmount, cartItems, productList, itemCounts) {
  const basePoints = calculateBasePoints(totalAmount);
  const tuesdayPoints = applyTuesdayPointMultiplier(basePoints);
  const bonusPoints = calculateBonusPoints(cartItems, productList, itemCounts);

  const finalPoints = tuesdayPoints.points + bonusPoints.bonusPoints;
  const allDetails = [];

  if (basePoints > 0) {
    allDetails.push(`기본: ${basePoints}p`);
  }

  if (tuesdayPoints.multiplier > 1) {
    allDetails.push("화요일 2배");
  }

  allDetails.push(...bonusPoints.bonusDetails);

  return {
    totalPoints: finalPoints,
    details: allDetails,
  };
}
