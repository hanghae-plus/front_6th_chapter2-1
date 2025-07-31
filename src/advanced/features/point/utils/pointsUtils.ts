/**
 * Points Calculation Utilities (TypeScript version)
 * 기존 PointsCalculator.js를 TypeScript로 포팅하고 React용으로 수정
 */

import { BUSINESS_CONSTANTS } from '@/advanced/shared/constants/business.ts';
import { PRODUCTS } from '@/advanced/features/product/constants/index.ts';

interface CartItem {
  id: string;
  name: string;
  val: number;
  originalVal: number;
  quantity: number;
  onSale: boolean;
  suggestSale: boolean;
}

interface PointCalculationResult {
  totalPoints: number;
  details: string[];
  hasPoints: boolean;
}

interface BonusResult {
  points: number;
  details: string[];
}

/**
 * 기본 포인트 계산
 */
const calculateBasePoints = (totalAmount: number): number => {
  return Math.floor(totalAmount / BUSINESS_CONSTANTS.POINTS.BASE_POINT_RATE);
};

/**
 * 화요일인지 확인
 */
const isTuesday = (): boolean => {
  return new Date().getDay() === 2;
};

/**
 * 장바구니에서 제품 ID 추출
 */
const getProductIdsFromCart = (cartItems: CartItem[]): string[] => {
  return cartItems.map(item => item.id);
};

/**
 * 세트 보너스 계산
 */
const calculateSetBonuses = (cartItems: CartItem[]): BonusResult => {
  const productIdsInCart = getProductIdsFromCart(cartItems);
  const bonusDetails: string[] = [];

  const hasKeyboard = productIdsInCart.includes(PRODUCTS.KEYBOARD);
  const hasMouse = productIdsInCart.includes(PRODUCTS.MOUSE);
  const hasMonitorArm = productIdsInCart.includes(PRODUCTS.MONITOR_ARM);

  const keyboardMouseBonus =
    hasKeyboard && hasMouse
      ? BUSINESS_CONSTANTS.POINTS.KEYBOARD_MOUSE_BONUS
      : 0;

  if (keyboardMouseBonus > 0) {
    bonusDetails.push(`키보드+마우스 세트 +${keyboardMouseBonus}p`);
  }

  const fullSetBonus =
    hasKeyboard && hasMouse && hasMonitorArm
      ? BUSINESS_CONSTANTS.POINTS.FULL_SET_BONUS
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
const calculateBulkBonuses = (totalItemCount: number): BonusResult => {
  const { TIER_1, TIER_2, TIER_3 } =
    BUSINESS_CONSTANTS.POINTS.BULK_PURCHASE_BONUSES;

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
 * 포인트 계산 (메인 함수)
 * 기존 calculateAndRenderPoints에서 DOM 렌더링 부분을 제거하고 계산 로직만 추출
 * @param cartItems 장바구니 아이템 배열
 * @param totalAmount 총 금액
 * @returns 포인트 계산 결과
 */
export const calculatePoints = (
  cartItems: CartItem[],
  totalAmount: number,
): PointCalculationResult => {
  // 빈 장바구니 체크
  if (cartItems.length === 0 || totalAmount === 0) {
    return {
      totalPoints: 0,
      details: [],
      hasPoints: false,
    };
  }

  const basePoints = calculateBasePoints(totalAmount);
  const baseDetails = basePoints > 0 ? [`기본: ${basePoints}p`] : [];

  const todayIsTuesday = isTuesday();
  const tuesdayPoints =
    todayIsTuesday && basePoints > 0
      ? basePoints * BUSINESS_CONSTANTS.POINTS.TUESDAY_MULTIPLIER
      : basePoints;
  const tuesdayDetails = todayIsTuesday && basePoints > 0 ? ['화요일 2배'] : [];

  const setBonusResult = calculateSetBonuses(cartItems);

  const totalItemCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const bulkBonusResult = calculateBulkBonuses(totalItemCount);

  const finalPoints =
    tuesdayPoints + setBonusResult.points + bulkBonusResult.points;
  const pointsDetail = [
    ...baseDetails,
    ...tuesdayDetails,
    ...setBonusResult.details,
    ...bulkBonusResult.details,
  ];

  return {
    totalPoints: finalPoints,
    details: pointsDetail,
    hasPoints: finalPoints > 0,
  };
};
