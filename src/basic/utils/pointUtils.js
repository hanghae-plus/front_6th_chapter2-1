import { POINTS_POLICY } from '../data/policy';
import { PRODUCT_IDS } from '../data/products';
import { findProductById } from './productUtils';

const DAYS_OF_WEEK = {
  TUESDAY: 2,
};

/** 화요일 체크 */
export const isTuesday = () => new Date().getDay() === DAYS_OF_WEEK.TUESDAY;

/** 기본 포인트 계산
 * @param {number} totalAmount - 총 금액
 */
const calculateBasePoints = (totalAmount) => {
  return Math.floor(totalAmount * POINTS_POLICY.BASE_RATE);
};

/** 상품 조합 계산
 * @param {Array} cartItems - 카트 아이템 목록
 * @param {Array} productList - 상품 목록
 */
const getProductCombination = (cartItems, productList) => {
  const combination = {
    hasKeyboard: false,
    hasMouse: false,
    hasMonitorArm: false,
  };

  cartItems.forEach((cartItem) => {
    const product = findProductById(productList, cartItem.id);
    if (!product) return;

    switch (product.productId) {
      case PRODUCT_IDS.KEYBOARD:
        combination.hasKeyboard = true;
        break;
      case PRODUCT_IDS.MOUSE:
        combination.hasMouse = true;
        break;
      case PRODUCT_IDS.MONITOR_ARM:
        combination.hasMonitorArm = true;
        break;
    }
  });

  return combination;
};

/** 모든 보너스 계산
 * @param {Object} combination - 상품 조합
 * @param {number} itemCount - 카트 아이템 수
 */
const calculateAllBonuses = (combination, itemCount) => {
  const { hasKeyboard, hasMouse, hasMonitorArm } = combination;
  let totalBonus = 0;
  const bonusDetails = [];

  // 세트 구매 보너스
  if (hasKeyboard && hasMouse) {
    totalBonus += POINTS_POLICY.SET_BONUS.KEYBOARD_MOUSE;
    bonusDetails.push('키보드+마우스 세트 +50p');
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    totalBonus += POINTS_POLICY.SET_BONUS.FULL_SET;
    bonusDetails.push('풀세트 구매 +100p');
  }

  // 수량 구매 보너스
  const { SMALL, MEDIUM, LARGE } = POINTS_POLICY.BULK_PURCHASE_BONUS;

  if (itemCount >= LARGE.minQuantity) {
    totalBonus += LARGE.points;
    bonusDetails.push(`대량구매(${LARGE.minQuantity}개+) +${LARGE.points}p`);
  } else if (itemCount >= MEDIUM.minQuantity) {
    totalBonus += MEDIUM.points;
    bonusDetails.push(`대량구매(${MEDIUM.minQuantity}개+) +${MEDIUM.points}p`);
  } else if (itemCount >= SMALL.minQuantity) {
    totalBonus += SMALL.points;
    bonusDetails.push(`대량구매(${SMALL.minQuantity}개+) +${SMALL.points}p`);
  }

  return { totalBonus, bonusDetails };
};

/** 총 포인트 계산
 * @param {Array} cartItems - 카트 아이템 목록
 * @param {Array} productList - 상품 목록
 * @param {number} totalAmount - 총 금액
 * @param {number} itemCount - 카트 아이템 수
 */
export const calculateTotalPoints = (cartItems, productList, totalAmount, itemCount) => {
  const basePoints = calculateBasePoints(totalAmount);

  if (basePoints === 0) {
    // 기본 포인트가 0이면 포인트 계산 종료
    return { totalPoints: 0, pointsDetails: [] };
  }

  let finalPoints = basePoints;
  const pointsDetails = [`기본: ${basePoints}p`];

  // 화요일 2배 보너스
  if (isTuesday()) {
    finalPoints = basePoints * POINTS_POLICY.TUESDAY_MULTIPLIER;
    pointsDetails.push('화요일 2배');
  }

  // 세트 및 수량 보너스 계산
  const combination = getProductCombination(cartItems, productList);
  const { totalBonus, bonusDetails } = calculateAllBonuses(combination, itemCount);

  finalPoints += totalBonus;
  pointsDetails.push(...bonusDetails);

  return { totalPoints: finalPoints, pointsDetails };
};
