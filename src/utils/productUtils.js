import {
  KEYBOARD_ID,
  MOUSE_ID,
  MONITOR_ID,
  HEADPHONE_ID,
  SPEAKER_ID,
} from '../constants/productId.js';
import {
  QUANTITY_THRESHOLDS,
  DISCOUNT_RATES,
  POINT_RATES,
} from '../constants/shopPolicy.js';

export function getProductDiscount(productId) {
  const discountMap = {
    [KEYBOARD_ID]: DISCOUNT_RATES.PRODUCT.KEYBOARD,
    [MOUSE_ID]: DISCOUNT_RATES.PRODUCT.MOUSE,
    [MONITOR_ID]: DISCOUNT_RATES.PRODUCT.MONITOR_ARM,
    [HEADPHONE_ID]: DISCOUNT_RATES.PRODUCT.LAPTOP_POUCH,
    [SPEAKER_ID]: DISCOUNT_RATES.PRODUCT.SPEAKER,
  };
  return discountMap[productId] || 0;
}

export function getBulkBonus(itemCount) {
  if (itemCount >= QUANTITY_THRESHOLDS.BONUS_LARGE) {
    return {
      points: POINT_RATES.BULK_BONUS.LARGE,
      threshold: QUANTITY_THRESHOLDS.BONUS_LARGE,
    };
  } else if (itemCount >= QUANTITY_THRESHOLDS.BONUS_MEDIUM) {
    return {
      points: POINT_RATES.BULK_BONUS.MEDIUM,
      threshold: QUANTITY_THRESHOLDS.BONUS_MEDIUM,
    };
  } else if (itemCount >= QUANTITY_THRESHOLDS.BONUS_SMALL) {
    return {
      points: POINT_RATES.BULK_BONUS.SMALL,
      threshold: QUANTITY_THRESHOLDS.BONUS_SMALL,
    };
  }
  return null;
}

export function getQuantityFromElement(element) {
  return parseInt(element.textContent) || 0;
}

export function findProductById(productList, productId) {
  return productList.find((product) => product.id === productId);
}
