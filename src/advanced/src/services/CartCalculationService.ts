import type { CartItem, CartCalculationResult } from '../types';
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
import { isTuesday } from '../utils/date';

/**
 * 장바구니 계산을 수행하는 메인 함수
 * @param {CartItem[]} cartItems - 장바구니 아이템들
 * @returns {CartCalculationResult} 계산 결과
 */
export function calculateCart(cartItems: CartItem[]): CartCalculationResult {
  let totalAmt = 0;
  let itemCnt = 0;
  let originalTotal = 0;
  let subTot = 0;
  let discRate = 0;

  const itemDiscounts: Array<{ name: string; discount: number }> = [];

  // 각 아이템별 계산
  cartItems.forEach((item) => {
    const itemTot = item.val * item.quantity;
    let disc = 0;

    itemCnt += item.quantity;
    subTot += itemTot;

    // 개별 상품 할인 적용
    if (item.quantity >= INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD) {
      disc = calculateIndividualDiscount(item.id);
      if (disc > 0) {
        itemDiscounts.push({ name: item.name, discount: disc * 100 });
      }
    }

    totalAmt += itemTot * (1 - disc);
  });

  // 대량구매 할인 적용
  const { finalTotal: bulkTotal, discRate: bulkDiscRate } = applyBulkPurchaseDiscount(
    totalAmt,
    subTot,
    itemCnt
  );
  totalAmt = bulkTotal;
  originalTotal = subTot;

  // 화요일 특별 할인 적용
  const { finalTotal: tuesdayTotal, finalDiscRate: tuesdayDiscRate } = applyTuesdaySpecialDiscount(
    totalAmt,
    originalTotal,
    bulkDiscRate
  );
  totalAmt = tuesdayTotal;
  discRate = tuesdayDiscRate;

  return {
    totalAmt: Math.round(totalAmt),
    itemCnt,
    originalTotal,
    discRate,
  };
}

/**
 * 개별 상품 할인을 계산합니다.
 * @param {string} productId - 상품 ID
 * @returns {number} 할인율 (0-1)
 */
function calculateIndividualDiscount(productId: string): number {
  const discountMap: Record<string, number> = {
    [KEYBOARD]: PRODUCT_DISCOUNTS[KEYBOARD] / 100,
    [MOUSE]: PRODUCT_DISCOUNTS[MOUSE] / 100,
    [MONITOR_ARM]: PRODUCT_DISCOUNTS[MONITOR_ARM] / 100,
    [NOTEBOOK_CASE]: PRODUCT_DISCOUNTS[NOTEBOOK_CASE] / 100,
    [SPEAKER]: PRODUCT_DISCOUNTS[SPEAKER] / 100,
  };
  return discountMap[productId] || 0;
}

/**
 * 대량구매 할인을 적용합니다.
 * @param {number} totalAmt - 총액
 * @param {number} subTot - 소계
 * @param {number} itemCnt - 아이템 수
 * @returns {Object} 할인 적용 결과
 */
function applyBulkPurchaseDiscount(totalAmt: number, subTot: number, itemCnt: number) {
  let discRate = 0;

  if (itemCnt >= BULK_PURCHASE_THRESHOLD) {
    totalAmt = (subTot * (100 - BULK_PURCHASE_DISCOUNT)) / 100;
    discRate = BULK_PURCHASE_DISCOUNT / 100;
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }

  return { finalTotal: totalAmt, discRate };
}

/**
 * 화요일 특별 할인을 적용합니다.
 * @param {number} totalAmt - 총액
 * @param {number} originalTotal - 원래 총액
 * @param {number} discRate - 기존 할인율
 * @returns {Object} 할인 적용 결과
 */
function applyTuesdaySpecialDiscount(totalAmt: number, originalTotal: number, discRate: number) {
  if (isTuesday() && totalAmt > 0) {
    totalAmt = (totalAmt * (100 - TUESDAY_SPECIAL_DISCOUNT)) / 100;
    // 화요일 할인 적용 후의 최종 할인율 계산
    discRate = 1 - totalAmt / originalTotal;
  }
  return { finalTotal: totalAmt, finalDiscRate: discRate };
} 