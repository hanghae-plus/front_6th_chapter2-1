// services/orderSummary.ts
import { getCartItems, getProduct } from '../store/state.js';
import { THRESHOLDS } from '../constants/index.js';
import type { ItemDiscount } from '../types/index.js';

export function updateSummaryDetails(
  subtotal: number,
  itemDiscounts: ItemDiscount[],
  isTuesday: boolean,
  totalQuantity: number,
): void {
  // React 컴포넌트에서 자동으로 처리되므로 빈 함수로 유지
  // 호환성을 위해 함수는 남겨둠
}

export function updateTotal(amount: number): void {
  // React 컴포넌트에서 자동으로 처리되므로 빈 함수로 유지
  // 호환성을 위해 함수는 남겨둠
}

export function updateDiscountInfo(discountRate: number, originalTotal: number, totalAmount: number): void {
  // React 컴포넌트에서 자동으로 처리되므로 빈 함수로 유지
  // 호완성을 위해 함수는 남겨둠
}

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