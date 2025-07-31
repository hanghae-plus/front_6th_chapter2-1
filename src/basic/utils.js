import {
  PRODUCT_KEYBOARD,
  PRODUCT_MOUSE,
  PRODUCT_MONITOR_ARM,
  PRODUCT_LAPTOP_POUCH,
  PRODUCT_SPEAKER,
  QUANTITY_THRESHOLDS,
  POINT_RATES_BULK_BONUS,
  PRODUCT_DEFAULT_DISCOUNT_RATES,
} from './constants';

function isTuesday() {
  return new Date().getDay() === 2;
}

function getProductDiscountRate(productId) {
  switch (productId) {
    case PRODUCT_KEYBOARD:
      return PRODUCT_DEFAULT_DISCOUNT_RATES.KEYBOARD;
    case PRODUCT_MOUSE:
      return PRODUCT_DEFAULT_DISCOUNT_RATES.MOUSE;
    case PRODUCT_MONITOR_ARM:
      return PRODUCT_DEFAULT_DISCOUNT_RATES.MONITOR_ARM;
    case PRODUCT_LAPTOP_POUCH:
      return PRODUCT_DEFAULT_DISCOUNT_RATES.LAPTOP_POUCH;
    case PRODUCT_SPEAKER:
      return PRODUCT_DEFAULT_DISCOUNT_RATES.SPEAKER;
    default:
      return 0;
  }
}

function getBonusPerBulkInfo(itemCount) {
  if (itemCount >= QUANTITY_THRESHOLDS.BONUS_LARGE) {
    return {
      points: POINT_RATES_BULK_BONUS.LARGE,
      threshold: QUANTITY_THRESHOLDS.BONUS_LARGE,
    };
  }
  if (itemCount >= QUANTITY_THRESHOLDS.BONUS_MEDIUM) {
    return {
      points: POINT_RATES_BULK_BONUS.MEDIUM,
      threshold: QUANTITY_THRESHOLDS.BONUS_MEDIUM,
    };
  }
  if (itemCount >= QUANTITY_THRESHOLDS.BONUS_SMALL) {
    return {
      points: POINT_RATES_BULK_BONUS.SMALL,
      threshold: QUANTITY_THRESHOLDS.BONUS_SMALL,
    };
  }
  return null;
}

export { isTuesday, getProductDiscountRate, getBonusPerBulkInfo };
