import { BUSINESS_CONSTANTS, PRODUCT_IDS } from '../../shared/constants/index.js';
import { isTuesday } from '../../shared/utils/index.js';

// 기본 포인트 계산
export function calculateBasePoints(finalAmount) {
  return Math.floor(finalAmount * BUSINESS_CONSTANTS.POINTS_RATE * 1000);
}

// 화요일 포인트 배수 적용
export function applyTuesdayMultiplier(points, date = new Date()) {
  if (isTuesday(date)) {
    return points * BUSINESS_CONSTANTS.TUESDAY_POINTS_MULTIPLIER;
  }
  return points;
}

// 세트 구매 보너스 포인트
export function calculateSetBonus(cartItems) {
  const hasKeyboard = cartItems.some(item => item.productId === PRODUCT_IDS.KEYBOARD);
  const hasMouse = cartItems.some(item => item.productId === PRODUCT_IDS.MOUSE);
  const hasMonitorArm = cartItems.some(item => item.productId === PRODUCT_IDS.MONITOR_ARM);

  let bonusPoints = 0;
  const bonusDescriptions = [];

  // 키보드 + 마우스 세트
  if (hasKeyboard && hasMouse) {
    bonusPoints += 50;
    bonusDescriptions.push('키보드+마우스 세트 +50p');
  }

  // 풀세트 (키보드 + 마우스 + 모니터암)
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    bonusPoints += 100;
    bonusDescriptions.push('풀세트 구매 +100p');
  }

  return { bonusPoints, bonusDescriptions };
}

// 수량별 보너스 포인트
export function calculateQuantityBonus(totalQuantity) {
  if (totalQuantity >= 30) {
    return { bonusPoints: 100, description: '대량구매(30개+) +100p' };
  } else if (totalQuantity >= 20) {
    return { bonusPoints: 50, description: '대량구매(20개+) +50p' };
  } else if (totalQuantity >= 10) {
    return { bonusPoints: 20, description: '대량구매(10개+) +20p' };
  }
  return { bonusPoints: 0, description: '' };
}

// 종합 포인트 계산 서비스
export class PointsService {
  calculateTotalPoints(finalAmount, cartItems, totalQuantity, date = new Date()) {
    // 1. 기본 포인트
    let basePoints = calculateBasePoints(finalAmount);
    
    // 2. 화요일 배수 적용
    const isTuesdayToday = isTuesday(date);
    if (isTuesdayToday) {
      basePoints = applyTuesdayMultiplier(basePoints, date);
    }

    // 3. 세트 보너스
    const setBonus = calculateSetBonus(cartItems);
    
    // 4. 수량 보너스
    const quantityBonus = calculateQuantityBonus(totalQuantity);

    // 5. 총합 계산
    const totalPoints = basePoints + setBonus.bonusPoints + quantityBonus.bonusPoints;

    // 6. 상세 내역 생성
    const details = [];
    details.push(`기본: ${Math.floor(finalAmount * BUSINESS_CONSTANTS.POINTS_RATE * 1000)}p`);
    
    if (isTuesdayToday) {
      details.push('화요일 2배');
    }
    
    setBonus.bonusDescriptions.forEach(desc => details.push(desc));
    
    if (quantityBonus.description) {
      details.push(quantityBonus.description);
    }

    return {
      totalPoints,
      basePoints: Math.floor(finalAmount * BUSINESS_CONSTANTS.POINTS_RATE * 1000),
      setBonus: setBonus.bonusPoints,
      quantityBonus: quantityBonus.bonusPoints,
      isTuesdayMultiplier: isTuesdayToday,
      details: details.join(', ')
    };
  }
}