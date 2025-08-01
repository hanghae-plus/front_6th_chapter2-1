import { CartItem } from '../types/cart';
import { Product } from '../types/product';
import { DISCOUNT_THRESHOLDS, DISCOUNT_RATES, BONUS } from './constants';

function calcItemDiscount(pid: string, qty: number): number {
  if (qty < DISCOUNT_THRESHOLDS.ITEM) return 0;
  const rates: { [key: string]: number } = {
    p1: DISCOUNT_RATES.p1,
    p2: DISCOUNT_RATES.p2,
    p3: DISCOUNT_RATES.p3,
    p4: DISCOUNT_RATES.p4,
    p5: DISCOUNT_RATES.p5,
  };
  return rates[pid] || 0;
}

export function calcCartTotals(
  cartItems: CartItem[],
  productList: Product[],
  date: Date = new Date()
) {
  let subtotal = 0;
  let amount = 0;
  const itemDiscounts: { name: string; discount: number }[] = [];

  const itemCnt = cartItems.reduce((acc, c) => acc + c.quantity, 0);

  cartItems.forEach((ci) => {
    const product = productList.find((p) => p.id === ci.id);
    if (!product) return;

    const itemPrice = product.val * ci.quantity;
    subtotal += itemPrice;
    const rate = calcItemDiscount(ci.id, ci.quantity);
    if (rate > 0)
      itemDiscounts.push({ name: product.name, discount: rate * 100 });
    amount += itemPrice * (1 - rate);
  });

  let discountRate = subtotal > 0 ? (subtotal - amount) / subtotal : 0;
  let originalTotal = subtotal;

  if (itemCnt >= DISCOUNT_THRESHOLDS.BULK) {
    amount = originalTotal * (1 - DISCOUNT_RATES.BULK);
    discountRate = DISCOUNT_RATES.BULK;
  }

  const isTue = date.getDay() === 2;
  if (isTue && amount > 0) {
    amount *= 1 - DISCOUNT_RATES.TUESDAY;
    discountRate = 1 - amount / originalTotal;
  }

  return {
    itemCnt,
    amount,
    subtotal,
    itemDiscounts,
    discountRate,
    isTue,
    originalTotal,
  };
}

export function calcBonusPoints(
  cartItems: CartItem[],
  productList: Product[],
  date: Date = new Date()
) {
  const { amount, itemCnt } = calcCartTotals(cartItems, productList, date);
  let base = Math.floor(amount / 1000);
  let pt = base;
  const det: string[] = [];

  if (base > 0) det.push(`기본: ${base}p`);
  if (date.getDay() === 2 && base > 0) {
    pt *= BONUS.TUES_DAY_X2;
    det.push('화요일 2배');
  }

  const ids = cartItems.map((c) => c.id);
  const hasK = ids.includes('p1'),
    hasM = ids.includes('p2'),
    hasA = ids.includes('p3');
  if (hasK && hasM) {
    pt += BONUS.SET_KM;
    det.push('키보드+마우스 세트 +50p');
  }
  if (hasK && hasM && hasA) {
    pt += BONUS.SET_FULL;
    det.push('풀세트 구매 +100p');
  }

  if (itemCnt >= 30) {
    pt += BONUS.QTY30;
    det.push('대량구매(30개+) +100p');
  } else if (itemCnt >= 20) {
    pt += BONUS.QTY20;
    det.push('대량구매(20개+) +50p');
  } else if (itemCnt >= 10) {
    pt += BONUS.QTY10;
    det.push('대량구매(10개+) +20p');
  }

  return { point: pt, details: det };
}
