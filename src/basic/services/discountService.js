// src/services/discountService.js

import {
  DISCOUNT_RATES,
  PRODUCT_FIVE,
  PRODUCT_ONE,
  PRODUCT_THREE,
  PRODUCT_TWO,
} from '../constants';
import { isTuesday } from '../utils/dateUtils';
import { getProductById } from './productService';

export const calculateCartTotals = (cartData) => {
  let subtotal = 0; // 할인 전 상품 총액
  let totalItemCount = 0; // 장바구니 전체 상품 개수
  let individualItemDiscountedTotal = 0; // 개별 상품 할인 적용 후 총액
  let itemDiscountsApplied = []; // 개별 상품 할인 적용 내역

  cartData.forEach((cartItem) => {
    const product = getProductById(cartItem.id);
    if (!product) return;

    const itemPrice = product.val;
    const itemQuantity = cartItem.quantity;
    const itemSubtotal = itemPrice * itemQuantity;

    subtotal += itemSubtotal;
    totalItemCount += itemQuantity;

    let itemDiscountRate = 0; // 아이템별 할인율

    // 10개 이상 구매 시 개별 상품 할인 적용
    if (itemQuantity >= 10) {
      if (product.id === PRODUCT_ONE) itemDiscountRate = DISCOUNT_RATES.PRODUCT_ONE_BULK;
      else if (product.id === PRODUCT_TWO) itemDiscountRate = DISCOUNT_RATES.PRODUCT_TWO_BULK;
      else if (product.id === PRODUCT_THREE) itemDiscountRate = DISCOUNT_RATES.PRODUCT_THREE_BULK;
      else if (product.id === PRODUCT_FIVE) itemDiscountRate = DISCOUNT_RATES.PRODUCT_FIVE_BULK;
    }

    individualItemDiscountedTotal += itemSubtotal * (1 - itemDiscountRate);
    if (itemDiscountRate > 0) {
      itemDiscountsApplied.push({ name: product.name, discount: itemDiscountRate * 100 });
    }
  });

  let finalTotal = individualItemDiscountedTotal; // 최종 금액 (초기값: 개별 할인 적용)
  let overallDiscountRate = 0; // 전체 할인율
  let isTuesdaySpecialApplied = false;

  // 1. 전체 수량 30개 이상 할인 (가장 큰 할인)
  if (totalItemCount >= DISCOUNT_RATES.TOTAL_BULK_THRESHOLD) {
    finalTotal = subtotal * (1 - DISCOUNT_RATES.TOTAL_BULK_RATE);
    overallDiscountRate = DISCOUNT_RATES.TOTAL_BULK_RATE;
    itemDiscountsApplied = []; // 전체 할인이 적용되면 개별 할인은 무시
  } else if (subtotal > 0) {
    // 30개 미만일 경우, 개별 상품 할인율 기반으로 총 할인율 계산
    overallDiscountRate = (subtotal - individualItemDiscountedTotal) / subtotal;
  }

  // 2. 화요일 특별 할인 (다른 할인과 중복 적용)
  if (isTuesday() && finalTotal > 0) {
    finalTotal *= 1 - DISCOUNT_RATES.TUESDAY_SPECIAL_RATE;
    isTuesdaySpecialApplied = true;
    if (subtotal > 0) {
      overallDiscountRate = 1 - finalTotal / subtotal; // 전체 할인율 재계산
    }
  }

  const savedAmount = subtotal - finalTotal; // 절약된 금액

  return {
    subtotal, // 할인 전 총액
    finalTotal: Math.round(finalTotal), // 최종 결제 금액 (반올림)
    savedAmount: Math.round(savedAmount), // 절약된 금액 (반올림)
    overallDiscountRate, // 전체 할인율
    itemDiscountsApplied, // 개별 상품 할인 내역
    totalItemCount, // 장바구니 전체 상품 개수
    isTuesdaySpecialApplied, // 화요일 특별 할인 적용 여부
  };
};
