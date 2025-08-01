// Loyalty points service module
import { POINTS_CONFIG, PRODUCT_CONSTANTS } from '../data/productData.js';
import { isTuesday } from './discountService.js';

// Calculate loyalty points for purchase
export function calculateLoyaltyPoints(totalAmount, totalQuantity, cartItems) {
  let basePoints = Math.floor(totalAmount * POINTS_CONFIG.BASE_RATE);
  let finalPoints = basePoints;
  const pointsDetail = [];

  if (basePoints > 0) {
    pointsDetail.push(`기본: ${basePoints}p`);
  }

  // Tuesday bonus
  if (isTuesday() && basePoints > 0) {
    finalPoints = basePoints * POINTS_CONFIG.TUESDAY_MULTIPLIER;
    pointsDetail.push('화요일 2배');
  }

  // 상품 조합 보너스 로직을 별도 함수로 분리하여 가독성과 재사용성을 높임
  function getProductCombinationBonuses(productIds) {
    const hasKeyboard = productIds.includes(PRODUCT_CONSTANTS.PRODUCT_ONE);
    const hasMouse = productIds.includes(PRODUCT_CONSTANTS.PRODUCT_TWO);
    const hasMonitorArm = productIds.includes(PRODUCT_CONSTANTS.PRODUCT_THREE);

    const bonuses = [];
    let bonusPoints = 0;

    if (hasKeyboard && hasMouse) {
      bonusPoints += POINTS_CONFIG.KEYBOARD_MOUSE_BONUS;
      bonuses.push('키보드+마우스 세트 +50p');
    }

    if (hasKeyboard && hasMouse && hasMonitorArm) {
      bonusPoints += POINTS_CONFIG.FULL_SET_BONUS;
      bonuses.push('풀세트 구매 +100p');
    }

    return { bonusPoints, bonuses };
  }

  // 상품 조합 보너스 적용
  const { bonusPoints, bonuses } = getProductCombinationBonuses(cartItems);
  if (bonusPoints > 0) {
    finalPoints += bonusPoints;
    pointsDetail.push(...bonuses);
  }

  // 대량 구매 보너스 적용
  if (totalQuantity >= 30) {
    finalPoints += POINTS_CONFIG.BULK_PURCHASE_BONUSES[30];
    pointsDetail.push('대량구매(30개+) +100p');
  } else if (totalQuantity >= 20) {
    finalPoints += POINTS_CONFIG.BULK_PURCHASE_BONUSES[20];
    pointsDetail.push('대량구매(20개+) +50p');
  } else if (totalQuantity >= 10) {
    finalPoints += POINTS_CONFIG.BULK_PURCHASE_BONUSES[10];
    pointsDetail.push('대량구매(10개+) +20p');
  }

  return { finalPoints, pointsDetail };
}
