import {
  DISCOUNT_RATES,
  QUANTITY_THRESHOLDS,
  MAGIC_NUMBERS,
  PRODUCT_IDS,
} from "../../shared/constants/index.js";

export function calculateIndividualDiscount(productId, quantity) {
  if (quantity < QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT) {
    return 0;
  }

  switch (productId) {
    case PRODUCT_IDS.KEYBOARD:
      return DISCOUNT_RATES.INDIVIDUAL.KEYBOARD;
    case PRODUCT_IDS.MOUSE:
      return DISCOUNT_RATES.INDIVIDUAL.MOUSE;
    case PRODUCT_IDS.MONITOR_ARM:
      return DISCOUNT_RATES.INDIVIDUAL.MONITOR_ARM;
    case PRODUCT_IDS.LAPTOP_POUCH:
      return DISCOUNT_RATES.INDIVIDUAL.LAPTOP_POUCH;
    case PRODUCT_IDS.SPEAKER:
      return DISCOUNT_RATES.INDIVIDUAL.SPEAKER;
    default:
      return 0;
  }
}

export function shouldApplyBulkDiscount(totalItemCount) {
  return totalItemCount >= QUANTITY_THRESHOLDS.BULK_DISCOUNT;
}

export function calculateBulkDiscount(subtotal) {
  return subtotal * (1 - DISCOUNT_RATES.BULK);
}

export function isTodayTuesday() {
  const today = new Date();
  return today.getDay() === MAGIC_NUMBERS.TUESDAY_DAY_INDEX;
}

export function calculateTuesdayDiscount(total) {
  return total * (1 - DISCOUNT_RATES.TUESDAY);
}

export function calculateTotalDiscount(subtotal, cartItems, products) {
  let total = 0;
  let totalItemCount = 0;
  const itemDiscounts = [];

  for (let i = 0; i < cartItems.length; i++) {
    const cartItem = cartItems[i];
    const product = products.find((p) => p.id === cartItem.id);

    if (product) {
      const quantity = parseInt(
        cartItem.querySelector(".quantity-number").textContent
      );
      const itemTotal = product.price * quantity;
      totalItemCount += quantity;

      const discountRate = calculateIndividualDiscount(product.id, quantity);
      if (discountRate > 0) {
        itemDiscounts.push({
          name: product.name,
          discount: discountRate * 100,
        });
      }

      total += itemTotal * (1 - discountRate);
    }
  }

  if (shouldApplyBulkDiscount(totalItemCount)) {
    total = calculateBulkDiscount(subtotal);
  }

  const isTuesday = isTodayTuesday();
  if (isTuesday && total > 0) {
    total = calculateTuesdayDiscount(total);
  }

  const discountRate = subtotal > 0 ? 1 - total / subtotal : 0;

  return {
    finalTotal: total,
    originalTotal: subtotal,
    discountRate,
    totalItemCount,
    itemDiscounts,
    isTuesday,
  };
}
