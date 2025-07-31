import { CartItem, ItemDiscountResult, CartTotalCalculation } from 'types';
import { getItemDiscount, isTuesday } from './getItemDiscount';
import { getLoyaltyPoints } from './loyaltyPoints';

const DISCOUNT_THRESHOLDS = {
  BULK_DISCOUNT_MIN: 30, // 벌크 할인 최소 수량
  BULK_DISCOUNT_RATE: 0.25, // 벌크 할인율 25%
  TUESDAY_DISCOUNT_RATE: 0.1, // 화요일 할인율 10%
} as const;

/**
 * 소계 계산
 * 개별 상품 할인 적용 전의 총 금액을 계산
 */
export const getSubtotal = (itemResults: ItemDiscountResult[]): number => {
  return itemResults.reduce((sum, result) => sum + result.itemTotal, 0);
};

/**
 * 총 수량 계산
 * 장바구니의 모든 상품 수량을 합산
 */
export const getTotalQuantity = (itemResults: ItemDiscountResult[]): number => {
  return itemResults.reduce((sum, result) => sum + result.quantity, 0);
};

/**
 * 개별 할인 적용
 * 각 상품별 개별 할인을 적용한 총 금액을 계산
 */
export const applyIndividualDiscounts = (
  itemResults: ItemDiscountResult[]
): number => {
  return itemResults.reduce(
    (sum, result) => sum + result.itemTotal * (1 - result.itemDiscount),
    0
  );
};

/**
 * 벌크 할인 적용
 * 총 수량이 기준을 넘으면 벌크 할인을 적용
 */
export const applyBulkDiscount = (
  subtotal: number,
  totalQuantity: number
): number => {
  if (totalQuantity >= DISCOUNT_THRESHOLDS.BULK_DISCOUNT_MIN) {
    return subtotal * (1 - DISCOUNT_THRESHOLDS.BULK_DISCOUNT_RATE);
  }
  return subtotal;
};

/**
 * 화요일 할인 적용
 * 화요일인 경우 추가 할인을 적용
 */
export const applyTuesdayDiscount = (total: number): number => {
  if (isTuesday()) {
    return total * (1 - DISCOUNT_THRESHOLDS.TUESDAY_DISCOUNT_RATE);
  }
  return total;
};

/**
 * 할인율 계산
 * 원래 금액 대비 할인된 비율을 퍼센트로 반환
 */
export const getDiscountRate = (
  originalTotal: number,
  finalTotal: number
): string => {
  if (originalTotal === 0) return '';

  const finalDiscountRate = (originalTotal - finalTotal) / originalTotal;
  return finalDiscountRate > 0
    ? `${(finalDiscountRate * 100).toFixed(1)}%`
    : '';
};

/**
 * 장바구니 총계 계산
 * 모든 할인과 포인트를 포함한 최종 계산
 */
export const getCartTotals = (cartItems: CartItem[]): CartTotalCalculation => {
  if (cartItems.length === 0) {
    return { cartTotal: 0, loyaltyPoints: 0, discountInfo: '' };
  }

  // 개별 상품 할인 계산
  const itemResults = cartItems.map(({ product, quantity }) =>
    getItemDiscount(product, quantity)
  );

  const subtotal = getSubtotal(itemResults);
  const totalQuantity = getTotalQuantity(itemResults);

  let finalTotal = applyBulkDiscount(subtotal, totalQuantity);
  finalTotal = applyTuesdayDiscount(finalTotal);

  const discountPercent = getDiscountRate(subtotal, finalTotal);
  const loyaltyPoints = getLoyaltyPoints(cartItems, finalTotal);

  return {
    cartTotal: Math.floor(finalTotal),
    loyaltyPoints,
    discountInfo: discountPercent,
  };
};
