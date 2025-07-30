// Discount service module
import { DISCOUNT_RATES } from '../data/productData.js';

// Utility functions
function isTuesday() {
  return new Date().getDay() === 2;
}

// Individual product discount calculation
export function calculateIndividualDiscount(productId, quantity) {
  if (quantity < DISCOUNT_RATES.INDIVIDUAL_DISCOUNT_THRESHOLD) {
    return 0;
  }
  return DISCOUNT_RATES.INDIVIDUAL_PRODUCT_DISCOUNTS[productId] || 0;
}

// Bulk purchase discount calculation
export function calculateBulkDiscount(totalQuantity) {
  if (totalQuantity >= DISCOUNT_RATES.BULK_PURCHASE_THRESHOLD) {
    return DISCOUNT_RATES.BULK_PURCHASE_DISCOUNT;
  }
  return 0;
}

// Tuesday discount calculation
export function calculateTuesdayDiscount(amount) {
  // amount 파라미터는 향후 확장성을 위해 유지하되, 현재는 할인율만 반환
  return isTuesday() ? DISCOUNT_RATES.TUESDAY_DISCOUNT : 0;
}

// Main discount calculation function
export function calculateDiscounts(cartData) {
  const { items, subtotal, totalQuantity } = cartData;
  const itemDiscounts = [];
  let totalAmount = subtotal;

  // 개별 상품 할인 계산
  items.forEach(({ product, quantity, itemTotal }) => {
    const discount = calculateIndividualDiscount(product.id, quantity);
    if (discount > 0) {
      itemDiscounts.push({ name: product.name, discount });
      totalAmount -= itemTotal * (discount / 100);
    }
  });

  // 전체 수량 할인
  const bulkDiscount = calculateBulkDiscount(totalQuantity);
  if (bulkDiscount > 0) {
    totalAmount = subtotal * (1 - bulkDiscount / 100);
  }

  // 화요일 할인
  const tuesdayDiscount = calculateTuesdayDiscount(totalAmount);
  if (tuesdayDiscount > 0) {
    totalAmount *= 1 - tuesdayDiscount / 100;
  }

  return {
    totalAmount,
    itemDiscounts,
    discountRate: subtotal > 0 ? (subtotal - totalAmount) / subtotal : 0,
  };
}

// Export utility function for other modules
export { isTuesday };
