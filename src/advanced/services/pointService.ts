import { Cart, PointInfo } from "../types";
import { POINT_RATES, PRODUCT_IDS } from "../constants";

export const calculateBasePoints = (totalAmount: number): number => {
  return Math.floor(totalAmount * POINT_RATES.BASE_RATE);
};

export const calculateTuesdayBonus = (basePoints: number): number => {
  const today = new Date();
  if (today.getDay() === 2) {
    // 화요일
    return basePoints * (POINT_RATES.TUESDAY_MULTIPLIER - 1);
  }
  return 0;
};

export const calculateSetBonus = (cartItems: Cart[]): number => {
  const hasKeyboard = cartItems.some(item => item.product.id === PRODUCT_IDS.KEYBOARD);
  const hasMouse = cartItems.some(item => item.product.id === PRODUCT_IDS.MOUSE);
  const hasMonitorArm = cartItems.some(item => item.product.id === PRODUCT_IDS.MONITOR_ARM);

  let bonus = 0;

  // 키보드 + 마우스 세트 보너스
  if (hasKeyboard && hasMouse) {
    bonus += POINT_RATES.KEYBOARD_MOUSE_BONUS;
  }

  // 풀세트 보너스
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    bonus += POINT_RATES.FULL_SET_BONUS;
  }

  return bonus;
};

export const calculateQuantityBonus = (totalQuantity: number): number => {
  if (totalQuantity >= 30) {
    return POINT_RATES.QUANTITY_BONUS[30];
  } else if (totalQuantity >= 20) {
    return POINT_RATES.QUANTITY_BONUS[20];
  } else if (totalQuantity >= 10) {
    return POINT_RATES.QUANTITY_BONUS[10];
  }
  return 0;
};

export const calculateTotalPoints = (totalAmount: number, cartItems: Cart[]): PointInfo => {
  const basePoints = calculateBasePoints(totalAmount);
  const tuesdayBonus = calculateTuesdayBonus(basePoints);
  const setBonus = calculateSetBonus(cartItems);
  const quantityBonus = calculateQuantityBonus(cartItems.reduce((sum, item) => sum + item.quantity, 0));

  const bonusPoints = tuesdayBonus + setBonus + quantityBonus;
  const totalPoints = basePoints + bonusPoints;

  const details: string[] = [];

  if (basePoints > 0) {
    details.push(`기본: ${basePoints}p`);
  }

  if (tuesdayBonus > 0) {
    details.push("화요일 2배");
  }

  if (setBonus > 0) {
    if (setBonus >= POINT_RATES.FULL_SET_BONUS) {
      details.push("풀세트 구매 +100p");
    } else {
      details.push("키보드+마우스 세트 +50p");
    }
  }

  if (quantityBonus > 0) {
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    if (totalQuantity >= 30) {
      details.push("대량구매(30개+) +100p");
    } else if (totalQuantity >= 20) {
      details.push("대량구매(20개+) +50p");
    } else {
      details.push("대량구매(10개+) +20p");
    }
  }

  return {
    basePoints,
    bonusPoints,
    totalPoints,
    details,
  };
};
