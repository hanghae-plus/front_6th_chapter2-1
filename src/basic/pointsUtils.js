import {
  PRODUCT_KEYBOARD,
  PRODUCT_MOUSE,
  PRODUCT_MONITOR_ARM,
} from './constants';
import { getBonusPerBulkInfo } from './utils';

// 기본 포인트 계산 (총액 기반)
function calculateBasePoints(totalAmount) {
  return Math.floor(totalAmount / 1000);
}

// 화요일 포인트 배율 적용
function applyTuesdayPointsMultiplier(basePoints, isTuesday) {
  if (isTuesday && basePoints > 0) {
    return {
      points: basePoints * 2,
      detail: '화요일 2배',
    };
  }
  return {
    points: basePoints,
    detail: null,
  };
}

// 장바구니에서 보유 상품 종류 확인
function checkProductTypesInCart(cartItems, findProductById) {
  const productTypes = {
    hasKeyboard: false,
    hasMouse: false,
    hasMonitorArm: false,
  };

  for (const item of cartItems) {
    const product = findProductById(item.id);
    if (!product) continue;

    if (product.id === PRODUCT_KEYBOARD) {
      productTypes.hasKeyboard = true;
    } else if (product.id === PRODUCT_MOUSE) {
      productTypes.hasMouse = true;
    } else if (product.id === PRODUCT_MONITOR_ARM) {
      productTypes.hasMonitorArm = true;
    }
  }

  return productTypes;
}

// 세트 상품 보너스 포인트 계산
function calculateSetBonusPoints(productTypes) {
  const bonuses = [];
  let bonusPoints = 0;

  const { hasKeyboard, hasMouse, hasMonitorArm } = productTypes;

  // 키보드 + 마우스 세트 보너스
  if (hasKeyboard && hasMouse) {
    bonusPoints += 50;
    bonuses.push('키보드+마우스 세트 +50p');
  }

  // 풀세트 보너스
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    bonusPoints += 100;
    bonuses.push('풀세트 구매 +100p');
  }

  return { bonusPoints, bonuses };
}

// 수량별 보너스 포인트 계산
function calculateBulkBonusPoints(itemCount) {
  const bonusPerBulkInfo = getBonusPerBulkInfo(itemCount);

  if (bonusPerBulkInfo) {
    return {
      bonusPoints: bonusPerBulkInfo.points,
      detail: `대량구매(${bonusPerBulkInfo.threshold}개+) +${bonusPerBulkInfo.points}p`,
    };
  }

  return { bonusPoints: 0, detail: null };
}

// 전체 보너스 포인트 계산 (메인 함수)
function calculateTotalBonusPoints(
  totalAmount,
  cartItems,
  itemCount,
  isTuesday,
  findProductById,
) {
  // 빈 장바구니 체크
  if (cartItems.length === 0) {
    return {
      totalPoints: 0,
      pointsDetail: [],
      shouldShow: false,
    };
  }

  let finalPoints = 0;
  const pointsDetail = [];

  // 1. 기본 포인트 계산
  const basePoints = calculateBasePoints(totalAmount);
  if (basePoints > 0) {
    pointsDetail.push(`기본: ${basePoints}p`);
  }

  // 2. 화요일 배율 적용
  const tuesdayResult = applyTuesdayPointsMultiplier(basePoints, isTuesday);
  finalPoints = tuesdayResult.points;
  if (tuesdayResult.detail) {
    pointsDetail.push(tuesdayResult.detail);
  }

  // 3. 세트 상품 보너스
  const productTypes = checkProductTypesInCart(cartItems, findProductById);
  const setBonusResult = calculateSetBonusPoints(productTypes);
  finalPoints += setBonusResult.bonusPoints;
  pointsDetail.push(...setBonusResult.bonuses);

  // 4. 수량별 보너스
  const bulkBonusResult = calculateBulkBonusPoints(itemCount);
  finalPoints += bulkBonusResult.bonusPoints;
  if (bulkBonusResult.detail) {
    pointsDetail.push(bulkBonusResult.detail);
  }

  return {
    totalPoints: finalPoints,
    pointsDetail,
    shouldShow: true,
  };
}

export {
  calculateBasePoints,
  applyTuesdayPointsMultiplier,
  checkProductTypesInCart,
  calculateSetBonusPoints,
  calculateBulkBonusPoints,
  calculateTotalBonusPoints,
};
