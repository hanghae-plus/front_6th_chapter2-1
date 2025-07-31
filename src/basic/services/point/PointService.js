import {
  POINT_RATES,
  PRODUCT_IDS,
  DISCOUNT_THRESHOLDS,
  UI_CONSTANTS,
} from '../../constants/index.js';

/**
 * 포인트 관련 비즈니스 로직을 담당하는 함수들
 */

/**
 * 화요일 여부 확인
 */
export function checkIsTuesday() {
  return new Date().getDay() === UI_CONSTANTS.TUESDAY;
}

/**
 * 기본 포인트 계산
 */
export function calculateBasePoints(totalAmount) {
  return Math.floor(totalAmount * POINT_RATES.BASE_RATE);
}

/**
 * 화요일 2배 포인트 적용
 */
export function applyTuesdayMultiplier(basePoints) {
  if (checkIsTuesday() && basePoints > 0) {
    return basePoints * POINT_RATES.TUESDAY_MULTIPLIER;
  }
  return basePoints;
}

/**
 * 상품 조합 보너스 포인트 계산
 */
export function calculateProductCombinationBonus(cartItems) {
  let bonusPoints = 0;
  const productIds = cartItems.map((item) => item.id);

  // 키보드+마우스 세트 보너스
  const hasKeyboard = productIds.includes(PRODUCT_IDS.KEYBOARD);
  const hasMouse = productIds.includes(PRODUCT_IDS.MOUSE);
  const hasMonitorArm = productIds.includes(PRODUCT_IDS.MONITOR_ARM);

  if (hasKeyboard && hasMouse) {
    bonusPoints += POINT_RATES.SET_BONUS;
  }

  // 풀세트 보너스
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    bonusPoints += POINT_RATES.FULL_SET_BONUS;
  }

  return bonusPoints;
}

/**
 * 수량별 보너스 포인트 계산
 */
export function calculateQuantityBonus(itemCount) {
  if (itemCount >= DISCOUNT_THRESHOLDS.BULK_PURCHASE) {
    return POINT_RATES.QUANTITY_BONUS_30;
  } else if (itemCount >= 20) {
    return POINT_RATES.QUANTITY_BONUS_20;
  } else if (itemCount >= DISCOUNT_THRESHOLDS.INDIVIDUAL_ITEM) {
    return POINT_RATES.QUANTITY_BONUS_10;
  }
  return 0;
}

/**
 * 총 포인트 계산
 */
export function calculateTotalPoints(totalAmount, cartItems) {
  let finalPoints = 0;
  const pointsDetail = [];

  // 기본 포인트 계산
  const basePoints = calculateBasePoints(totalAmount);
  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push(`기본: ${basePoints}p`);
  }

  // 화요일 2배 포인트 적용
  const tuesdayPoints = applyTuesdayMultiplier(basePoints);
  if (tuesdayPoints !== basePoints) {
    finalPoints = tuesdayPoints;
    pointsDetail.push('화요일 2배');
  }

  // 상품 조합 보너스
  const combinationBonus = calculateProductCombinationBonus(cartItems);
  if (combinationBonus > 0) {
    finalPoints += combinationBonus;

    // 키보드+마우스 세트 보너스 (50p)
    const hasKeyboard = cartItems.some((item) => item.id === PRODUCT_IDS.KEYBOARD);
    const hasMouse = cartItems.some((item) => item.id === PRODUCT_IDS.MOUSE);
    if (hasKeyboard && hasMouse) {
      pointsDetail.push('키보드+마우스 세트 +50p');
    }

    // 풀세트 보너스 (100p) - 키보드+마우스+모니터암
    const hasMonitorArm = cartItems.some((item) => item.id === PRODUCT_IDS.MONITOR_ARM);
    if (hasKeyboard && hasMouse && hasMonitorArm) {
      pointsDetail.push('풀세트 구매 +100p');
    }
  }

  // 수량별 보너스
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const quantityBonus = calculateQuantityBonus(itemCount);
  if (quantityBonus > 0) {
    finalPoints += quantityBonus;
    if (itemCount >= DISCOUNT_THRESHOLDS.BULK_PURCHASE) {
      pointsDetail.push('대량구매(30개+) +100p');
    } else if (itemCount >= 20) {
      pointsDetail.push('대량구매(20개+) +50p');
    } else {
      pointsDetail.push('대량구매(10개+) +20p');
    }
  }

  return {
    totalPoints: finalPoints,
    details: pointsDetail,
  };
}

/**
 * 포인트 정보 생성
 */
export function createPointInfo(totalAmount, cartItems) {
  if (cartItems.length === 0) {
    return {
      totalPoints: 0,
      details: [],
      displayText: '적립 포인트: 0p',
    };
  }

  const { totalPoints, details } = calculateTotalPoints(totalAmount, cartItems);

  return {
    totalPoints,
    details,
    displayText: `적립 포인트: ${totalPoints}p`,
    detailText: details.join(', '),
  };
}

/**
 * 포인트 적립 가능 여부 확인
 */
// export function canEarnPoints(totalAmount) {
//   return totalAmount > 0;
// }

/**
 * 포인트 적립율 계산
 */
// export function calculatePointRate(totalAmount, cartItems) {
//   if (!canEarnPoints(totalAmount)) {
//     return 0;
//   }

//   const { totalPoints } = calculateTotalPoints(totalAmount, cartItems);
//   return totalPoints / totalAmount;
// }

/**
 * 포인트 적립 예상 금액 계산
 */
// export function calculateExpectedPoints(totalAmount, cartItems) {
//   const { totalPoints } = calculateTotalPoints(totalAmount, cartItems);
//   return totalPoints;
// }

/**
 * 포인트 적립 내역 생성
 */
// export function createPointHistory(totalAmount, cartItems) {
//   const history = [];

//   // 기본 포인트
//   const basePoints = calculateBasePoints(totalAmount);
//   if (basePoints > 0) {
//     history.push({
//       type: 'base',
//       description: '기본 적립',
//       points: basePoints,
//     });
//   }

//   // 화요일 보너스
//   if (checkIsTuesday() && basePoints > 0) {
//     history.push({
//       type: 'tuesday',
//       description: '화요일 2배 보너스',
//       points: basePoints,
//     });
//   }

//   // 상품 조합 보너스
//   const combinationBonus = calculateProductCombinationBonus(cartItems);
//   if (combinationBonus > 0) {
//     history.push({
//       type: 'combination',
//       description: '상품 조합 보너스',
//       points: combinationBonus,
//     });
//   }

//   // 수량 보너스
//   const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
//   const quantityBonus = calculateQuantityBonus(itemCount);
//   if (quantityBonus > 0) {
//     history.push({
//       type: 'quantity',
//       description: '수량 보너스',
//       points: quantityBonus,
//     });
//   }

//   return history;
// }
