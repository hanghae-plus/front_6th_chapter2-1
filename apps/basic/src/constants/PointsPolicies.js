/**
 * 포인트 적립 정책 상수 정의
 * 모든 포인트 관련 정책을 중앙집중적으로 관리합니다.
 */

/**
 * @typedef {Object} PointsCalculation
 * @property {number} basePoints - 기본 적립 포인트
 * @property {number} finalPoints - 최종 적립 포인트
 * @property {string[]} details - 포인트 적립 내역
 */

/**
 * @typedef {Object} BonusCondition
 * @property {number} threshold - 적용 임계값
 * @property {number} points - 보너스 포인트
 * @property {string} description - 보너스 설명
 */

/**
 * 포인트 적립률 상수
 */
export const POINTS_RATES = {
  BASE_RATE: 0.001, // 0.1% (1000원당 1포인트)
  TUESDAY_MULTIPLIER: 2, // 화요일 2배 적립
  MINIMUM_EARNING: 1 // 최소 적립 포인트
};

/**
 * 보너스 포인트 정책 상수
 */
export const BONUS_POINTS = {
  KEYBOARD_MOUSE_SET: {
    points: 50,
    description: '키보드+마우스 세트 +50p'
  },
  FULL_SET: {
    points: 100,
    description: '풀세트 구매 +100p'
  },
  BULK_PURCHASE: {
    LEVEL_1: { threshold: 10, points: 20, description: '대량구매(10개+) +20p' },
    LEVEL_2: { threshold: 20, points: 50, description: '대량구매(20개+) +50p' },
    LEVEL_3: {
      threshold: 30,
      points: 100,
      description: '대량구매(30개+) +100p'
    }
  }
};

/**
 * 포인트 메시지 템플릿
 */
export const POINTS_MESSAGES = {
  BASE_POINTS: '기본: {points}p',
  TUESDAY_DOUBLE: '화요일 2배',
  KEYBOARD_MOUSE_SET: '키보드+마우스 세트 +{points}p',
  FULL_SET: '풀세트 구매 +{points}p',
  BULK_PURCHASE_TEMPLATE: '대량구매({threshold}개+) +{points}p'
};

/**
 * 기본 포인트 계산
 * @param {number} totalAmount - 총 구매 금액
 * @returns {number} 기본 포인트
 */
export function calculateBasePoints(totalAmount) {
  return Math.floor(totalAmount * POINTS_RATES.BASE_RATE);
}

/**
 * 화요일 포인트 계산
 * @param {number} basePoints - 기본 포인트
 * @param {Date} date - 구매 날짜
 * @returns {number} 화요일 적용된 포인트
 */
export function calculateTuesdayPoints(basePoints, date = new Date()) {
  const isTuesday = date.getDay() === 2;
  return isTuesday ? basePoints * POINTS_RATES.TUESDAY_MULTIPLIER : basePoints;
}

/**
 * 세트 구매 보너스 포인트 계산
 * @param {Object[]} cartItems - 장바구니 아이템들
 * @returns {Object} 세트 보너스 정보
 */
export function calculateSetBonus(cartItems) {
  const hasKeyboard = cartItems.some(item => item.id === 'p1' && item.q > 0);
  const hasMouse = cartItems.some(item => item.id === 'p2' && item.q > 0);
  const hasMonitorArm = cartItems.some(item => item.id === 'p3' && item.q > 0);

  // 풀세트 체크 (키보드 + 마우스 + 모니터암)
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    return {
      points: BONUS_POINTS.FULL_SET.points,
      description: BONUS_POINTS.FULL_SET.description,
      type: 'FULL_SET'
    };
  }

  // 키보드+마우스 세트 체크
  if (hasKeyboard && hasMouse) {
    return {
      points: BONUS_POINTS.KEYBOARD_MOUSE_SET.points,
      description: BONUS_POINTS.KEYBOARD_MOUSE_SET.description,
      type: 'KEYBOARD_MOUSE_SET'
    };
  }

  return { points: 0, description: '', type: 'NONE' };
}

/**
 * 대량구매 보너스 포인트 계산
 * @param {number} totalQuantity - 총 구매 수량
 * @returns {Object} 대량구매 보너스 정보
 */
export function calculateBulkBonus(totalQuantity) {
  const bulkLevels = [
    BONUS_POINTS.BULK_PURCHASE.LEVEL_3, // 30개+
    BONUS_POINTS.BULK_PURCHASE.LEVEL_2, // 20개+
    BONUS_POINTS.BULK_PURCHASE.LEVEL_1 // 10개+
  ];

  for (const level of bulkLevels) {
    if (totalQuantity >= level.threshold) {
      return {
        points: level.points,
        description: level.description,
        threshold: level.threshold
      };
    }
  }

  return { points: 0, description: '', threshold: 0 };
}

/**
 * 전체 포인트 계산
 * @param {number} totalAmount - 총 구매 금액
 * @param {Object[]} cartItems - 장바구니 아이템들
 * @param {number} totalQuantity - 총 구매 수량
 * @param {Date} date - 구매 날짜
 * @returns {PointsCalculation} 포인트 계산 결과
 */
export function calculateTotalPoints(
  totalAmount,
  cartItems,
  totalQuantity,
  date = new Date()
) {
  const basePoints = calculateBasePoints(totalAmount);
  let finalPoints = 0;
  const details = [];

  if (basePoints > 0) {
    // 화요일 체크
    const isTuesday = date.getDay() === 2;
    if (isTuesday) {
      finalPoints = calculateTuesdayPoints(basePoints, date);
      details.push(POINTS_MESSAGES.TUESDAY_DOUBLE);
    } else {
      finalPoints = basePoints;
      details.push(POINTS_MESSAGES.BASE_POINTS.replace('{points}', basePoints));
    }

    // 세트 보너스
    const setBonus = calculateSetBonus(cartItems);
    if (setBonus.points > 0) {
      finalPoints += setBonus.points;
      details.push(setBonus.description);
    }

    // 대량구매 보너스
    const bulkBonus = calculateBulkBonus(totalQuantity);
    if (bulkBonus.points > 0) {
      finalPoints += bulkBonus.points;
      details.push(bulkBonus.description);
    }
  }

  return {
    basePoints,
    finalPoints,
    details
  };
}

/**
 * 포인트 메시지 포매팅
 * @param {string} template - 메시지 템플릿
 * @param {Object} values - 치환할 값들
 * @returns {string} 포매팅된 메시지
 */
export function formatPointsMessage(template, values) {
  let message = template;
  Object.keys(values).forEach(key => {
    message = message.replace(`{${key}}`, values[key]);
  });
  return message;
}
