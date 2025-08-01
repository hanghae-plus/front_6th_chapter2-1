import {
  PRODUCT_KEYBOARD,
  PRODUCT_MOUSE,
  PRODUCT_MONITOR_ARM,
  PRODUCT_LAPTOP_POUCH,
  PRODUCT_SPEAKER,
  PRODUCT_DEFAULT_DISCOUNT_RATES,
} from '../constants/constants';
import { Product, CartItem } from '../types';

export const getIndividualDiscount = (
  productId: string,
  quantity: number,
): number => {
  if (quantity < 10) return 0;

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
};

export const calculateCartTotals = (
  cartItems: CartItem[],
  products: Product[],
) => {
  const productMap = new Map(products.map((p) => [p.id, p]));
  let subtotal = 0;
  let totalAfterIndividualDiscounts = 0;
  let itemCount = 0;
  const itemDiscounts: Array<{ name: string; discount: number }> = [];

  // 개별 상품 할인 계산
  for (const item of cartItems) {
    const product = productMap.get(item.id);
    if (!product) continue;

    const itemTotal = product.val * item.quantity;
    subtotal += itemTotal;
    itemCount += item.quantity;

    const discountRate = getIndividualDiscount(product.id, item.quantity);
    if (discountRate > 0) {
      itemDiscounts.push({
        name: product.name,
        discount: discountRate * 100,
      });
    }

    totalAfterIndividualDiscounts += itemTotal * (1 - discountRate);
  }

  // 대량구매 할인 (30개 이상 25%)
  let finalTotal = totalAfterIndividualDiscounts;
  let bulkDiscountRate = 0;

  if (itemCount >= 30) {
    finalTotal = subtotal * 0.75; // 25% 할인
    bulkDiscountRate = 0.25;
  }

  // 화요일 할인 (10% 추가)
  const isTuesday = new Date().getDay() === 2;
  if (isTuesday && finalTotal > 0) {
    finalTotal *= 0.9;
  }

  const totalDiscountRate = finalTotal > 0 ? 1 - finalTotal / subtotal : 0;
  const savedAmount = subtotal - finalTotal;

  return {
    subtotal,
    finalTotal,
    itemCount,
    totalDiscountRate,
    savedAmount,
    itemDiscounts,
    bulkDiscountRate,
    isTuesday,
  };
};
