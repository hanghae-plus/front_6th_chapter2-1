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
  const discountRate = useMemo(() => {
    let rate = 0;
    
    // Individual item discounts
    const itemDiscounts: { [key: string]: number } = {
      [PRODUCT_IDS.KEYBOARD]: DISCOUNT_RATES.KEYBOARD,
      [PRODUCT_IDS.MOUSE]: DISCOUNT_RATES.MOUSE,
      [PRODUCT_IDS.MONITOR_ARM]: DISCOUNT_RATES.MONITOR_ARM,
      [PRODUCT_IDS.SPEAKER]: DISCOUNT_RATES.SPEAKER
    };
    
    // Calculate individual discounts
    let individualDiscountTotal = 0;
    cartItems.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (product && item.quantity >= QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT && itemDiscounts[item.id]) {
        const itemTotal = product.val * item.quantity;
        individualDiscountTotal += itemTotal * itemDiscounts[item.id];
      }
    });
    
    // Bulk discount (30+ items) - overrides individual discounts
    if (itemCount >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
      rate = DISCOUNT_RATES.BULK_PURCHASE;
    } else if (individualDiscountTotal > 0) {
      rate = individualDiscountTotal / totalAmount;
    }
    
    // Tuesday special discount (additional 10%)
    const today = new Date();
    const isTuesday = today.getDay() === WEEKDAYS.TUESDAY;
    if (isTuesday && totalAmount > 0) {
      const tuesdayDiscount = (totalAmount - (totalAmount * rate)) * DISCOUNT_RATES.TUESDAY;
      rate = rate + (tuesdayDiscount / totalAmount);
    }
    
    return rate;
  }, [cartItems, products, itemCount, totalAmount]);

  const savedAmount = useMemo(() => {
    return totalAmount * discountRate;
  }, [totalAmount, discountRate]);

  const finalTotal = useMemo(() => {
    return totalAmount - savedAmount;
  }, [totalAmount, savedAmount]);

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
    const hasKeyboard = cartItems.some(item => item.id === PRODUCT_IDS.KEYBOARD);
    const hasMouse = cartItems.some(item => item.id === PRODUCT_IDS.MOUSE);
    const hasMonitorArm = cartItems.some(item => item.id === PRODUCT_IDS.MONITOR_ARM);

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
    pointsDetail: loyaltyPoints.pointsDetail
  };
}; 