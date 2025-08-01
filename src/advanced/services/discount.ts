// services/discount.ts
import { PRODUCT_IDS, DISCOUNT_RATES, THRESHOLDS } from '../constants/index.js';
import type { ItemDiscount, Product } from '../types/index.js';

export function calculateItemDiscount(productId: string, quantity: number): number {
  if (quantity < THRESHOLDS.MIN_QUANTITY_FOR_DISCOUNT) return 0;

  const discountMap: Record<string, number> = {
    [PRODUCT_IDS.KEYBOARD]: DISCOUNT_RATES.KEYBOARD,
    [PRODUCT_IDS.MOUSE]: DISCOUNT_RATES.MOUSE,
    [PRODUCT_IDS.MONITOR_ARM]: DISCOUNT_RATES.MONITOR_ARM,
    [PRODUCT_IDS.LAPTOP_POUCH]: DISCOUNT_RATES.LAPTOP_POUCH,
    [PRODUCT_IDS.SPEAKER]: DISCOUNT_RATES.SPEAKER,
  };

  return discountMap[productId] || 0;
}

export function calculateTotalWithDiscounts(cartItems: Record<string, number>, products: Product[]) {
  let subtotal = 0;
  let totalWithItemDiscounts = 0;
  let itemDiscounts: ItemDiscount[] = [];
  let totalQuantity = 0;

  Object.entries(cartItems).forEach(([productId, quantity]) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    totalQuantity += quantity;
    const itemTotal = product.price * quantity;
    subtotal += itemTotal;

    const discountRate = calculateItemDiscount(productId, quantity);
    if (discountRate > 0) {
      itemDiscounts.push({ name: product.name, discount: discountRate * 100 });
      totalWithItemDiscounts += itemTotal * (1 - discountRate);
    } else {
      totalWithItemDiscounts += itemTotal;
    }
  });

  return { subtotal, totalWithItemDiscounts, itemDiscounts, totalQuantity };
}

export function applyBulkDiscount(amount: number, totalQuantity: number): number {
  if (totalQuantity >= THRESHOLDS.MIN_QUANTITY_FOR_BULK) {
    return amount * (1 - DISCOUNT_RATES.BULK);
  }
  return amount;
}

export function applyTuesdayDiscount(amount: number): number {
  const isTuesday = new Date().getDay() === 2;
  if (isTuesday && amount > 0) {
    return amount * (1 - DISCOUNT_RATES.TUESDAY);
  }
  return amount;
}

export function calculateFinalAmount(cartItems: Record<string, number>, products: Product[]) {
  let totalAmount = 0;
  let totalQuantity = 0;
  let subtotal = 0;

  // 각 아이템별 계산
  Object.entries(cartItems).forEach(([productId, quantity]) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    totalQuantity += quantity;
    const itemTotal = product.price * quantity;
    subtotal += itemTotal;

    // 개별 할인 적용
    const discountRate = calculateItemDiscount(productId, quantity);
    totalAmount += itemTotal * (1 - discountRate);
  });

  // 대량 구매 할인
  if (totalQuantity >= THRESHOLDS.MIN_QUANTITY_FOR_BULK) {
    totalAmount = subtotal * (1 - DISCOUNT_RATES.BULK);
  }

  // 화요일 할인
  totalAmount = applyTuesdayDiscount(totalAmount);

  return { totalAmount, totalQuantity, subtotal };
}