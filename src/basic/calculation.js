import { DISCOUNT_THRESHOLDS, DISCOUNT_RATES } from './cart/constants.js';
import {
  PRODUCT_ID_KEYBOARD,
  PRODUCT_ID_MOUSE,
  PRODUCT_ID_MONITOR_ARM,
} from './product/constants.js';
import { BONUS } from './point/constants.js';

function calcItemDiscount(pid, qty) {
  return qty >= DISCOUNT_THRESHOLDS.ITEM ? DISCOUNT_RATES[pid] || 0 : 0;
}

export function calcCartTotals(st, date = new Date()) {
  const cart = st.cartItems;
  const plist = st.productList;

  let subtotal = 0;
  let amount = 0;
  const itemDiscounts = [];

  const itemCnt = cart.reduce((acc, c) => acc + c.qty, 0);

  cart.forEach((ci) => {
    const p = plist.find((x) => x.id === ci.id);
    const itemPrice = p.price * ci.qty;
    subtotal += itemPrice;
    const rate = calcItemDiscount(ci.id, ci.qty);
    if (rate > 0)
      itemDiscounts.push({
        name: p.name,
        discount: rate * 100,
        threshold: DISCOUNT_THRESHOLDS.ITEM,
      });
    amount += itemPrice * (1 - rate);
  });

  let discountRate = subtotal > 0 ? (subtotal - amount) / subtotal : 0;
  let bulkDiscountRate = 0;
  let bulkDiscountThreshold = 0;

  if (itemCnt >= DISCOUNT_THRESHOLDS.BULK) {
    amount = subtotal * (1 - DISCOUNT_RATES.BULK);
    discountRate = DISCOUNT_RATES.BULK;
    bulkDiscountRate = DISCOUNT_RATES.BULK;
    bulkDiscountThreshold = DISCOUNT_THRESHOLDS.BULK;
  }

  const isTue = date.getDay() === 2;
  if (isTue && amount > 0) {
    amount *= 1 - DISCOUNT_RATES.TUESDAY;
    discountRate = 1 - amount / subtotal;
  }

  return {
    itemCnt,
    amount,
    subtotal,
    itemDiscounts,
    discountRate,
    isTue,
    originalTotal: subtotal,
    bulkDiscountRate,
    bulkDiscountThreshold,
  };
}

export function calcBonusPoints(st, date = new Date()) {
  const { amount } = st.totals;
  let base = Math.floor(amount / 1000);
  let pt = base;
  const det = [];

  if (base > 0) det.push(`기본: ${base}p`);
  if (date.getDay() === 2 && base > 0) {
    pt *= BONUS.TUES_DAY_X2;
    det.push('화요일 2배');
  }

  const ids = st.cartItems.map((c) => c.id);
  const hasK = ids.includes(PRODUCT_ID_KEYBOARD),
    hasM = ids.includes(PRODUCT_ID_MOUSE),
    hasA = ids.includes(PRODUCT_ID_MONITOR_ARM);
  if (hasK && hasM) {
    pt += BONUS.SET_KM;
    det.push('키보드+마우스 세트 +50p');
  }
  if (hasK && hasM && hasA) {
    pt += BONUS.SET_FULL;
    det.push('풀세트 구매 +100p');
  }

  const qty = st.totals.itemCnt;
  if (qty >= 30) {
    pt += BONUS.QTY30;
    det.push('대량구매(30개+) +100p');
  } else if (qty >= 20) {
    pt += BONUS.QTY20;
    det.push('대량구매(20개+) +50p');
  } else if (qty >= 10) {
    pt += BONUS.QTY10;
    det.push('대량구매(10개+) +20p');
  }

  return { point: pt, details: det };
}
