import { BUSINESS_CONSTANTS, PRODUCT_IDS } from '../../shared/constants/index.js';
import { isTuesday } from '../../shared/utils/index.js';

// 개별 상품 할인 계산
export function calculateItemDiscount(productId, quantity) {
  if (quantity < BUSINESS_CONSTANTS.BULK_DISCOUNT_THRESHOLD) {
    return 0;
  }

  const discountMap = {
    [PRODUCT_IDS.KEYBOARD]: BUSINESS_CONSTANTS.KEYBOARD_DISCOUNT,
    [PRODUCT_IDS.MOUSE]: BUSINESS_CONSTANTS.MOUSE_DISCOUNT,
    [PRODUCT_IDS.MONITOR_ARM]: BUSINESS_CONSTANTS.MONITOR_ARM_DISCOUNT,
    [PRODUCT_IDS.LAPTOP_POUCH]: BUSINESS_CONSTANTS.LAPTOP_POUCH_DISCOUNT,
    [PRODUCT_IDS.SPEAKER]: BUSINESS_CONSTANTS.SPEAKER_DISCOUNT
  };

  return discountMap[productId] || 0;
}

// 대량구매 할인 계산
export function calculateBulkDiscount(totalQuantity, subtotal) {
  if (totalQuantity >= BUSINESS_CONSTANTS.BULK_QUANTITY_THRESHOLD) {
    return {
      discountRate: BUSINESS_CONSTANTS.BULK_QUANTITY_DISCOUNT_RATE,
      discountAmount: subtotal * BUSINESS_CONSTANTS.BULK_QUANTITY_DISCOUNT_RATE,
      finalAmount: subtotal * (1 - BUSINESS_CONSTANTS.BULK_QUANTITY_DISCOUNT_RATE)
    };
  }
  
  return {
    discountRate: 0,
    discountAmount: 0,
    finalAmount: subtotal
  };
}

// 화요일 할인 계산
export function calculateTuesdayDiscount(amount, date = new Date()) {
  if (!isTuesday(date) || amount <= 0) {
    return {
      discountRate: 0,
      discountAmount: 0,
      finalAmount: amount
    };
  }

  const discountAmount = amount * BUSINESS_CONSTANTS.TUESDAY_DISCOUNT_RATE;
  return {
    discountRate: BUSINESS_CONSTANTS.TUESDAY_DISCOUNT_RATE,
    discountAmount,
    finalAmount: amount - discountAmount
  };
}

// 종합 할인 계산 서비스
export class PricingService {
  calculateCartPricing(cartItems, products) {
    let subtotal = 0;
    let totalQuantity = 0;
    const itemDiscounts = [];

    // 1. 개별 상품 할인 계산
    for (const item of cartItems) {
      const product = products.find(p => p.id === item.productId);
      if (!product) continue;

      const itemDiscount = calculateItemDiscount(item.productId, item.quantity);
      const itemTotal = product.val * item.quantity;
      const discountedTotal = itemTotal * (1 - itemDiscount);

      subtotal += discountedTotal;
      totalQuantity += item.quantity;

      if (itemDiscount > 0) {
        itemDiscounts.push({
          name: product.name,
          discount: itemDiscount * 100
        });
      }
    }

    // 2. 대량구매 할인 (개별 할인 무시)
    const bulkDiscount = calculateBulkDiscount(totalQuantity, subtotal);
    let finalAmount = bulkDiscount.finalAmount;
    let finalDiscountRate = bulkDiscount.discountRate;

    // 3. 화요일 할인 (추가 적용)
    const tuesdayDiscount = calculateTuesdayDiscount(finalAmount);
    finalAmount = tuesdayDiscount.finalAmount;
    
    // 최종 할인율 계산
    const originalSubtotal = cartItems.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      return total + (product ? product.val * item.quantity : 0);
    }, 0);

    finalDiscountRate = originalSubtotal > 0 ? 
      (originalSubtotal - finalAmount) / originalSubtotal : 0;

    return {
      originalSubtotal,
      subtotal,
      finalAmount,
      totalQuantity,
      finalDiscountRate,
      itemDiscounts,
      bulkDiscount: bulkDiscount.discountRate > 0,
      tuesdayDiscount: tuesdayDiscount.discountRate > 0
    };
  }
}