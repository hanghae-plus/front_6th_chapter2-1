// ================================================
// 할인 계산 유틸리티
// ================================================

import {
  PRODUCT_DISCOUNTS,
  INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD,
  BULK_PURCHASE_THRESHOLD,
  BULK_PURCHASE_DISCOUNT,
  TUESDAY_SPECIAL_DISCOUNT,
} from '../constants.js';

/**
 * 개별 상품 할인 계산
 * @param {Object} product - 상품 정보
 * @param {number} quantity - 수량
 * @returns {Object} 할인 정보
 */
export function calculateIndividualDiscount(product, quantity) {
  if (quantity < INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD) {
    return { discount: 0, discountRate: 0 };
  }

  const discountRate = PRODUCT_DISCOUNTS[product.id] / 100;
  const discount = discountRate * 100;

  return {
    discount,
    discountRate,
    name: product.name,
    threshold: INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD,
  };
}

/**
 * 대량구매 할인 계산
 * @param {number} totalQuantity - 총 수량
 * @param {number} subtotal - 소계
 * @returns {Object} 할인 정보
 */
export function calculateBulkDiscount(totalQuantity) {
  if (totalQuantity < BULK_PURCHASE_THRESHOLD) {
    return { discount: 0, discountRate: 0 };
  }

  const discountRate = BULK_PURCHASE_DISCOUNT / 100;
  const discount = discountRate * 100;

  return {
    discount,
    discountRate,
    threshold: BULK_PURCHASE_THRESHOLD,
  };
}

/**
 * 화요일 할인 계산
 * @param {boolean} isTuesday - 화요일 여부
 * @param {number} totalAmount - 총 금액
 * @returns {Object} 할인 정보
 */
export function calculateTuesdayDiscount(isTuesday, totalAmount) {
  if (!isTuesday || totalAmount <= 0) {
    return { discount: 0, discountRate: 0 };
  }

  const discountRate = TUESDAY_SPECIAL_DISCOUNT / 100;
  const discount = discountRate * 100;

  return {
    discount,
    discountRate,
  };
}

/**
 * 전체 할인 계산
 * @param {Array} cartItems - 장바구니 아이템들
 * @param {boolean} isTuesday - 화요일 여부
 * @returns {Object} 전체 할인 정보
 */
export function calculateTotalDiscounts(cartItems, isTuesday) {
  let subtotal = 0;
  let totalAmount = 0;
  let totalQuantity = 0;
  const individualDiscounts = [];

  // 개별 상품 할인 계산
  for (const cartItem of cartItems) {
    const { product, quantity } = cartItem;
    const itemTotal = product.val * quantity;

    subtotal += itemTotal;
    totalQuantity += quantity;

    const individualDiscount = calculateIndividualDiscount(product, quantity);
    if (individualDiscount.discount > 0) {
      individualDiscounts.push(individualDiscount);
      totalAmount += itemTotal * (1 - individualDiscount.discountRate);
    } else {
      totalAmount += itemTotal;
    }
  }

  // 대량구매 할인 계산
  const bulkDiscount = calculateBulkDiscount(totalQuantity, subtotal);
  if (bulkDiscount.discount > 0) {
    totalAmount = (subtotal * (100 - bulkDiscount.discount)) / 100;
  }

  // 화요일 할인 계산
  const tuesdayDiscount = calculateTuesdayDiscount(isTuesday, totalAmount);
  if (tuesdayDiscount.discount > 0) {
    totalAmount = (totalAmount * (100 - tuesdayDiscount.discount)) / 100;
  }

  // 최종 할인율 계산
  const finalDiscountRate = subtotal > 0 ? (subtotal - totalAmount) / subtotal : 0;

  return {
    subtotal,
    totalAmount,
    totalQuantity,
    individualDiscounts,
    bulkDiscount,
    tuesdayDiscount,
    finalDiscountRate,
    savedAmount: subtotal - totalAmount,
  };
}
