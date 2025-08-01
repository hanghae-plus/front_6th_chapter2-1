import { CartItem, LoyaltyPoints } from '../types';
import { POINTS_CONFIG } from '../constants';
import {
  POINTS_THRESHOLDS,
  POINTS_BONUS,
  PRODUCT_IDS,
  DAYS_OF_WEEK,
} from '../constants/businessRules';

export const calculateBasePoints = (totalAmount: number): number => {
  return Math.floor(totalAmount * POINTS_CONFIG.BASE_POINTS_RATE);
};

export const calculateTuesdayBonus = (basePoints: number): number => {
  const today = new Date();
  const isTuesday = today.getDay() === DAYS_OF_WEEK.TUESDAY;

  return isTuesday ? basePoints : 0;
};

export const calculateSetBonus = (items: ReadonlyArray<CartItem>): number => {
  const productIds = items.map((item) => item.product.id);

  // 키보드+마우스+모니터암 풀세트
  if (
    productIds.includes(PRODUCT_IDS.KEYBOARD) &&
    productIds.includes(PRODUCT_IDS.MOUSE) &&
    productIds.includes(PRODUCT_IDS.MONITOR_ARM)
  ) {
    return POINTS_BONUS.FULL_SET;
  }

  // 키보드+마우스 세트
  if (
    productIds.includes(PRODUCT_IDS.KEYBOARD) &&
    productIds.includes(PRODUCT_IDS.MOUSE)
  ) {
    return POINTS_BONUS.KEYBOARD_MOUSE_SET;
  }

  return 0;
};

export const calculateQuantityBonus = (totalQuantity: number): number => {
  if (totalQuantity >= POINTS_THRESHOLDS.BULK_BONUS_QUANTITY_3) {
    return POINTS_BONUS.BULK_BONUS_3;
  }
  if (totalQuantity >= POINTS_THRESHOLDS.BULK_BONUS_QUANTITY_2) {
    return POINTS_BONUS.BULK_BONUS_2;
  }
  if (totalQuantity >= POINTS_THRESHOLDS.BULK_BONUS_QUANTITY_1) {
    return POINTS_BONUS.BULK_BONUS_1;
  }

  return 0;
};

export const calculateAdditionalBonus = (totalAmount: number): number => {
  return Math.floor(totalAmount * POINTS_CONFIG.BONUS_POINTS_RATE);
};

export const calculateLoyaltyPoints = (
  totalAmount: number,
  totalQuantity: number,
  items: ReadonlyArray<CartItem>
): LoyaltyPoints => {
  const basePoints = calculateBasePoints(totalAmount);
  const tuesdayBonus = calculateTuesdayBonus(basePoints);
  const setBonus = calculateSetBonus(items);
  const quantityBonus = calculateQuantityBonus(totalQuantity);
  const additionalBonus = calculateAdditionalBonus(totalAmount);

  const finalPoints =
    basePoints + tuesdayBonus + setBonus + quantityBonus + additionalBonus;

  return {
    finalPoints,
    pointsDetail: {
      basePoints,
      bonusPoints: tuesdayBonus + setBonus + quantityBonus + additionalBonus,
      bulkBonus: quantityBonus,
    },
  };
};
