// ==========================================
// 카트 서비스 (TypeScript - React 용)
// ==========================================

import { DISCOUNT_RATES, THRESHOLDS } from '../constant/index';
import type { Product } from '../types';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  val: number;
  originalVal: number;
  onSale: boolean;
  suggestSale: boolean;
}

interface CartCalculationResult {
  subTotal: number;
  finalTotal: number;
  discountRate: number;
  itemDiscounts: Array<{name: string, discount: number}>;
  totalItemCount: number;
  isTuesdayApplied: boolean;
}

/**
 * React용 장바구니 계산 함수 (순수 함수)
 */
export function calculateCartTotals(cartItems: CartItem[]): CartCalculationResult {
  const subTotal = cartItems.reduce((sum, item) => sum + (item.originalVal * item.quantity), 0);
  
  // 10개 이상 개별 상품 할인 계산
  let totalAmountAfterItemDiscount = 0;
  const itemDiscounts: Array<{name: string, discount: number}> = [];
  
  cartItems.forEach(item => {
    const itemTotal = item.originalVal * item.quantity;
    let discountRate = 0;
    
    // 10개 이상 구매시 개별 할인 적용
    if (item.quantity >= THRESHOLDS.ITEM_DISCOUNT_MIN) {
      switch (item.id) {
        case 'p1': discountRate = DISCOUNT_RATES.KEYBOARD; break;
        case 'p2': discountRate = DISCOUNT_RATES.MOUSE; break;
        case 'p3': discountRate = DISCOUNT_RATES.MONITOR_ARM; break;
        case 'p4': discountRate = DISCOUNT_RATES.POUCH; break;
        case 'p5': discountRate = DISCOUNT_RATES.SPEAKER; break;
      }
      
      if (discountRate > 0) {
        itemDiscounts.push({
          name: item.name,
          discount: discountRate * 100
        });
      }
    }
    
    totalAmountAfterItemDiscount += itemTotal * (1 - discountRate);
  });

  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // 대량구매 할인 (30개 이상)
  let finalTotal = totalAmountAfterItemDiscount;
  let discountRate = 0;
  
  if (totalItemCount >= THRESHOLDS.BULK_DISCOUNT_MIN) {
    finalTotal = subTotal * (1 - DISCOUNT_RATES.BULK_DISCOUNT);
    discountRate = DISCOUNT_RATES.BULK_DISCOUNT;
  } else if (subTotal > 0) {
    discountRate = (subTotal - totalAmountAfterItemDiscount) / subTotal;
  }
  
  // 화요일 할인
  const isTuesday = new Date().getDay() === 2;
  let isTuesdayApplied = false;
  
  if (isTuesday && finalTotal > 0) {
    finalTotal = finalTotal * (1 - DISCOUNT_RATES.TUESDAY_DISCOUNT);
    discountRate = 1 - finalTotal / subTotal;
    isTuesdayApplied = true;
  }

  return {
    subTotal,
    finalTotal: Math.round(finalTotal),
    discountRate,
    itemDiscounts,
    totalItemCount,
    isTuesdayApplied
  };
}