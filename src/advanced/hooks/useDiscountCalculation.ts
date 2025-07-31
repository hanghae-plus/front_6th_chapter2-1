import { useMemo } from 'react';
import { Product, CartItem, DiscountInfo } from '../types';
import { 
  PRODUCT_IDS, 
  DISCOUNT_RATES, 
  QUANTITY_THRESHOLDS, 
  POINTS_CONFIG, 
  WEEKDAYS 
} from '../constants';

export const useDiscountCalculation = (
  cartItems: CartItem[],
  products: Product[],
  totalAmount: number,
  itemCount: number
) => {
  const { discountRate, itemDiscounts, finalTotal } = useMemo(() => {
    let rate = 0;
    let subtotal = 0;
    let discountedTotal = 0;
    const itemDiscounts: DiscountInfo[] = [];
    
    // Calculate subtotal and individual discounts (원본 로직과 동일)
    cartItems.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return;
      
      const itemTotal = product.val * item.quantity;
      subtotal += itemTotal;
      
      // Individual discount calculation (원본과 동일)
      if (item.quantity >= QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT) {
        let discount = 0;
        if (product.id === PRODUCT_IDS.KEYBOARD) {
          discount = DISCOUNT_RATES.KEYBOARD;
        } else if (product.id === PRODUCT_IDS.MOUSE) {
          discount = DISCOUNT_RATES.MOUSE;
        } else if (product.id === PRODUCT_IDS.MONITOR_ARM) {
          discount = DISCOUNT_RATES.MONITOR_ARM;
        } else if (product.id === PRODUCT_IDS.LAPTOP_POUCH) {
          discount = DISCOUNT_RATES.LAPTOP_POUCH;
        } else if (product.id === PRODUCT_IDS.SPEAKER) {
          discount = DISCOUNT_RATES.SPEAKER;
        }
        
        if (discount > 0) {
          itemDiscounts.push({ name: product.name, discount: discount * 100 });
          discountedTotal += itemTotal * (1 - discount);
        } else {
          discountedTotal += itemTotal;
        }
      } else {
        discountedTotal += itemTotal;
      }
    });
    
    let finalTotal = discountedTotal;
    
    // Bulk discount (30+ items) - overrides individual discounts
    if (itemCount >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
      finalTotal = subtotal * (1 - DISCOUNT_RATES.BULK_PURCHASE);
      rate = DISCOUNT_RATES.BULK_PURCHASE;
      // 대량구매 할인이 적용되면 개별 할인은 표시하지 않음
      itemDiscounts.length = 0;
    } else {
      rate = (subtotal - discountedTotal) / subtotal;
    }
    
    // Tuesday special discount (additional 10%)
    const today = new Date();
    const isTuesday = today.getDay() === WEEKDAYS.TUESDAY;
    if (isTuesday && finalTotal > 0) {
      finalTotal = finalTotal * (1 - DISCOUNT_RATES.TUESDAY);
      rate = 1 - (finalTotal / subtotal);
    }
    
    return { discountRate: rate, itemDiscounts, finalTotal };
  }, [cartItems, products, itemCount]);

  const savedAmount = useMemo(() => {
    return totalAmount * discountRate;
  }, [totalAmount, discountRate]);

  const loyaltyPoints = useMemo(() => {
    let basePoints = Math.floor(finalTotal / POINTS_CONFIG.POINTS_DIVISOR);
    let finalPoints = basePoints;
    const pointsDetail: string[] = [];

    if (basePoints > 0) {
      pointsDetail.push(`기본: ${basePoints}p`);
    }

    // Tuesday bonus
    const today = new Date();
    const isTuesday = today.getDay() === WEEKDAYS.TUESDAY;
    if (isTuesday && basePoints > 0) {
      finalPoints = basePoints * POINTS_CONFIG.TUESDAY_MULTIPLIER;
      pointsDetail.push('화요일 2배');
    }

    // Check for keyboard + mouse combo
    const hasKeyboard = cartItems.some(item => item.productId === PRODUCT_IDS.KEYBOARD);
    const hasMouse = cartItems.some(item => item.productId === PRODUCT_IDS.MOUSE);
    const hasMonitorArm = cartItems.some(item => item.productId === PRODUCT_IDS.MONITOR_ARM);

    if (hasKeyboard && hasMouse) {
      finalPoints += POINTS_CONFIG.KEYBOARD_MOUSE_BONUS;
      pointsDetail.push('키보드+마우스 세트 +50p');
    }

    if (hasKeyboard && hasMouse && hasMonitorArm) {
      finalPoints += POINTS_CONFIG.FULL_SET_BONUS;
      pointsDetail.push('풀세트 구매 +100p');
    }

    // Bulk purchase bonus
    if (itemCount >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
      finalPoints += POINTS_CONFIG.BONUS_30_ITEMS;
      pointsDetail.push('대량구매(30개+) +100p');
    } else if (itemCount >= QUANTITY_THRESHOLDS.POINTS_BONUS_20) {
      finalPoints += POINTS_CONFIG.BONUS_20_ITEMS;
      pointsDetail.push('대량구매(20개+) +50p');
    } else if (itemCount >= QUANTITY_THRESHOLDS.POINTS_BONUS_10) {
      finalPoints += POINTS_CONFIG.BONUS_10_ITEMS;
      pointsDetail.push('대량구매(10개+) +20p');
    }

    return {
      basePoints,
      finalPoints,
      pointsDetail
    };
  }, [cartItems, finalTotal, itemCount]);

  return {
    discountRate,
    savedAmount,
    finalTotal,
    loyaltyPoints: loyaltyPoints.finalPoints,
    pointsDetail: loyaltyPoints.pointsDetail,
    itemDiscounts
  };
}; 