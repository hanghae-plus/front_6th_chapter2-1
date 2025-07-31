import { Product, CartItem } from '../types';
import {
  DISCOUNT_RATES,
  QUANTITY_THRESHOLDS,
  PRICE_CONFIG,
  WEEKDAYS,
} from '../constants/config';
import {
  PRODUCT_ONE,
  PRODUCT_TWO,
  PRODUCT_THREE,
  PRODUCT_FOUR,
  PRODUCT_FIVE,
} from '../constants/products';

// ==========================================
// 할인 계산 서비스 💰
// ==========================================

// 할인 계산
const PRODUCT_BULK_DISCOUNT_MAP: Record<string, number> = {
  [PRODUCT_ONE]: DISCOUNT_RATES.PRODUCT_BULK_DISCOUNTS.KEYBOARD,
  [PRODUCT_TWO]: DISCOUNT_RATES.PRODUCT_BULK_DISCOUNTS.MOUSE,
  [PRODUCT_THREE]: DISCOUNT_RATES.PRODUCT_BULK_DISCOUNTS.MONITOR_ARM,
  [PRODUCT_FOUR]: DISCOUNT_RATES.PRODUCT_BULK_DISCOUNTS.LAPTOP_POUCH,
  [PRODUCT_FIVE]: DISCOUNT_RATES.PRODUCT_BULK_DISCOUNTS.SPEAKER,
};

export interface CartItemWithQuantity {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface CartTotals {
  items: CartItemWithQuantity[];
  totalAmount: number;
  itemCount: number;
  subtotal: number;
  itemDiscounts: Array<{ name: string; discount: number }>;
}

export interface DiscountResult {
  finalAmount: number;
  discountRate: number;
  originalTotal: number;
}

/**
 * 개별 상품 할인 계산 (10개 이상)
 */
export function calculateItemDiscount(item: CartItemWithQuantity): number {
  if (item.quantity < QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT_MINIMUM) {
    return 0;
  }

  return PRODUCT_BULK_DISCOUNT_MAP[item.product.id] || 0;
}

/**
 * 장바구니 아이템별 계산
 */
export function calculateCartTotals(cartItems: CartItem[]): CartTotals {
  const items: CartItemWithQuantity[] = cartItems.map((item) => ({
    product: item,
    quantity: item.cartQuantity || 1,
    subtotal: item.price * (item.cartQuantity || 1),
  }));

  let totalAmount = 0;
  let itemCount = 0;
  let subtotal = 0;
  const itemDiscounts: Array<{ name: string; discount: number }> = [];

  items.forEach((item) => {
    const discount = calculateItemDiscount(item);
    const discountedTotal = item.subtotal * (1 - discount);

    if (discount > 0) {
      itemDiscounts.push({
        name: item.product.name,
        discount: discount * 100,
      });
    }

    totalAmount += discountedTotal;
    itemCount += item.quantity;
    subtotal += item.subtotal;
  });

  return {
    items,
    totalAmount,
    itemCount,
    subtotal,
    itemDiscounts,
  };
}

/**
 * 대량 구매 할인 적용 (30개 이상)
 */
export function applyBulkDiscount(cartTotals: CartTotals): DiscountResult {
  if (cartTotals.itemCount < QUANTITY_THRESHOLDS.BULK_DISCOUNT_MINIMUM) {
    return {
      finalAmount: cartTotals.totalAmount,
      discountRate:
        (cartTotals.subtotal - cartTotals.totalAmount) / cartTotals.subtotal,
      originalTotal: cartTotals.subtotal,
    };
  }

  const bulkDiscountedAmount =
    cartTotals.subtotal * PRICE_CONFIG.BULK_DISCOUNT_MULTIPLIER;

  return {
    finalAmount: bulkDiscountedAmount,
    discountRate: DISCOUNT_RATES.BULK_DISCOUNT_30_PLUS,
    originalTotal: cartTotals.subtotal,
  };
}

/**
 * 화요일 특별 할인 적용
 */
export function applyTuesdayDiscount(
  amount: number,
  originalTotal: number
): DiscountResult {
  const today = new Date();
  const isTuesday = today.getDay() === WEEKDAYS.TUESDAY;

  if (isTuesday && amount > 0) {
    const finalAmount = amount * PRICE_CONFIG.TUESDAY_MULTIPLIER;
    const discountRate = 1 - finalAmount / originalTotal;

    return {
      finalAmount,
      discountRate,
      originalTotal,
    };
  }

  return {
    finalAmount: amount,
    discountRate: 1 - amount / originalTotal,
    originalTotal,
  };
}
