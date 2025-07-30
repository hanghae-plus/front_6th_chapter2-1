// ==========================================
// 포인트 계산 서비스 🎁
// ==========================================

import {
  PRODUCT_ONE,
  PRODUCT_TWO,
  PRODUCT_THREE,
  PRODUCT_LIST,
} from '../constants/products.js';

import {
  POINTS_CONFIG,
  QUANTITY_THRESHOLDS,
  WEEKDAYS,
} from '../constants/config.js';

// ==========================================
// 포인트 계산 상수 및 헬퍼 함수들
// ==========================================

// 상품별 보너스 포인트 체크
const PRODUCT_BONUS_CHECK = {
  [PRODUCT_ONE]: 'hasKeyboard',
  [PRODUCT_TWO]: 'hasMouse',
  [PRODUCT_THREE]: 'hasMonitorArm',
};

/**
 * 장바구니에 있는 상품들 찾기
 * @param {HTMLElement} cartDisplay - 장바구니 컨테이너
 * @returns {Array} - 장바구니에 있는 상품 배열
 */
export function parseCartProducts(cartDisplay) {
  const cartItems = Array.from(cartDisplay.children);

  return cartItems
    .map((cartItem) => {
      return PRODUCT_LIST.find((product) => product.id === cartItem.id);
    })
    .filter((product) => product);
}

/**
 * 기본 포인트 계산
 * @param {number} totalAmount - 총 금액
 * @returns {number} - 기본 포인트
 */
export function calculateBasePoints(totalAmount) {
  const basePoints = Math.floor(totalAmount / POINTS_CONFIG.BASE_POINT_RATE);
  return basePoints > 0 ? basePoints : 0;
}

/**
 * 화요일 포인트 계산
 * @param {number} basePoints - 기본 포인트
 * @returns {Object} - {points, detail}
 */
export function calculateTuesdayPoints(basePoints) {
  const isTuesday = new Date().getDay() === WEEKDAYS.TUESDAY;

  if (!isTuesday || basePoints <= 0) {
    return { points: basePoints, detail: [] };
  }

  return {
    points: basePoints * POINTS_CONFIG.TUESDAY_MULTIPLIER,
    detail: ['화요일 2배'],
  };
}

/**
 * 상품 조합 체크
 * @param {Array} cartProducts - 장바구니 상품 배열
 * @returns {Object} - 상품 플래그 객체
 */
export function checkProductCombinations(cartProducts) {
  const productFlags = {
    hasKeyboard: false,
    hasMouse: false,
    hasMonitorArm: false,
  };

  cartProducts.forEach((product) => {
    const flagName = PRODUCT_BONUS_CHECK[product.id];
    if (flagName) {
      productFlags[flagName] = true;
    }
  });

  return productFlags;
}

/**
 * 조합 보너스 포인트 계산
 * @param {Object} productFlags - 상품 플래그 객체
 * @returns {Object} - {points, details}
 */
export function calculateComboBonus(productFlags) {
  const { hasKeyboard, hasMouse, hasMonitorArm } = productFlags;
  let bonusPoints = 0;
  const bonusDetails = [];

  // 키보드 마우스 세트 보너스
  if (hasKeyboard && hasMouse) {
    bonusPoints += POINTS_CONFIG.COMBO_BONUS.KEYBOARD_MOUSE;
    bonusDetails.push(
      `키보드+마우스 세트 +${POINTS_CONFIG.COMBO_BONUS.KEYBOARD_MOUSE}p`
    );
  }

  // 풀세트 구매 보너스
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    bonusPoints += POINTS_CONFIG.COMBO_BONUS.FULL_SET;
    bonusDetails.push(`풀세트 구매 +${POINTS_CONFIG.COMBO_BONUS.FULL_SET}p`);
  }

  return { points: bonusPoints, details: bonusDetails };
}

/**
 * 대량 구매 포인트 계산
 * @param {number} itemCount - 총 상품 개수
 * @returns {Object} - {points, details}
 */
export function calculateBulkBonus(itemCount) {
  const bulkBonusRules = [
    {
      threshold: QUANTITY_THRESHOLDS.BULK_DISCOUNT_MINIMUM, // 30개
      points: POINTS_CONFIG.BULK_BONUS.THIRTY_PLUS, // 100p
      label: `대량구매(${QUANTITY_THRESHOLDS.BULK_DISCOUNT_MINIMUM}개+)`,
    },
    {
      threshold: QUANTITY_THRESHOLDS.MEDIUM_BULK_MINIMUM, // 20개
      points: POINTS_CONFIG.BULK_BONUS.TWENTY_PLUS, // 50p
      label: `대량구매(${QUANTITY_THRESHOLDS.MEDIUM_BULK_MINIMUM}개+)`,
    },
    {
      threshold: QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT_MINIMUM, // 10개
      points: POINTS_CONFIG.BULK_BONUS.TEN_PLUS, // 20p
      label: `대량구매(${QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT_MINIMUM}개+)`,
    },
  ];

  // 조건에 맞는 첫 번째 룰 찾기
  const applicableRule = bulkBonusRules.find(
    (rule) => itemCount >= rule.threshold
  );

  if (!applicableRule) {
    return { points: 0, details: [] };
  }

  return {
    points: applicableRule.points,
    details: [`${applicableRule.label} +${applicableRule.points}p`],
  };
}

// ==========================================
// 포인트 계산 메인 함수들
// ==========================================

/**
 * 전체 보너스 포인트 계산
 * @param {HTMLElement} cartDisplay - 장바구니 컨테이너
 * @param {number} totalAmount - 총 금액
 * @param {number} itemCount - 총 상품 개수
 * @returns {Object} - {totalPoints, pointsDetail}
 */
export function calculateTotalBonusPoints(cartDisplay, totalAmount, itemCount) {
  if (cartDisplay.children.length === 0) {
    return { totalPoints: 0, pointsDetail: [] };
  }

  const cartProducts = parseCartProducts(cartDisplay);

  // 기본 포인트
  const basePoints = calculateBasePoints(totalAmount);
  let pointsDetail = basePoints > 0 ? [`기본: ${basePoints}p`] : [];

  // 화요일 포인트
  const tuesdayResult = calculateTuesdayPoints(basePoints);
  let finalPoints = tuesdayResult.points;
  pointsDetail = pointsDetail.concat(tuesdayResult.detail);

  // 조합 보너스
  const productFlags = checkProductCombinations(cartProducts);
  const comboBonus = calculateComboBonus(productFlags);
  finalPoints += comboBonus.points;
  pointsDetail = pointsDetail.concat(comboBonus.details);

  // 대량구매 보너스
  const bulkBonus = calculateBulkBonus(itemCount);
  finalPoints += bulkBonus.points;
  pointsDetail = pointsDetail.concat(bulkBonus.details);

  return {
    totalPoints: finalPoints,
    pointsDetail,
  };
}

/**
 * 포인트 UI 업데이트
 * @param {number} bonusPoints - 보너스 포인트
 * @param {Array} pointsDetail - 포인트 상세 내역
 */
export function updatePointsDisplay(bonusPoints, pointsDetail) {
  const loyaltyPointsElement = document.getElementById('loyalty-points');
  if (!loyaltyPointsElement) return;

  if (bonusPoints > 0) {
    loyaltyPointsElement.innerHTML =
      `<div>적립 포인트: <span class="font-bold">${bonusPoints}p</span></div>` +
      `<div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>`;
    loyaltyPointsElement.style.display = 'block';
  } else {
    loyaltyPointsElement.textContent = '적립 포인트: 0p';
    loyaltyPointsElement.style.display = 'block';
  }
}

/**
 * 보너스 포인트 렌더링 (메인 함수)
 * @param {HTMLElement} cartDisplay - 장바구니 컨테이너
 * @param {number} totalAmount - 총 금액
 * @param {number} itemCount - 총 상품 개수
 * @returns {number} - 계산된 보너스 포인트
 */
export function renderBonusPoints(cartDisplay, totalAmount, itemCount) {
  try {
    const result = calculateTotalBonusPoints(
      cartDisplay,
      totalAmount,
      itemCount
    );

    // UI 업데이트
    updatePointsDisplay(result.totalPoints, result.pointsDetail);

    // 빈 장바구니일 때 숨기기
    if (cartDisplay.children.length === 0) {
      const loyaltyPointsElement = document.getElementById('loyalty-points');
      if (loyaltyPointsElement) {
        loyaltyPointsElement.style.display = 'none';
      }
    }

    return result.totalPoints;
  } catch (error) {
    console.error('🚨 포인트 계산 중 오류 발생:', error);
    updatePointsDisplay(0, []);
    return 0;
  }
}
