import { DISCOUNT_RATES, DISCOUNT_THRESHOLDS, TUESDAY_DISCOUNT } from '../utils/discountUtils';
import { isTuesday } from '../utils/pointUtils';

/**
 * 개별 상품 할인율 계산
 * @param {string} productId - 상품 ID
 * @param {number} quantity - 수량
 */
const calculateItemDiscountRate = (productId, quantity) => {
  if (quantity < DISCOUNT_THRESHOLDS.ITEM) return 0;
  return DISCOUNT_RATES[productId] ?? 0;
};

/**
 * 대량구매 할인율 계산
 * @param {number} totalCount - 전체 수량
 */
const calculateBulkDiscountRate = (totalCount) => (totalCount >= DISCOUNT_THRESHOLDS.BULK ? 0.25 : 0);

/**
 * 카트 아이템에서 상품 정보 추출
 * @param {Element} cartItem - 카트 아이템 DOM 요소
 * @param {Array} productList - 상품 목록
 */
const findProductFromCartItem = (cartItem, productList) => {
  const product = productList.find((p) => p.productId === cartItem.id);
  if (!product) return null;

  const quantityElement = cartItem.querySelector('.quantity-number');
  const quantity = parseInt(quantityElement.textContent);
  const subtotal = product.price * quantity;

  return { product, quantity, subtotal };
};

/**
 * 개별 카트 아이템 할인 계산
 * @param {Element} cartItem - 카트 아이템 DOM 요소
 * @param {Array} productList - 상품 목록
 */
const calculateCartItem = (cartItem, productList) => {
  const result = findProductFromCartItem(cartItem, productList);
  if (!result) return { itemCount: 0, subtotal: 0, totalAmount: 0, itemDiscounts: [] };

  const { product, quantity, subtotal } = result;
  const discountRate = calculateItemDiscountRate(product.productId, quantity);
  const totalAmount = subtotal * (1 - discountRate);
  const itemDiscounts = discountRate > 0 ? [{ name: product.name, discount: discountRate * 100 }] : [];

  return { itemCount: quantity, subtotal, totalAmount, itemDiscounts };
};

/**
 * 모든 카트 아이템 할인 계산 및 집계
 * @param {Array} cartItems - 카트 아이템 배열
 * @param {Array} productList - 상품 목록
 */
const calculateCartItems = (cartItems, productList) => {
  let itemCount = 0;
  let subtotal = 0;
  let totalAmount = 0;
  const itemDiscounts = [];

  for (const cartItem of cartItems) {
    const {
      itemCount: count,
      subtotal: sub,
      totalAmount: total,
      itemDiscounts: discounts,
    } = calculateCartItem(cartItem, productList);

    itemCount += count;
    subtotal += sub;
    totalAmount += total;
    itemDiscounts.push(...discounts);
  }

  return { itemCount, subtotal, totalAmount, itemDiscounts };
};

/**
 * 대량구매 할인 적용
 * @param {number} amount - 현재 금액
 * @param {number} subtotal - 소계
 * @param {number} itemCount - 전체 수량
 */
const applyBulkDiscount = (amount, subtotal, itemCount) => {
  const rate = calculateBulkDiscountRate(itemCount);
  return rate > 0 ? subtotal * (1 - rate) : amount;
};

/**
 * 화요일 할인 적용
 * @param {number} amount - 적용할 금액
 * @param {Date} date - 확인할 날짜 (기본값: 오늘)
 */
const applyTuesdayDiscount = (amount) => {
  const rate = isTuesday() ? TUESDAY_DISCOUNT : 0;
  const finalAmount = rate > 0 ? amount * (1 - rate) : amount;

  return {
    totalAmount: finalAmount,
    originalTotal: amount,
    isTuesday: rate > 0,
    tuesdayDiscount: rate,
  };
};

/**
 * 최종 할인율 계산
 * @param {number} total - 최종 금액
 * @param {number} subtotal - 소계
 */
const calculateFinalDiscountRate = (total, subtotal) => (subtotal > 0 ? 1 - total / subtotal : 0);

/**
 * 전체 할인 계산 (메인 함수)
 * @param {Array} cartItems - 카트 아이템 배열
 * @param {Array} productList - 상품 목록
 */
export const calculateTotalDiscount = (cartItems, productList) => {
  // 개별 아이템 할인 계산 및 집계
  const { itemCount, subtotal, totalAmount, itemDiscounts } = calculateCartItems(cartItems, productList);

  // 대량구매 할인 적용
  const bulkAppliedAmount = applyBulkDiscount(totalAmount, subtotal, itemCount);

  // 화요일 할인 적용
  const { totalAmount: finalAmount, isTuesday: isTuesdayDiscount } = applyTuesdayDiscount(bulkAppliedAmount);

  // 최종 할인율 계산
  const discountRate = calculateFinalDiscountRate(finalAmount, subtotal);

  return {
    subtotal,
    totalAmount: finalAmount,
    itemCount,
    itemDiscounts,
    discountRate,
    isTuesday: isTuesdayDiscount,
  };
};
