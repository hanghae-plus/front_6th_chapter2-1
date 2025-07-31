import { TUESDAY_DAY_OF_WEEK } from '../data/date.data.js';
import {
  DISCOUNT_RATE_BULK,
  DISCOUNT_RATE_LIST,
  DISCOUNT_RATE_TUESDAY,
} from '../data/discount.data.js';
import {
  MIN_QUANTITY_FOR_BULK_DISCOUNT,
  MIN_QUANTITY_FOR_DISCOUNT,
} from '../data/quantity.data.js';

/**
 * 상품별 할인율을 계산하는 함수
 * @param {string} productId - 상품 ID
 * @param {number} quantity - 수량
 * @returns {number} 할인율 (0-1 사이의 값)
 */
export function calculateProductDiscount(productId, quantity) {
  if (quantity < MIN_QUANTITY_FOR_DISCOUNT) {
    return 0;
  }

  return DISCOUNT_RATE_LIST[productId] / 100 || 0;
}

/**
 * 대량구매 할인을 적용하는 함수
 * @param {number} subtotal - 소계
 * @param {number} itemCounts - 총 아이템 수
 * @param {number} currentTotalAmount - 현재 총액
 * @returns {Object} 할인 적용된 정보
 */
export function applyBulkDiscount(subtotal, itemCounts, currentTotalAmount) {
  let totalAmount = currentTotalAmount;
  let discountRate = 0;

  if (itemCounts >= MIN_QUANTITY_FOR_BULK_DISCOUNT) {
    totalAmount = (subtotal * (100 - DISCOUNT_RATE_BULK)) / 100;
    discountRate = DISCOUNT_RATE_BULK / 100;
  } else {
    discountRate = (subtotal - totalAmount) / subtotal;
  }

  return { totalAmount, discountRate };
}

/**
 * 화요일 특별 할인을 적용하는 함수
 * @param {number} totalAmount - 총액
 * @param {number} originalTotal - 원래 총액
 * @returns {Object} 화요일 할인 적용된 정보
 */
export function applyTuesdayDiscount(totalAmount, originalTotal) {
  const today = new Date();
  const isTuesday = today.getDay() === TUESDAY_DAY_OF_WEEK;
  let finalTotalAmount = totalAmount;
  let finalDiscountRate = 0;

  if (isTuesday && totalAmount > 0) {
    finalTotalAmount = (totalAmount * (100 - DISCOUNT_RATE_TUESDAY)) / 100;
    finalDiscountRate = 1 - finalTotalAmount / originalTotal;
  }

  return {
    totalAmount: finalTotalAmount,
    discountRate: finalDiscountRate,
    isTuesday,
  };
}

export function isTuesday() {
  return new Date().getDay() === TUESDAY_DAY_OF_WEEK;
}

export function isBulkDiscountEligible(totalQuantity) {
  return totalQuantity >= MIN_QUANTITY_FOR_BULK_DISCOUNT;
}

export function isProductDiscountEligible(quantity) {
  return quantity >= MIN_QUANTITY_FOR_DISCOUNT;
}

export function isTuesdayToday() {
  return new Date().getDay() === TUESDAY_DAY_OF_WEEK;
}
