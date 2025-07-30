/**
 * 장바구니 계산기
 * 순수 함수로 구성된 계산 로직
 */

import { findProductById } from '../../product/utils/productUtils.js';
import { calculateItemDiscountRate } from '../utils/discountUtils.js';

/**
 * 상품별 수량 추출 (순수 함수)
 * @param {Element} cartItem - 장바구니 아이템 요소
 * @returns {number} 수량
 */
const extractQuantity = cartItem => {
  const qtyElem = cartItem.querySelector('.quantity-number');
  return parseInt(qtyElem?.textContent || '0');
};

/**
 * 상품별 총액 계산 (순수 함수)
 * @param {object} product - 상품 정보
 * @param {number} quantity - 수량
 * @returns {number} 총액
 */
const calculateItemTotal = (product, quantity) => {
  return product.val * quantity;
};

/**
 * 소계 계산 (순수 함수)
 * @param {Array} cartItems - 장바구니 아이템들
 * @param {Array} products - 상품 목록
 * @returns {object} 소계 계산 결과
 */
const calculateSubtotal = (cartItems, products) => {
  const result = cartItems.reduce(
    (acc, cartItem) => {
      const product = findProductById(cartItem.id, products);
      if (!product) return acc;

      const quantity = extractQuantity(cartItem);
      const itemTotal = calculateItemTotal(product, quantity);

      return {
        subtotal: acc.subtotal + itemTotal,
        totalItemCount: acc.totalItemCount + quantity,
      };
    },
    { subtotal: 0, totalItemCount: 0 },
  );

  return result;
};

/**
 * 개별 상품 할인 적용 (순수 함수)
 * @param {Array} cartItems - 장바구니 아이템들
 * @param {Array} products - 상품 목록
 * @param {object} constants - 비즈니스 상수
 * @param {object} productIds - 상품 ID 매핑
 * @returns {object} 개별 할인 적용 결과
 */
const applyItemDiscounts = (cartItems, products, constants, productIds) => {
  return cartItems.reduce(
    (acc, cartItem) => {
      const product = findProductById(cartItem.id, products);
      if (!product) return acc;

      const quantity = extractQuantity(cartItem);
      const discountRate = calculateItemDiscountRate(
        cartItem.id,
        quantity,
        constants,
        productIds,
      );
      const itemTotal = calculateItemTotal(product, quantity);
      const discountedTotal = itemTotal * (1 - discountRate);

      return {
        totalAmount: acc.totalAmount + discountedTotal,
        itemDiscounts: [
          ...acc.itemDiscounts,
          {
            productId: cartItem.id,
            originalAmount: itemTotal,
            discountedAmount: discountedTotal,
            discountRate,
          },
        ],
      };
    },
    { totalAmount: 0, itemDiscounts: [] },
  );
};

/**
 * 화요일 할인 적용 (순수 함수)
 * @param {number} amount - 금액
 * @returns {object} 화요일 할인 적용 결과
 */
const applyTuesdayDiscount = amount => {
  const isTuesday = new Date().getDay() === 2;
  const discountedAmount = isTuesday && amount > 0 ? amount * 0.9 : amount;

  return {
    finalAmount: discountedAmount,
    isTuesday,
  };
};

/**
 * 할인율 계산 (순수 함수)
 * @param {number} subtotal - 소계
 * @param {number} finalAmount - 최종 금액
 * @returns {number} 할인율
 */
const calculateDiscountRate = (subtotal, finalAmount) => {
  return subtotal > 0 ? (subtotal - finalAmount) / subtotal : 0;
};

/**
 * 장바구니 총 계산 (메인 함수) - 불변성
 * @param {HTMLCollection} cartElements - DOM cart elements
 * @param {Array} products - Product list
 * @param {object} constants - Business constants
 * @param {object} productIds - Product ID mappings
 * @returns {object} Calculation results
 */
export const calculateCart = (
  cartElements,
  products,
  constants,
  productIds,
) => {
  const cartItems = Array.from(cartElements);

  const { subtotal, totalItemCount } = calculateSubtotal(cartItems, products);

  const isBulkPurchase =
    totalItemCount >= constants.DISCOUNT.BULK_DISCOUNT_THRESHOLD;

  const amountAfterBulkDiscount = isBulkPurchase ? subtotal * 0.75 : subtotal;

  const itemDiscountResult = isBulkPurchase
    ? { totalAmount: amountAfterBulkDiscount, itemDiscounts: [] }
    : applyItemDiscounts(cartItems, products, constants, productIds);

  const { finalAmount: afterTuesdayDiscount, isTuesday } = applyTuesdayDiscount(
    itemDiscountResult.totalAmount,
  );

  const discountRate = calculateDiscountRate(subtotal, afterTuesdayDiscount);

  return {
    subtotal,
    totalAmount: afterTuesdayDiscount,
    totalItemCount,
    itemDiscounts: itemDiscountResult.itemDiscounts,
    discountRate,
    isTuesday,
  };
};
