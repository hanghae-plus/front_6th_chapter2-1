import { POINTS_CONFIG, PRODUCT_IDS } from "../../shared/constants/index.js";

export function calculateBasePoints(totalAmount) {
  return Math.floor(totalAmount / 1000);
}

export function applyTuesdayMultiplier(basePoints, isTuesday) {
  if (!isTuesday || basePoints <= 0) {
    return basePoints;
  }
  return basePoints * POINTS_CONFIG.TUESDAY_MULTIPLIER;
}

export function calculateComboBonus(cartItems, products) {
  let hasKeyboard = false;
  let hasMouse = false;
  let hasMonitorArm = false;
  let bonusPoints = 0;
  const bonusDetails = [];

  for (const cartItem of cartItems) {
    const product = products.find((p) => p.id === cartItem.id);
    if (!product) continue;

    switch (product.id) {
      case PRODUCT_IDS.KEYBOARD:
        hasKeyboard = true;
        break;
      case PRODUCT_IDS.MOUSE:
        hasMouse = true;
        break;
      case PRODUCT_IDS.MONITOR_ARM:
        hasMonitorArm = true;
        break;
    }
  }

  if (hasKeyboard && hasMouse) {
    bonusPoints += POINTS_CONFIG.COMBO_BONUS.KEYBOARD_MOUSE;
    bonusDetails.push(
      `키보드+마우스 세트 +${POINTS_CONFIG.COMBO_BONUS.KEYBOARD_MOUSE}p`
    );
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    bonusPoints += POINTS_CONFIG.COMBO_BONUS.FULL_SET;
    bonusDetails.push(`풀세트 구매 +${POINTS_CONFIG.COMBO_BONUS.FULL_SET}p`);
  }

  return { bonusPoints, bonusDetails };
}

export function calculateQuantityBonus(totalItemCount) {
  let bonusPoints = 0;
  const bonusDetails = [];

  if (totalItemCount >= POINTS_CONFIG.QUANTITY_BONUS.TIER_3.min) {
    bonusPoints = POINTS_CONFIG.QUANTITY_BONUS.TIER_3.points;
    bonusDetails.push(
      `대량구매(${POINTS_CONFIG.QUANTITY_BONUS.TIER_3.min}개+) +${POINTS_CONFIG.QUANTITY_BONUS.TIER_3.points}p`
    );
  } else if (totalItemCount >= POINTS_CONFIG.QUANTITY_BONUS.TIER_2.min) {
    bonusPoints = POINTS_CONFIG.QUANTITY_BONUS.TIER_2.points;
    bonusDetails.push(
      `대량구매(${POINTS_CONFIG.QUANTITY_BONUS.TIER_2.min}개+) +${POINTS_CONFIG.QUANTITY_BONUS.TIER_2.points}p`
    );
  } else if (totalItemCount >= POINTS_CONFIG.QUANTITY_BONUS.TIER_1.min) {
    bonusPoints = POINTS_CONFIG.QUANTITY_BONUS.TIER_1.points;
    bonusDetails.push(
      `대량구매(${POINTS_CONFIG.QUANTITY_BONUS.TIER_1.min}개+) +${POINTS_CONFIG.QUANTITY_BONUS.TIER_1.points}p`
    );
  }

  return { bonusPoints, bonusDetails };
}

export function calculateTotalPoints(
  totalAmount,
  cartItems,
  products,
  totalItemCount
) {
  if (!cartItems.length) {
    return { totalPoints: 0, pointsDetails: [] };
  }

  let finalPoints = 0;
  const pointsDetails = [];

  const basePoints = calculateBasePoints(totalAmount);
  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetails.push(`기본: ${basePoints}p`);
  }

  const today = new Date();
  const isTuesday = today.getDay() === 2;
  if (isTuesday && basePoints > 0) {
    finalPoints = applyTuesdayMultiplier(basePoints, isTuesday);
    pointsDetails.push("화요일 2배");
  }

  const { bonusPoints: comboBonus, bonusDetails: comboDetails } =
    calculateComboBonus(cartItems, products);
  finalPoints += comboBonus;
  pointsDetails.push(...comboDetails);

  const { bonusPoints: quantityBonus, bonusDetails: quantityDetails } =
    calculateQuantityBonus(totalItemCount);
  finalPoints += quantityBonus;
  pointsDetails.push(...quantityDetails);

  return {
    totalPoints: finalPoints,
    pointsDetails,
    basePoints,
    isTuesday,
  };
}
