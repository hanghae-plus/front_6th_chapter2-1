import type { CartItem, OrderSummaryResult } from '../types/order/orderSummary';
import type { Product } from '../types/product';
import { DISCOUNT_RATES, POINT_RATES } from './constants';

// 상품별 합계 및 개별상품 할인 계산
const getCartSummary = (products: Product[], cartItems: CartItem[]) => {
  const itemCnt = cartItems.reduce((sum, { quantity }) => sum + quantity, 0);
  const isBulk = itemCnt >= DISCOUNT_RATES.BULK_PURCHASE_THRESHOLD;
  let subTot = 0;
  let totalAmt = 0;
  const itemDiscounts: { name: string; discount: number }[] = [];

  cartItems.forEach(({ productId, quantity }) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const itemTot = product.discountPrice * quantity;
    let disc = 0;
    subTot += itemTot;
    if (!isBulk && quantity >= DISCOUNT_RATES.ITEM_DISCOUNT_THRESHOLD && product.discountRate) {
      disc = product.discountRate;
      if (disc > 0) {
        itemDiscounts.push({ name: product.name, discount: Math.round(disc * 100) });
      }
    }
    totalAmt += itemTot * (1 - disc);
  });
  return { subTot, itemDiscounts, totalAmt, itemCnt };
};

// 대량구매/화요일 할인 계산
const getTotalDiscount = (subTot: number, totalAmt: number, itemCnt: number, today: Date) => {
  const originalTotal = subTot;
  let discRate = 0;
  let tuesdayApplied = false;
  let finalTotal = totalAmt;
  if (itemCnt >= DISCOUNT_RATES.BULK_PURCHASE_THRESHOLD) {
    finalTotal = subTot * (1 - DISCOUNT_RATES.BULK_PURCHASE_RATE);
    discRate = DISCOUNT_RATES.BULK_PURCHASE_RATE;
  } else {
    discRate = subTot > 0 ? (subTot - totalAmt) / subTot : 0;
  }
  const isTuesday = today.getDay() === DISCOUNT_RATES.TUESDAY_DAY;
  if (isTuesday && finalTotal > 0) {
    const tuesdayDiscount = finalTotal * DISCOUNT_RATES.TUESDAY_SPECIAL_RATE;
    finalTotal -= tuesdayDiscount;
    discRate = 1 - finalTotal / originalTotal;
    tuesdayApplied = true;
  }
  return { finalTotal, discRate, tuesdayApplied, originalTotal };
};

export const calculateOrderSummary = (products: Product[], cartItems: CartItem[]): OrderSummaryResult => {
  const today = new Date();
  const { subTot, itemDiscounts, totalAmt, itemCnt } = getCartSummary(products, cartItems);
  const { finalTotal, discRate, tuesdayApplied, originalTotal } = getTotalDiscount(subTot, totalAmt, itemCnt, today);

  // 포인트 정책별 상세 정보
  const basePoints = Math.floor(finalTotal * POINT_RATES.BASE_POINT_RATE);
  let points = 0;
  const pointDetails: string[] = [];
  const hasKeyboard = cartItems.some(({ productId }) =>
    products.find((p) => p.id === productId && p.id === 'keyboard')
  );
  const hasMouse = cartItems.some(({ productId }) => products.find((p) => p.id === productId && p.id === 'mouse'));
  const hasMonitorArm = cartItems.some(({ productId }) =>
    products.find((p) => p.id === productId && p.id === 'monitor-arm')
  );

  if (basePoints > 0) {
    points = basePoints;
    pointDetails.push(`기본: ${basePoints}p`);
  }
  if (today.getDay() === DISCOUNT_RATES.TUESDAY_DAY && basePoints > 0) {
    points = basePoints * POINT_RATES.TUESDAY_BONUS_MULTIPLIER;
    pointDetails.push('화요일 2배');
  }
  if (hasKeyboard && hasMouse) {
    points += POINT_RATES.COMBO_BONUS.KEYBOARD_MOUSE;
    pointDetails.push(`키보드+마우스 세트 +${POINT_RATES.COMBO_BONUS.KEYBOARD_MOUSE}p`);
  }
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    points += POINT_RATES.COMBO_BONUS.FULL_SET;
    pointDetails.push(`풀세트 구매 +${POINT_RATES.COMBO_BONUS.FULL_SET}p`);
  }
  if (itemCnt >= 30) {
    points += POINT_RATES.QUANTITY_BONUS.TIER_3;
    pointDetails.push(`대량구매(30개+) +${POINT_RATES.QUANTITY_BONUS.TIER_3}p`);
  } else if (itemCnt >= 20) {
    points += POINT_RATES.QUANTITY_BONUS.TIER_2;
    pointDetails.push(`대량구매(20개+) +${POINT_RATES.QUANTITY_BONUS.TIER_2}p`);
  } else if (itemCnt >= 10) {
    points += POINT_RATES.QUANTITY_BONUS.TIER_1;
    pointDetails.push(`대량구매(10개+) +${POINT_RATES.QUANTITY_BONUS.TIER_1}p`);
  }

  return {
    itemCnt,
    subTot,
    totalAmt: finalTotal,
    discRate,
    savedAmount: originalTotal - finalTotal,
    itemDiscounts,
    isTuesday: tuesdayApplied,
    stockMsg: '',
    points,
    pointDetails: pointDetails.join(', '),
  };
};
