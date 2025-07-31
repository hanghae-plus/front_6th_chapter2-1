// ==========================================
// 포인트 서비스 (TypeScript) - React 방식
// ==========================================

import { THRESHOLDS, POINT_BONUSES, BONUS_RULES } from '../constant/index';
import type { Product } from '../types';

// 🏷️ 상품 ID 상수들
const PRODUCT_ONE = 'p1';
const PRODUCT_TWO = 'p2';
const PRODUCT_THREE = 'p3';

export interface PointCalculationResult {
  finalPoints: number;
  pointsDetail: string[];
}

/**
 * 포인트 계산 결과 인터페이스
 */
export interface BonusPointsData {
  totalPoints: number;
  details: string[];
  hasKeyboard: boolean;
  hasMouse: boolean;
  hasMonitorArm: boolean;
}

/**
 * 키보드+마우스 세트 확인
 */
export const hasKeyboardMouseSet = (hasKeyboard: boolean, hasMouse: boolean): boolean => {
  return hasKeyboard && hasMouse;
};

/**
 * 풀세트 확인 (키보드+마우스+모니터암)
 */
export const hasFullProductSet = (hasKeyboard: boolean, hasMouse: boolean, hasMonitorArm: boolean): boolean => {
  return hasKeyboard && hasMouse && hasMonitorArm;
};

/**
 * 화요일 보너스 적용 확인
 */
export const shouldApplyTuesdayBonus = (): boolean => {
  return new Date().getDay() === 2; // 화요일
};

/**
 * 장바구니 아이템으로부터 상품 종류 확인
 */
export const getProductTypes = (cartItems: Product[]): { hasKeyboard: boolean; hasMouse: boolean; hasMonitorArm: boolean } => {
  let hasKeyboard = false;
  let hasMouse = false;
  let hasMonitorArm = false;
  
  cartItems.forEach(item => {
    if (item.id === PRODUCT_ONE) {
      hasKeyboard = true;
    } else if (item.id === PRODUCT_TWO) {
      hasMouse = true;
    } else if (item.id === PRODUCT_THREE) {
      hasMonitorArm = true;
    }
  });
  
  return { hasKeyboard, hasMouse, hasMonitorArm };
};

/**
 * 보너스 포인트 계산 (React 방식)
 *
 * @description 구매 금액과 특별 조건에 따라 적립 포인트를 계산
 *
 * 포인트 적립 규칙:
 * - 기본: 구매액의 0.1% (1000원당 1포인트)
 * - 화요일: 기본 포인트 2배
 * - 키보드+마우스 세트: +50포인트
 * - 풀세트 구매 (키보드+마우스+모니터암): +100포인트 추가
 * - 대량구매: 10개↑ +20p, 20개↑ +50p, 30개↑ +100p
 */
export const calculateBonusPoints = (
  totalAmount: number,
  cartItems: Product[],
  itemCount: number
): PointCalculationResult => {
  const basePoints = Math.floor(totalAmount / THRESHOLDS.POINTS_PER_WON);
  let finalPoints = 0;
  const pointsDetail: string[] = [];
  
  if (cartItems.length === 0) {
    return { finalPoints: 0, pointsDetail: [] };
  }
  
  // 기본 포인트
  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push(`기본: ${basePoints}p`);
  }
  
  // 화요일 보너스
  if (shouldApplyTuesdayBonus() && basePoints > 0) {
    finalPoints = basePoints * POINT_BONUSES.TUESDAY_MULTIPLIER;
    pointsDetail.push('화요일 2배');
  }
  
  // 상품 종류 확인
  const { hasKeyboard, hasMouse, hasMonitorArm } = getProductTypes(cartItems);
  
  // 키보드+마우스 세트 보너스
  if (hasKeyboardMouseSet(hasKeyboard, hasMouse)) {
    finalPoints += POINT_BONUSES.KEYBOARD_MOUSE_SET;
    pointsDetail.push(`키보드+마우스 세트 +${POINT_BONUSES.KEYBOARD_MOUSE_SET}p`);
  }
  
  // 풀세트 보너스
  if (hasFullProductSet(hasKeyboard, hasMouse, hasMonitorArm)) {
    finalPoints += POINT_BONUSES.FULL_SET;
    pointsDetail.push(`풀세트 구매 +${POINT_BONUSES.FULL_SET}p`);
  }
  
  // 대량구매 보너스
  const bonusRule = BONUS_RULES.find(rule => itemCount >= rule.threshold);
  if (bonusRule) {
    finalPoints += bonusRule.bonus;
    pointsDetail.push(`대량구매(${bonusRule.name}) +${bonusRule.bonus}p`);
  }
  
  return { finalPoints, pointsDetail };
};