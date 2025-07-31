import { CALCULATION_CONSTANTS, DISCOUNT_RATES, QUANTITY_THRESHOLDS } from '../utils/constants.js';
import { calculateBonusPoints } from './useBonusPoints.js';

// 카트 내 각 상품별 합계 및 할인 계산
function calculateCartItemTotals(products, cartItems) {
  let subTot = 0;
  const itemDiscounts = [];
  let totalAmt = 0;
  let itemCnt = 0;
  Array.from(cartItems).forEach((cartItem) => {
    const curItem = products.find((p) => p.id === cartItem.id);
    if (!curItem) return;
    const qtyElem = cartItem.querySelector('.quantity-number');
    const q = parseInt(qtyElem.textContent);
    const itemTot = curItem.discountPrice * q;
    let disc = 0;
    itemCnt += q;
    subTot += itemTot;
    if (q >= QUANTITY_THRESHOLDS.ITEM_DISCOUNT && curItem.discountRate) {
      disc = curItem.discountRate;
      if (disc > 0) {
        itemDiscounts.push({ name: curItem.name, discount: disc * CALCULATION_CONSTANTS.PERCENTAGE_MULTIPLIER });
      }
    }
    totalAmt += itemTot * (1 - disc);
  });
  return { subTot, itemDiscounts, totalAmt, itemCnt };
}

// 대량구매/화요일 할인 계산
function calculateTotalDiscount(subTot, totalAmt, itemCnt, today) {
  const originalTotal = subTot;
  let discRate = 0;
  let tuesdayApplied = false;
  if (itemCnt >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
    totalAmt = subTot * (1 - DISCOUNT_RATES.BULK_PURCHASE_RATE);
    discRate = DISCOUNT_RATES.BULK_PURCHASE_RATE;
  } else {
    discRate = subTot > 0 ? (subTot - totalAmt) / subTot : 0;
  }
  const isTuesday = today.getDay() === DISCOUNT_RATES.TUESDAY_DAY;
  if (isTuesday && totalAmt > 0) {
    const tuesdayDiscount = totalAmt * DISCOUNT_RATES.TUESDAY_SPECIAL_RATE;
    totalAmt = totalAmt - tuesdayDiscount;
    discRate = 1 - totalAmt / originalTotal;
    tuesdayApplied = true;
  }
  return { finalTotal: totalAmt, discRate, tuesdayApplied, originalTotal };
}

import { getStockInfoMessage } from './useStockInfo.js';

// 장바구니 요약 계산: 합계, 할인, 포인트, 재고 메시지 등 모든 비즈니스 계산을 순수 함수로 처리
export function calculateCartSummary(products, cartItems, today = new Date()) {
  const { subTot, itemDiscounts, totalAmt, itemCnt } = calculateCartItemTotals(products, cartItems);
  const { finalTotal, discRate, tuesdayApplied, originalTotal } = calculateTotalDiscount(
    subTot,
    totalAmt,
    itemCnt,
    today
  );
  const { points, details } = calculateBonusPoints({
    cartItems,
    products,
    itemCnt,
    totalAmt: finalTotal,
  });
  const stockMsg = getStockInfoMessage(products);
  return {
    itemCnt,
    subTot,
    totalAmt: finalTotal,
    discRate,
    savedAmount: originalTotal - finalTotal,
    itemDiscounts,
    isTuesday: tuesdayApplied,
    stockMsg,
    points,
    pointDetails: details,
  };
}
