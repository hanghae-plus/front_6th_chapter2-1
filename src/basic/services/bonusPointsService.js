import {
  BONUS_SETS,
  BULK_PURCHASE_BONUS_RULES,
  POINT_RULES,
} from "../constants/points.constant";
import { PRODUCT_IDS } from "../constants/product.constant";

/**
 * 보너스 포인트 계산
 */
export const calculateBonusPoints = (cartState) => {
  const { items, totals } = cartState;
  const { totalAmount, totalQty } = totals;

  if (items.length === 0) {
    return { finalPoints: 0, pointsDetail: [] };
  }

  const basePoints = Math.floor(totalAmount / POINT_RULES.BASE_UNIT_AMOUNT);
  let finalPoints = 0;
  const pointsDetail = [];

  // 기본 포인트
  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push("기본: " + basePoints + "p");
  }

  // 화요일 2배 포인트
  if (totals.isTuesday && basePoints > 0) {
    finalPoints = basePoints * POINT_RULES.TUESDAY_MULTIPLIER;
    pointsDetail.push("화요일 2배");
  }

  // 상품 조합 보너스 포인트
  const productCombinationBonus = calculateProductCombinationBonus(items);
  finalPoints += productCombinationBonus.points;
  pointsDetail.push(...productCombinationBonus.details);

  // 대량구매 보너스 포인트
  const bulkPurchaseBonus = calculateBulkPurchaseBonus(totalQty);
  finalPoints += bulkPurchaseBonus.points;
  pointsDetail.push(...bulkPurchaseBonus.details);

  return { finalPoints, pointsDetail };
};

/**
 * 상품 조합 보너스 포인트 계산
 * @param {Array} items - 장바구니 아이템들
 * @returns {Object} 조합 보너스 정보
 */
export const calculateProductCombinationBonus = (items) => {
  let points = 0;
  const details = [];

  let hasKeyboard = false;
  let hasMouse = false;
  let hasMonitorArm = false;

  items.forEach((item) => {
    if (item.id === PRODUCT_IDS.p1) hasKeyboard = true;
    else if (item.id === PRODUCT_IDS.p2) hasMouse = true;
    else if (item.id === PRODUCT_IDS.p3) hasMonitorArm = true;
  });

  if (hasKeyboard && hasMouse) {
    points += BONUS_SETS.KEYBOARD_MOUSE.points;
    details.push(BONUS_SETS.KEYBOARD_MOUSE.label);
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    points += BONUS_SETS.FULL_SET.points;
    details.push(BONUS_SETS.FULL_SET.label);
  }

  return { points, details };
};

/**
 * 대량구매 보너스 포인트 계산
 * @param {number} totalQty - 총 수량
 * @returns {Object} 대량구매 보너스 정보
 */
export const calculateBulkPurchaseBonus = (totalQty) => {
  let points = 0;
  const details = [];

  for (const rule of BULK_PURCHASE_BONUS_RULES) {
    if (totalQty >= rule.threshold) {
      points = rule.points;
      details.push(`대량구매(${rule.threshold}개+) +${rule.points}p`);
      break; // 가장 높은 조건만 적용
    }
  }
  return { points, details };
};
