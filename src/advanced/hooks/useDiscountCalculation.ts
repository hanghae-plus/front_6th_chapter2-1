import { useMemo } from 'react';
import { Product, CartItem, DiscountInfo } from '../types';

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
      'p1': 0.10, // 키보드 10%
      'p2': 0.15, // 마우스 15%
      'p3': 0.20, // 모니터암 20%
      'p5': 0.25  // 스피커 25%
    };
    
    // Calculate individual discounts
    let individualDiscountTotal = 0;
    cartItems.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (product && item.quantity >= 10 && itemDiscounts[item.id]) {
        const itemTotal = product.val * item.quantity;
        individualDiscountTotal += itemTotal * itemDiscounts[item.id];
      }
    });
    
    // Bulk discount (30+ items) - overrides individual discounts
    if (itemCount >= 30) {
      rate = 0.25;
    } else if (individualDiscountTotal > 0) {
      rate = individualDiscountTotal / totalAmount;
    }
    
    // Tuesday special discount (additional 10%)
    const today = new Date();
    const isTuesday = today.getDay() === 2;
    if (isTuesday && totalAmount > 0) {
      const tuesdayDiscount = (totalAmount - (totalAmount * rate)) * 0.1;
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
    let basePoints = Math.floor(finalTotal / 1000);
    let finalPoints = basePoints;
    const pointsDetail: string[] = [];

    if (basePoints > 0) {
      pointsDetail.push(`기본: ${basePoints}p`);
    }

    // Tuesday bonus
    const today = new Date();
    const isTuesday = today.getDay() === 2;
    if (isTuesday && basePoints > 0) {
      finalPoints = basePoints * 2;
      pointsDetail.push('화요일 2배');
    }

    // Check for keyboard + mouse combo
    const hasKeyboard = cartItems.some(item => item.id === 'p1');
    const hasMouse = cartItems.some(item => item.id === 'p2');
    const hasMonitorArm = cartItems.some(item => item.id === 'p3');

    if (hasKeyboard && hasMouse) {
      finalPoints += 50;
      pointsDetail.push('키보드+마우스 세트 +50p');
    }

    if (hasKeyboard && hasMouse && hasMonitorArm) {
      finalPoints += 100;
      pointsDetail.push('풀세트 구매 +100p');
    }

    // Bulk purchase bonus
    if (itemCount >= 30) {
      finalPoints += 100;
      pointsDetail.push('대량구매(30개+) +100p');
    } else if (itemCount >= 20) {
      finalPoints += 50;
      pointsDetail.push('대량구매(20개+) +50p');
    } else if (itemCount >= 10) {
      finalPoints += 20;
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