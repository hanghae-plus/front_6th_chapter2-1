import { productIds } from "../store/product";

/**
 * 보너스 포인트 계산 관련 비즈니스 로직을 담당하는 함수들
 */

/**
 * 보너스 포인트 계산
 * @param {Object} cartState - 장바구니 상태
 * @returns {Object} 포인트 계산 결과
 */
export const calculateBonusPoints = (cartState) => {
  const { items, totals } = cartState;
  const { totalAmount, totalQty } = totals;

  if (items.length === 0) {
    return { finalPoints: 0, pointsDetail: [] };
  }

  const basePoints = Math.floor(totalAmount / 1000);
  let finalPoints = 0;
  const pointsDetail = [];

  // 기본 포인트
  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push("기본: " + basePoints + "p");
  }

  // 화요일 2배 포인트
  if (totals.isTuesday && basePoints > 0) {
    finalPoints = basePoints * 2;
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
    if (item.id === productIds.p1) hasKeyboard = true;
    else if (item.id === productIds.p2) hasMouse = true;
    else if (item.id === productIds.p3) hasMonitorArm = true;
  });

  if (hasKeyboard && hasMouse) {
    points += 50;
    details.push("키보드+마우스 세트 +50p");
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    points += 100;
    details.push("풀세트 구매 +100p");
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

  if (totalQty >= 30) {
    points = 100;
    details.push("대량구매(30개+) +100p");
  } else if (totalQty >= 20) {
    points = 50;
    details.push("대량구매(20개+) +50p");
  } else if (totalQty >= 10) {
    points = 20;
    details.push("대량구매(10개+) +20p");
  }

  return { points, details };
};
