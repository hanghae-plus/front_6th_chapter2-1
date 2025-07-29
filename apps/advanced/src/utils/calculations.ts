import { DISCOUNT_POLICIES } from '../constants/discountPolicies';
import { POINTS_POLICIES } from '../constants/pointsPolicies';
import { CartItem } from '../types/cart.types';
import { DiscountPolicy, PointsPolicy } from '../types/promotion.types';
import { calculateTotalDiscount } from './discounts';
import { calculateTotalPointsEarned } from './points';

export const calculateItemSubtotal = (item: CartItem): number =>
  item.product.price * item.quantity;

export const calculateItemDiscount = (item: CartItem): number =>
  calculateItemSubtotal(item) * (item.discount / 100);

export const calculateItemPoints = (item: CartItem): number =>
  Math.floor(calculateItemSubtotal(item) * 0.001);

export const calculateCartTotals = (items: CartItem[]) => {
  const calculations = {
    subtotal: () =>
      items.reduce((sum, item) => sum + calculateItemSubtotal(item), 0),
    discount: () =>
      items.reduce((sum, item) => sum + calculateItemDiscount(item), 0),
    points: () =>
      items.reduce((sum, item) => sum + calculateItemPoints(item), 0),
    itemCount: () => items.reduce((sum, item) => sum + item.quantity, 0)
  };

  const subtotal = calculations.subtotal();
  const discount = calculations.discount();

  return {
    subtotal,
    discount,
    total: subtotal - discount,
    points: calculations.points(),
    itemCount: calculations.itemCount()
  };
};

export const calculateDiscount = (
  totalAmount: number,
  policies: DiscountPolicy[] = DISCOUNT_POLICIES
): number => calculateTotalDiscount(totalAmount, policies);

export const calculatePoints = (
  totalAmount: number,
  policies: PointsPolicy[] = POINTS_POLICIES
): number => calculateTotalPointsEarned(totalAmount, policies);

export const calculateTax = (amount: number, taxRate: number = 0.1): number =>
  Math.floor(amount * taxRate);

export const calculateShippingCost = (
  subtotal: number,
  freeShippingThreshold: number = 50000,
  shippingCost: number = 3000
): number => (subtotal >= freeShippingThreshold ? 0 : shippingCost);

export const calculateFinalAmount = (
  subtotal: number,
  discount: number = 0,
  tax: number = 0,
  shipping: number = 0
): number => subtotal - discount + tax + shipping;
