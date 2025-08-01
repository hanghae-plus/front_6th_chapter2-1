// services/orderSummary.ts
import { getCartItems, getProduct } from '../store/state.js';
import { THRESHOLDS } from '../constants/index.js';
import type { ItemDiscount } from '../types/index.js';

export function getSummaryData() {
  const cartItems = getCartItems();
  const summaryItems: Array<{productId: string, name: string, quantity: number, itemTotal: number}> = [];
  
  Object.entries(cartItems).forEach(([productId, quantity]) => {
    const product = getProduct(productId);
    if (!product) return;

    const itemTotal = product.price * quantity;
    summaryItems.push({
      productId,
      name: product.name,
      quantity,
      itemTotal
    });
  });
  
  return summaryItems;
}

export function getItemDiscounts(totalQuantity: number): ItemDiscount[] {
  const cartItems = getCartItems();
  const discounts: ItemDiscount[] = [];
  
  if (totalQuantity >= THRESHOLDS.MIN_QUANTITY_FOR_BULK) {
    return [{ name: '대량구매 할인 (30개 이상)', discount: 25 }];
  }
  
  Object.entries(cartItems).forEach(([productId, quantity]) => {
    const product = getProduct(productId);
    if (!product || quantity < THRESHOLDS.MIN_QUANTITY_FOR_DISCOUNT) return;

    const discountMap: Record<string, number> = {
      'p1': 10, // KEYBOARD
      'p2': 15, // MOUSE  
      'p3': 20, // MONITOR_ARM
      'p4': 5,  // LAPTOP_POUCH
      'p5': 25, // SPEAKER
    };

    const discount = discountMap[productId];
    if (discount) {
      discounts.push({ name: `${product.name} (10개↑)`, discount });
    }
  });

  return discounts;
}