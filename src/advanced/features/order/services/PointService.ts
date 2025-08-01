import {
  POINT_RATES,
  QUANTITY_THRESHOLDS,
  TUESDAY,
  PRODUCT_IDS,
} from '../../../shared/constants';
import type { CartItem, Product } from '../../../shared/types';

export function calculateBasePoints(finalAmount: number): number {
  return Math.floor(finalAmount / 1000);
}

export function applyTuesdayBonus(basePoints: number, isTuesday: boolean) {
  if (!isTuesday || basePoints === 0) {
    return { points: basePoints, details: [] };
  }

  const multipliedPoints = basePoints * POINT_RATES.TUESDAY_MULTIPLIER;
  return {
    points: multipliedPoints,
    details: ['화요일 2배'],
  };
}

export function checkProductTypes(
  cartData: CartItem[],
  getProductById: (id: string) => Product | undefined
) {
  const types = {
    hasKeyboard: false,
    hasMouse: false,
    hasMonitor: false,
  };

  for (const cartItem of cartData) {
    const product = getProductById(cartItem.id);
    if (!product) continue;

    switch (product.id) {
      case PRODUCT_IDS.KEYBOARD:
        types.hasKeyboard = true;
        break;
      case PRODUCT_IDS.MOUSE:
        types.hasMouse = true;
        break;
      case PRODUCT_IDS.MONITOR:
        types.hasMonitor = true;
        break;
    }
  }

  return types;
}

export function calculateSetBonus(productTypes: {
  hasKeyboard: boolean;
  hasMouse: boolean;
  hasMonitor: boolean;
}) {
  const { hasKeyboard, hasMouse, hasMonitor } = productTypes;
  let bonusPoints = 0;
  const bonusDetails: string[] = [];

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

export function calculateQuantityBonus(totalQuantity: number) {
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

export function calculateTotalPoints(
  finalAmount: number,
  totalQuantity: number,
  cartData: CartItem[],
  getProductById: (id: string) => Product | undefined
) {
  // 1. 기본 포인트 계산
  const basePoints = calculateBasePoints(finalAmount);
  let finalPoints = basePoints;
  const pointsDetails: string[] = [];

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
