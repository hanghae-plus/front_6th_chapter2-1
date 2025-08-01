import {
  QUANTITY_THRESHOLDS,
  DISCOUNT_RATES,
  TUESDAY,
  PRODUCT_IDS,
} from '../../../shared/constants';

export function getProductDiscount(
  productId: string,
  quantity: number
): number {
  if (quantity < QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT) {
    return 0;
  }

  const discountRates = {
    [PRODUCT_IDS.KEYBOARD]: DISCOUNT_RATES.PRODUCT.KEYBOARD,
    [PRODUCT_IDS.MOUSE]: DISCOUNT_RATES.PRODUCT.MOUSE,
    [PRODUCT_IDS.MONITOR]: DISCOUNT_RATES.PRODUCT.MONITOR_ARM,
    [PRODUCT_IDS.HEADPHONE]: DISCOUNT_RATES.PRODUCT.LAPTOP_POUCH,
    [PRODUCT_IDS.SPEAKER]: DISCOUNT_RATES.PRODUCT.SPEAKER,
  };

  return discountRates[productId] || 0;
}

export function applyBulkDiscounts(
  subtotal: number,
  discountedTotal: number,
  totalQuantity: number
) {
  let finalAmount: number;
  let additionalDiscountRate = 0;

  // 대량구매 할인 (30개 이상)
  if (totalQuantity >= QUANTITY_THRESHOLDS.BONUS_LARGE) {
    additionalDiscountRate = DISCOUNT_RATES.BULK;
    finalAmount = subtotal * (1 - additionalDiscountRate);
  } else {
    finalAmount = discountedTotal;
  }

  // 화요일 추가 할인
  const today = new Date();
  const isTuesdayToday = today.getDay() === TUESDAY;

  if (isTuesdayToday) {
    additionalDiscountRate += DISCOUNT_RATES.TUESDAY;
    finalAmount = finalAmount * (1 - DISCOUNT_RATES.TUESDAY);
  }

  return {
    finalAmount: Math.floor(finalAmount),
    totalDiscountRate: additionalDiscountRate,
    isTuesdayToday,
  };
}
