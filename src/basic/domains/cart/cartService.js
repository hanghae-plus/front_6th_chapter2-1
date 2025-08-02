import {
  PRODUCT_IDS,
  DISCOUNT_RATES,
  QUANTITY_THRESHOLDS,
  MAGIC_NUMBERS,
} from "../../shared/constants/index.js";

export function calculateItemDiscount(productId, quantity) {
  if (quantity < QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT) {
    return 0;
  }

  const discountRates = {
    [PRODUCT_IDS.KEYBOARD]: DISCOUNT_RATES.INDIVIDUAL.KEYBOARD,
    [PRODUCT_IDS.MOUSE]: DISCOUNT_RATES.INDIVIDUAL.MOUSE,
    [PRODUCT_IDS.MONITOR_ARM]: DISCOUNT_RATES.INDIVIDUAL.MONITOR_ARM,
    [PRODUCT_IDS.LAPTOP_POUCH]: DISCOUNT_RATES.INDIVIDUAL.LAPTOP_POUCH,
    [PRODUCT_IDS.SPEAKER]: DISCOUNT_RATES.INDIVIDUAL.SPEAKER,
  };

  return discountRates[productId] || 0;
}



export function applyTuesdayDiscount(total, isTuesday) {
  if (!isTuesday || total <= 0) {
    return total;
  }

  return total * (1 - DISCOUNT_RATES.TUESDAY);
}



