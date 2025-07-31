/**
 * 포인트 관련 계산 유틸리티 함수 - 선언형 접근
 */

import {
  BONUS_POINTS,
  POINTS_MESSAGES,
  POINTS_RATES,
} from "../constants/pointsPolicies";
import { PointsCalculation, PointsPolicy } from "../types/promotion.types";

/**
 * 기본 포인트 계산
 * @param totalAmount - 총 구매 금액
 * @returns 기본 포인트
 */
export const calculateBasePoints = (totalAmount: number): number =>
  Math.floor(totalAmount * POINTS_RATES.BASE_RATE);

/**
 * 화요일 포인트 계산
 * @param basePoints - 기본 포인트
 * @param date - 구매 날짜
 * @returns 화요일 적용된 포인트
 */
export const calculateTuesdayPoints = (
  basePoints: number,
  date: Date = new Date(),
): number =>
  date.getDay() === 2
    ? basePoints * POINTS_RATES.TUESDAY_MULTIPLIER
    : basePoints;

/**
 * 세트 보너스를 결정합니다 - 선언형 접근
 */
const determineSetBonus = (cartItems: Array<{ id: string; q: number }>) => {
  const hasKeyboard = cartItems.some((item) => item.id === "p1" && item.q > 0);
  const hasMouse = cartItems.some((item) => item.id === "p2" && item.q > 0);
  const hasMonitorArm = cartItems.some(
    (item) => item.id === "p3" && item.q > 0,
  );

  // 풀세트 체크 (키보드 + 마우스 + 모니터암)
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    return {
      points: BONUS_POINTS.FULL_SET.points,
      description: BONUS_POINTS.FULL_SET.description,
      type: "FULL_SET",
    };
  }

  // 키보드+마우스 세트 체크
  if (hasKeyboard && hasMouse) {
    return {
      points: BONUS_POINTS.KEYBOARD_MOUSE_SET.points,
      description: BONUS_POINTS.KEYBOARD_MOUSE_SET.description,
      type: "KEYBOARD_MOUSE_SET",
    };
  }

  return { points: 0, description: "", type: "NONE" };
};

/**
 * 세트 구매 보너스 포인트 계산 - 선언형 접근
 * @param cartItems - 장바구니 아이템들
 * @returns 세트 보너스 정보
 */
export const calculateSetBonus = (
  cartItems: Array<{ id: string; q: number }>,
) => determineSetBonus(cartItems);

/**
 * 대량구매 보너스를 결정합니다 - 선언형 접근
 */
const determineBulkBonus = (totalQuantity: number) => {
  const bulkLevels = [
    BONUS_POINTS.BULK_PURCHASE.LEVEL_3, // 30개+
    BONUS_POINTS.BULK_PURCHASE.LEVEL_2, // 20개+
    BONUS_POINTS.BULK_PURCHASE.LEVEL_1, // 10개+
  ];

  const applicableLevel = bulkLevels.find(
    (level) => totalQuantity >= level.threshold,
  );

  return applicableLevel
    ? {
        points: applicableLevel.points,
        description: applicableLevel.description,
        threshold: applicableLevel.threshold,
      }
    : { points: 0, description: "", threshold: 0 };
};

/**
 * 대량구매 보너스 포인트 계산 - 선언형 접근
 * @param totalQuantity - 총 구매 수량
 * @returns 대량구매 보너스 정보
 */
export const calculateBulkBonus = (totalQuantity: number) =>
  determineBulkBonus(totalQuantity);

/**
 * 포인트 세부사항을 생성합니다 - 선언형 접근
 */
const generatePointsDetails = (
  basePoints: number,
  isTuesday: boolean,
  setBonus: { points: number; description: string },
  bulkBonus: { points: number; description: string },
) => {
  const details: string[] = [];

  if (basePoints > 0) {
    if (isTuesday) {
      details.push(POINTS_MESSAGES.TUESDAY_DOUBLE);
    } else {
      details.push(
        POINTS_MESSAGES.BASE_POINTS.replace("{points}", basePoints.toString()),
      );
    }

    if (setBonus.points > 0) {
      details.push(setBonus.description);
    }

    if (bulkBonus.points > 0) {
      details.push(bulkBonus.description);
    }
  }

  return details;
};

/**
 * 전체 포인트 계산 - 선언형 접근
 * @param totalAmount - 총 구매 금액
 * @param cartItems - 장바구니 아이템들
 * @param totalQuantity - 총 구매 수량
 * @param date - 구매 날짜
 * @returns 포인트 계산 결과
 */
export const calculateTotalPoints = (
  totalAmount: number,
  cartItems: Array<{ id: string; q: number }>,
  totalQuantity: number,
  date: Date = new Date(),
): PointsCalculation => {
  const basePoints = calculateBasePoints(totalAmount);

  if (basePoints <= 0) {
    return {
      basePoints,
      finalPoints: 0,
      details: [],
    };
  }

  const isTuesday = date.getDay() === 2;
  const finalBasePoints = isTuesday
    ? calculateTuesdayPoints(basePoints, date)
    : basePoints;

  const setBonus = calculateSetBonus(cartItems);
  const bulkBonus = calculateBulkBonus(totalQuantity);

  const finalPoints = finalBasePoints + setBonus.points + bulkBonus.points;
  const details = generatePointsDetails(
    basePoints,
    isTuesday,
    setBonus,
    bulkBonus,
  );

  return {
    basePoints,
    finalPoints,
    details,
  };
};

/**
 * 포인트 메시지 포매팅 - 선언형 접근
 * @param template - 메시지 템플릿
 * @param values - 치환할 값들
 * @returns 포매팅된 메시지
 */
export const formatPointsMessage = (
  template: string,
  values: Record<string, string | number>,
): string =>
  Object.keys(values).reduce(
    (message, key) => message.replace(`{${key}}`, values[key].toString()),
    template,
  );

/**
 * 정책별 포인트를 계산합니다 - 선언형 접근
 */
const calculatePolicyPoints = (
  totalAmount: number,
  policy: PointsPolicy,
): number => {
  if (totalAmount < policy.minPurchase) return 0;

  const points = Math.floor(totalAmount * policy.earnRate);
  return policy.maxPoints ? Math.min(points, policy.maxPoints) : points;
};

/**
 * 총 포인트 적립을 계산합니다 - 선언형 접근
 * @param totalAmount - 총 구매 금액
 * @param policies - 포인트 정책 배열
 * @returns 총 포인트 적립
 */
export const calculateTotalPointsEarned = (
  totalAmount: number,
  policies: PointsPolicy[],
): number =>
  policies.reduce(
    (total, policy) => total + calculatePolicyPoints(totalAmount, policy),
    0,
  );
