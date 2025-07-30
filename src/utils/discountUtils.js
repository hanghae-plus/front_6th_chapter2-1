import {
  QUANTITY_THRESHOLDS,
  DISCOUNT_RATES,
} from '../constants/shopPolicy.js';

export function calculateDiscounts(
  subTot,
  totalAmt,
  itemCnt,
  isTuesday = null
) {
  const originalTotal = subTot;

  // 화요일 여부를 파라미터로 받거나 현재 날짜로 체크
  const isTuesdayActual =
    isTuesday !== null ? isTuesday : new Date().getDay() === 2;

  // 대량구매 할인 적용
  const { finalTotal: bulkDiscountedTotal, discRate: bulkDiscRate } =
    itemCnt >= QUANTITY_THRESHOLDS.BONUS_LARGE
      ? {
          finalTotal: subTot * (1 - DISCOUNT_RATES.BULK),
          discRate: DISCOUNT_RATES.BULK,
        }
      : { finalTotal: totalAmt, discRate: (subTot - totalAmt) / subTot };

  // 화요일 특가 추가 적용
  const finalTotal =
    isTuesdayActual && bulkDiscountedTotal > 0
      ? bulkDiscountedTotal * (1 - DISCOUNT_RATES.TUESDAY)
      : bulkDiscountedTotal;

  const discRate =
    isTuesdayActual && finalTotal !== bulkDiscountedTotal
      ? 1 - finalTotal / originalTotal
      : bulkDiscRate;

  return { discRate, originalTotal, finalTotal, isTuesday: isTuesdayActual };
}
