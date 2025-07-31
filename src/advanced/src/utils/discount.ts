import type { Product, CartItem } from '../types';
import { 
  INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD, 
  BULK_PURCHASE_THRESHOLD, 
  BULK_PURCHASE_DISCOUNT,
  TUESDAY_SPECIAL_DISCOUNT,
  PRODUCT_DISCOUNTS,
  KEYBOARD,
  MOUSE,
  MONITOR_ARM,
  NOTEBOOK_CASE,
  SPEAKER,
} from '../constants';


/**
 * 개별 상품 할인을 계산합니다.
 * @param {Product} product - 상품 정보
 * @param {number} quantity - 수량
 * @returns {number} 할인율 (0-1)
 */
export function calculateIndividualDiscount(product: Product, quantity: number): number {
  if (quantity < INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD) {
    return 0;
  }

  const discountMap: Record<string, number> = {
    [KEYBOARD]: PRODUCT_DISCOUNTS[KEYBOARD] / 100,
    [MOUSE]: PRODUCT_DISCOUNTS[MOUSE] / 100,
    [MONITOR_ARM]: PRODUCT_DISCOUNTS[MONITOR_ARM] / 100,
    [NOTEBOOK_CASE]: PRODUCT_DISCOUNTS[NOTEBOOK_CASE] / 100,
    [SPEAKER]: PRODUCT_DISCOUNTS[SPEAKER] / 100,
  };

  return discountMap[product.id] || 0;
}

/**
 * 대량구매 할인을 계산합니다.
 * @param {number} totalQuantity - 총 수량
 * @returns {number} 할인율 (0-1)
 */
export function calculateBulkDiscount(totalQuantity: number): number {
  if (totalQuantity >= BULK_PURCHASE_THRESHOLD) {
    return BULK_PURCHASE_DISCOUNT / 100;
  }
  return 0;
}

/**
 * 화요일 특별 할인을 계산합니다.
 * @param {boolean} isTuesday - 화요일 여부
 * @param {number} totalAmount - 총액
 * @returns {number} 할인율 (0-1)
 */
export function calculateTuesdayDiscount(isTuesday: boolean, totalAmount: number): number {
  if (isTuesday && totalAmount > 0) {
    return TUESDAY_SPECIAL_DISCOUNT / 100;
  }
  return 0;
}

/**
 * 총 할인을 계산합니다.
 * @param {CartItem[]} cartItems - 장바구니 아이템들
 * @param {boolean} isTuesday - 화요일 여부
 * @returns {Object} 할인 계산 결과
 */
export function calculateTotalDiscounts(cartItems: CartItem[], isTuesday: boolean) {
  let subtotal = 0;
  let individualDiscountTotal = 0;
  let bulkDiscountTotal = 0;
  let tuesdayDiscountTotal = 0;

  // 개별 상품 할인 계산
  cartItems.forEach((item) => {
    const itemTotal = item.val * item.quantity;
    subtotal += itemTotal;
    
    const individualDiscount = calculateIndividualDiscount({
      id: item.id,
      name: item.name,
      val: item.val,
      originalVal: item.originalVal,
      q: item.quantity,
      onSale: item.onSale,
      suggestSale: item.suggestSale,
    }, item.quantity);
    individualDiscountTotal += itemTotal * individualDiscount;
  });

  // 대량구매 할인 계산
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const bulkDiscount = calculateBulkDiscount(totalQuantity);
  bulkDiscountTotal = subtotal * bulkDiscount;

  // 화요일 할인 계산
  const tuesdayDiscount = calculateTuesdayDiscount(isTuesday, subtotal - individualDiscountTotal - bulkDiscountTotal);
  tuesdayDiscountTotal = (subtotal - individualDiscountTotal - bulkDiscountTotal) * tuesdayDiscount;

  const totalDiscount = individualDiscountTotal + bulkDiscountTotal + tuesdayDiscountTotal;
  const finalTotal = subtotal - totalDiscount;

  return {
    subtotal,
    individualDiscountTotal,
    bulkDiscountTotal,
    tuesdayDiscountTotal,
    totalDiscount,
    finalTotal,
    discountRate: subtotal > 0 ? totalDiscount / subtotal : 0,
  };
} 