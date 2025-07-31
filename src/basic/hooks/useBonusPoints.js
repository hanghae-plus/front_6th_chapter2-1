// 포인트 계산 비즈니스 로직 (훅/함수)
import { PRODUCT_IDS } from '../data/productList.js';
import { CALCULATION_CONSTANTS, DISCOUNT_RATES, POINT_RATES, QUANTITY_THRESHOLDS } from '../utils/constants.js';

export function calculateBonusPoints({ cartItems, products, itemCnt, totalAmt }) {
  const basePoints = Math.floor(totalAmt / CALCULATION_CONSTANTS.POINT_BASE_AMOUNT);
  let finalPoints = 0;
  const pointsDetail = [];
  let hasKeyboard = false;
  let hasMouse = false;
  let hasMonitorArm = false;
  // let product = null;

  if (cartItems.length === 0) {
    return { points: 0, details: [] };
  }

  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push('기본: ' + basePoints + 'p');
  }
  if (new Date().getDay() === DISCOUNT_RATES.TUESDAY_DAY) {
    if (basePoints > 0) {
      finalPoints = basePoints * POINT_RATES.TUESDAY_BONUS_MULTIPLIER;
      pointsDetail.push('화요일 2배');
    }
  }

  Array.from(cartItems).forEach((node) => {
    const foundProduct = products.find((p) => p.id === node.id);
    if (!foundProduct) return;
    if (foundProduct.id === PRODUCT_IDS.KEYBOARD) {
      hasKeyboard = true;
    } else if (foundProduct.id === PRODUCT_IDS.MOUSE) {
      hasMouse = true;
    } else if (foundProduct.id === PRODUCT_IDS.MONITOR_ARM) {
      hasMonitorArm = true;
    }
  });

  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + POINT_RATES.COMBO_BONUS.KEYBOARD_MOUSE;
    pointsDetail.push('키보드+마우스 세트 +' + POINT_RATES.COMBO_BONUS.KEYBOARD_MOUSE + 'p');
  }
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + POINT_RATES.COMBO_BONUS.FULL_SET;
    pointsDetail.push('풀세트 구매 +' + POINT_RATES.COMBO_BONUS.FULL_SET + 'p');
  }
  if (itemCnt >= QUANTITY_THRESHOLDS.BONUS_TIER_3) {
    finalPoints = finalPoints + POINT_RATES.QUANTITY_BONUS.TIER_3;
    pointsDetail.push('대량구매(30개+) +' + POINT_RATES.QUANTITY_BONUS.TIER_3 + 'p');
  } else if (itemCnt >= QUANTITY_THRESHOLDS.BONUS_TIER_2) {
    finalPoints = finalPoints + POINT_RATES.QUANTITY_BONUS.TIER_2;
    pointsDetail.push('대량구매(20개+) +' + POINT_RATES.QUANTITY_BONUS.TIER_2 + 'p');
  } else if (itemCnt >= QUANTITY_THRESHOLDS.BONUS_TIER_1) {
    finalPoints = finalPoints + POINT_RATES.QUANTITY_BONUS.TIER_1;
    pointsDetail.push('대량구매(10개+) +' + POINT_RATES.QUANTITY_BONUS.TIER_1 + 'p');
  }

  return { points: finalPoints, details: pointsDetail };
}
