import type {
  CartItem,
  Product,
  CartSummary,
  CartCalculation,
  DiscountInfo,
} from '../../../shared/types';
import {
  getProductDiscount,
  applyBulkDiscounts,
} from '../../order/services/DiscountService';

export function calculateCartSummary(
  cartItems: CartItem[],
  getProductById: (id: string) => Product | undefined
): CartSummary {
  let subtotal = 0;
  let totalQuantity = 0;
  let discountedTotal = 0;
  const individualDiscountInfo: DiscountInfo[] = [];

  for (const item of cartItems) {
    const product = getProductById(item.id);
    if (!product) continue;

    const quantity = item.quantity;
    const itemSubtotal = product.price * quantity;

    totalQuantity += quantity;
    subtotal += itemSubtotal;

    const discountRate = getProductDiscount(product.id, quantity);
    if (discountRate > 0) {
      individualDiscountInfo.push({
        name: product.name,
        discountPercent: discountRate * 100,
      });
    }

    discountedTotal += itemSubtotal * (1 - discountRate);
  }

  return {
    subtotal,
    totalQuantity,
    discountedTotal,
    individualDiscountInfo,
  };
}

export function calculateCart(
  cartItems: CartItem[],
  getProductById: (id: string) => Product | undefined
): CartCalculation {
  const cartSummary = calculateCartSummary(cartItems, getProductById);
  const { subtotal, totalQuantity, discountedTotal, individualDiscountInfo } =
    cartSummary;

  const bulkDiscounts = applyBulkDiscounts(
    subtotal,
    discountedTotal,
    totalQuantity
  );
  const { finalAmount, totalDiscountRate, isTuesdayToday } = bulkDiscounts;

  return {
    subtotal,
    finalAmount,
    totalQuantity,
    totalDiscountRate,
    isTuesdayToday,
    individualDiscountInfo,
  };
}

export function isCartEmpty(cartItems: CartItem[]): boolean {
  return !cartItems || cartItems.length === 0;
}
