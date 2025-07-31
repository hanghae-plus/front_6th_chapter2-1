import { PRODUCT_IDS } from "../constants/product.constant";
import type { CartItem } from "../types";

export const POINT_RULES = {
  BASE_UNIT_AMOUNT: 1000,
  TUESDAY_MULTIPLIER: 2,
} as const;

export const BONUS_SETS = {
  KEYBOARD_MOUSE: {
    points: 50,
    label: "키보드+마우스 세트 +50p",
  },
  FULL_SET: {
    points: 100,
    label: "풀세트 구매 +100p",
  },
} as const;

export const BULK_PURCHASE_BONUS_RULES = [
  { threshold: 30, points: 100 },
  { threshold: 20, points: 50 },
  { threshold: 10, points: 20 },
] as const;

export interface PointsCalculation {
  finalPoints: number;
  pointsDetail: string[];
}

/**
 * 보너스 포인트 계산
 */
export const calculateBonusPoints = (
  items: CartItem[],
  totalAmount: number,
  totalQty: number,
  isTuesday: boolean
): PointsCalculation => {
  // 장바구니 아이템 존재 체크
  if (items.length === 0) {
    return { finalPoints: 0, pointsDetail: [] };
  }

  // 기본 포인트 계산
  const basePoints = Math.floor(totalAmount / POINT_RULES.BASE_UNIT_AMOUNT);
  let finalPoints = 0;
  const pointsDetail: string[] = [];

  // 기본 포인트 체크
  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push("기본: " + basePoints + "p");
  }

  // 화요일 2배 포인트
  if (isTuesday && basePoints > 0) {
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
 */
export const calculateProductCombinationBonus = (items: CartItem[]) => {
  let points = 0;
  const details: string[] = [];

  let hasKeyboard = false;
  let hasMouse = false;
  let hasMonitorArm = false;

  // 상품 조합 보너스 포인트 계산
  items.forEach((item) => {
    switch (item.id) {
      case PRODUCT_IDS.p1:
        hasKeyboard = true;
        break;
      case PRODUCT_IDS.p2:
        hasMouse = true;
        break;
      case PRODUCT_IDS.p3:
        hasMonitorArm = true;
        break;
    }
  });

  // 키보드+마우스 세트 보너스 포인트 체크
  if (hasKeyboard && hasMouse) {
    points += BONUS_SETS.KEYBOARD_MOUSE.points;
    details.push(BONUS_SETS.KEYBOARD_MOUSE.label);
  }

  // 풀세트 보너스 포인트 체크
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    points += BONUS_SETS.FULL_SET.points;
    details.push(BONUS_SETS.FULL_SET.label);
  }

  return { points, details };
};

/**
 * 대량구매 보너스 포인트 계산
 */
export const calculateBulkPurchaseBonus = (totalQty: number) => {
  let points = 0;
  const details: string[] = [];

  // 대량구매 보너스 포인트 계산
  for (const rule of BULK_PURCHASE_BONUS_RULES) {
    if (totalQty >= rule.threshold) {
      points = rule.points;
      details.push(`대량구매(${rule.threshold}개+) +${rule.points}p`);
      break; // 가장 높은 조건만 적용
    }
  }
  return { points, details };
};
