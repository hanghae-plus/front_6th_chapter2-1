/**
 * Cart Calculation Utilities
 * 리액트 친화적인 순수 함수들로 구성
 */

import { calculateItemDiscountRate } from "../utils/discountUtils.js";

/**
 * 장바구니 총 계산 (메인 함수)
 * @param {HTMLCollection} cartElements - DOM cart elements
 * @param {Array} products - Product list
 * @param {Object} constants - Business constants
 * @param {Object} productIds - Product ID mappings
 * @returns {Object} Calculation results
 */
export const calculateCart = (
  cartElements,
  products,
  constants,
  productIds
) => {
  const cartItems = Array.from(cartElements);

  // 1. 기본 계산
  const { subtotal, totalItemCount } = calculateSubtotal(cartItems, products);

  // 2. 개별 상품 할인 적용
  const { totalAmount: afterItemDiscount, itemDiscounts } = applyItemDiscounts(
    cartItems,
    products,
    constants,
    productIds
  );

  let finalAmount = afterItemDiscount;

  // 3. 대량 구매 할인 (개별 할인 무시)
  if (totalItemCount >= constants.DISCOUNT.BULK_DISCOUNT_THRESHOLD) {
    finalAmount = subtotal * 0.75; // 25% 할인
  }

  // 4. 화요일 할인
  const isTuesday = new Date().getDay() === 2;
  if (isTuesday && finalAmount > 0) {
    finalAmount = finalAmount * 0.9; // 10% 추가 할인
  }

  // 5. 할인율 계산
  const discountRate = subtotal > 0 ? (subtotal - finalAmount) / subtotal : 0;

  // 6. UI 하이라이트 적용
  highlightDiscountableItems(cartItems, products, constants);

  return {
    subtotal,
    totalAmount: finalAmount,
    totalItemCount,
    itemDiscounts,
    discountRate,
    isTuesday,
  };
};

/**
 * 소계 및 총 수량 계산
 */
const calculateSubtotal = (cartItems, products) => {
  let subtotal = 0;
  let totalItemCount = 0;

  cartItems.forEach((cartItem) => {
    const product = findProductById(cartItem.id, products);
    if (!product) return;

    const qtyElem = cartItem.querySelector(".quantity-number");
    const quantity = parseInt(qtyElem.textContent) || 0;
    const itemTotal = product.val * quantity;

    totalItemCount += quantity;
    subtotal += itemTotal;
  });

  return { subtotal, totalItemCount };
};

/**
 * 개별 상품 할인 적용
 */
const applyItemDiscounts = (cartItems, products, constants, productIds) => {
  let totalAmount = 0;
  const itemDiscounts = [];

  cartItems.forEach((cartItem) => {
    const product = findProductById(cartItem.id, products);
    if (!product) return;

    const qtyElem = cartItem.querySelector(".quantity-number");
    const quantity = parseInt(qtyElem.textContent) || 0;
    const itemTotal = product.val * quantity;

    const discount = calculateItemDiscountRate(
      product.id,
      quantity,
      constants,
      productIds
    );

    if (discount > 0) {
      itemDiscounts.push({
        name: product.name,
        discount: discount * 100,
      });
      totalAmount += itemTotal * (1 - discount);
    } else {
      totalAmount += itemTotal;
    }
  });

  return { totalAmount, itemDiscounts };
};

/**
 * 할인 가능 아이템 하이라이트
 */
const highlightDiscountableItems = (cartItems, products, constants) => {
  cartItems.forEach((cartItem) => {
    const product = findProductById(cartItem.id, products);
    if (!product) return;

    const qtyElem = cartItem.querySelector(".quantity-number");
    const quantity = parseInt(qtyElem.textContent) || 0;

    const priceElems = cartItem.querySelectorAll(".text-lg, .text-xs");
    priceElems.forEach((elem) => {
      if (elem.classList.contains("text-lg")) {
        elem.style.fontWeight =
          quantity >= constants.DISCOUNT.ITEM_DISCOUNT_MIN_QUANTITY
            ? "bold"
            : "normal";
      }
    });
  });
};

/**
 * 상품 찾기 헬퍼
 */
const findProductById = (productId, products) => {
  return products.find((p) => p.id === productId);
};
