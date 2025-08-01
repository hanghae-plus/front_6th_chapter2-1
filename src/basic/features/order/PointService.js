import {
  POINT_RATES,
  QUANTITY_THRESHOLDS,
  TUESDAY,
  KEYBOARD_ID,
  MOUSE_ID,
  MONITOR_ID,
} from '../../shared/constants/index.js';

// ==================== 포인트 적립 규칙 ====================

/**
 * 기본 포인트 계산 (1,000원당 1포인트)
 * @param {number} finalAmount - 최종 결제 금액
 * @returns {number} 기본 포인트
 */
export function calculateBasePoints(finalAmount) {
  return Math.floor(finalAmount / 1000);
}

/**
 * 화요일 포인트 배율 적용
 * @param {number} basePoints - 기본 포인트
 * @param {boolean} isTuesday - 화요일 여부
 * @returns {Object} { points, details }
 */
export function applyTuesdayBonus(basePoints, isTuesday) {
  if (!isTuesday || basePoints === 0) {
    return { points: basePoints, details: [] };
  }

  const multipliedPoints = basePoints * POINT_RATES.TUESDAY_MULTIPLIER;
  return {
    points: multipliedPoints,
    details: ['화요일 2배'],
  };
}

/**
 * 장바구니 상품 타입 확인
 * @param {Array} cartData - 장바구니 데이터 [{id: 'p1', quantity: 2}]
 * @param {Function} getProductById - 상품 조회 함수
 * @returns {Object} { hasKeyboard, hasMouse, hasMonitor }
 */
export function checkProductTypes(cartData, getProductById) {
  const types = {
    hasKeyboard: false,
    hasMouse: false,
    hasMonitor: false,
  };

  for (const cartItem of cartData) {
    const product = getProductById(cartItem.id);
    if (!product) continue;

    switch (product.id) {
      case KEYBOARD_ID:
        types.hasKeyboard = true;
        break;
      case MOUSE_ID:
        types.hasMouse = true;
        break;
      case MONITOR_ID:
        types.hasMonitor = true;
        break;
    }
  }

  return types;
}

/**
 * 세트 구매 보너스 포인트 계산
 * @param {Object} productTypes - 상품 타입 정보
 * @returns {Object} { bonusPoints, bonusDetails }
 */
export function calculateSetBonus(productTypes) {
  const { hasKeyboard, hasMouse, hasMonitor } = productTypes;
  let bonusPoints = 0;
  const bonusDetails = [];

  // 키보드 + 마우스 세트
  if (hasKeyboard && hasMouse) {
    bonusPoints += POINT_RATES.SETS.KEYBOARD_MOUSE;
    bonusDetails.push('키보드+마우스 세트 +50p');
  }

  // 풀세트 (키보드 + 마우스 + 모니터암)
  if (hasKeyboard && hasMouse && hasMonitor) {
    bonusPoints += POINT_RATES.SETS.FULL_SET;
    bonusDetails.push('풀세트 구매 +100p');
  }

  return { bonusPoints, bonusDetails };
}

/**
 * 수량별 보너스 포인트 계산
 * @param {number} totalQuantity - 총 수량
 * @returns {Object} { bonusPoints, bonusDetail }
 */
export function calculateQuantityBonus(totalQuantity) {
  if (totalQuantity >= QUANTITY_THRESHOLDS.BONUS_LARGE) {
    return {
      bonusPoints: POINT_RATES.BULK_BONUS.LARGE,
      bonusDetail: '대량구매(30개+) +100p',
    };
  } else if (totalQuantity >= QUANTITY_THRESHOLDS.BONUS_MEDIUM) {
    return {
      bonusPoints: POINT_RATES.BULK_BONUS.MEDIUM,
      bonusDetail: '대량구매(20개+) +50p',
    };
  } else if (totalQuantity >= QUANTITY_THRESHOLDS.BONUS_SMALL) {
    return {
      bonusPoints: POINT_RATES.BULK_BONUS.SMALL,
      bonusDetail: '대량구매(10개+) +20p',
    };
  }

  return { bonusPoints: 0, bonusDetail: null };
}

/**
 * 전체 포인트 계산 (메인 오케스트레이터)
 * @param {number} finalAmount - 최종 결제 금액
 * @param {number} totalQuantity - 총 수량
 * @param {Array} cartData - 장바구니 데이터 [{id: 'p1', quantity: 2}]
 * @param {Function} getProductById - 상품 조회 함수
 * @returns {Object} { finalPoints, pointsDetails }
 */
export function calculateTotalPoints(
  finalAmount,
  totalQuantity,
  cartData,
  getProductById
) {
  // 1. 기본 포인트 계산
  const basePoints = calculateBasePoints(finalAmount);
  let finalPoints = basePoints;
  const pointsDetails = [];

  if (basePoints > 0) {
    pointsDetails.push(`기본: ${basePoints}p`);
  }

  // 2. 화요일 배율 적용
  const today = new Date();
  const isTuesday = today.getDay() === TUESDAY;
  const tuesdayResult = applyTuesdayBonus(basePoints, isTuesday);
  finalPoints = tuesdayResult.points;
  pointsDetails.push(...tuesdayResult.details);

  // 3. 세트 구매 보너스
  const productTypes = checkProductTypes(cartData, getProductById);
  const setBonusResult = calculateSetBonus(productTypes);
  finalPoints += setBonusResult.bonusPoints;
  pointsDetails.push(...setBonusResult.bonusDetails);

  // 4. 수량별 보너스
  const quantityBonusResult = calculateQuantityBonus(totalQuantity);
  finalPoints += quantityBonusResult.bonusPoints;
  if (quantityBonusResult.bonusDetail) {
    pointsDetails.push(quantityBonusResult.bonusDetail);
  }

  return {
    finalPoints: Math.round(finalPoints),
    pointsDetails,
  };
}
