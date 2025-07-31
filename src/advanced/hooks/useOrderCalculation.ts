import { useState, useEffect, useCallback } from 'react';
import { CartItem } from '../types';
import {
  calculateCartTotals,
  applyBulkDiscount,
  applyTuesdayDiscount,
} from '../services/discountService';
import { calculateTotalPoints } from '../services/pointsService';
import { WEEKDAYS } from '../constants/config';

export function useOrderCalculation(cartItems: CartItem[]) {
  const [total, setTotal] = useState(0);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [discountInfo, setDiscountInfo] = useState('');
  const [showTuesdaySpecial, setShowTuesdaySpecial] = useState(false);
  const [cartTotals, setCartTotals] = useState<any>(null);

  const updateDiscountInfoDOM = useCallback((discountResult: any) => {
    const discountInfoElement = document.getElementById('discount-info');
    if (!discountInfoElement) return;

    discountInfoElement.innerHTML = '';

    if (discountResult.discountRate > 0 && discountResult.finalAmount > 0) {
      const savedAmount =
        discountResult.originalTotal - discountResult.finalAmount;
      const discountPercentage = Math.round(discountResult.discountRate * 100);

      discountInfoElement.innerHTML = `
        <div class="text-xs text-green-400 mb-2">
          💰 총 할인 혜택: ₩${savedAmount.toLocaleString()} (${discountPercentage}% 절약)
        </div>
      `;
    }
  }, []);

  useEffect(() => {
    if (cartItems.length === 0) {
      setTotal(0);
      setLoyaltyPoints(0);
      setDiscountInfo('');
      setShowTuesdaySpecial(false);
      setCartTotals(null);
      return;
    }

    // 1. 기본 장바구니 계산
    const calculatedCartTotals = calculateCartTotals(cartItems);
    setCartTotals(calculatedCartTotals);

    // 2. 대량 구매 할인 적용
    const bulkDiscountResult = applyBulkDiscount(calculatedCartTotals);

    // 3. 화요일 할인 적용
    const finalDiscountResult = applyTuesdayDiscount(
      bulkDiscountResult.finalAmount,
      bulkDiscountResult.originalTotal
    );

    // 4. 포인트 계산
    const points = calculateTotalPoints(
      cartItems,
      finalDiscountResult.finalAmount
    );

    // 5. 상태 업데이트
    setTotal(Math.round(finalDiscountResult.finalAmount));
    setLoyaltyPoints(points);

    // 6. 할인 정보 생성
    let discountText = '';
    if (calculatedCartTotals.itemDiscounts.length > 0) {
      discountText = calculatedCartTotals.itemDiscounts
        .map((item: any) => `${item.name}: ${item.discount}% 할인`)
        .join('\n');
    }
    if (calculatedCartTotals.itemCount >= 30) {
      discountText += discountText
        ? '\n대량구매 25% 할인'
        : '대량구매 25% 할인';
    }
    setDiscountInfo(discountText);

    // 7. 화요일 특별 할인 표시
    const today = new Date();
    const isTuesday = today.getDay() === WEEKDAYS.TUESDAY;
    setShowTuesdaySpecial(
      isTuesday &&
        finalDiscountResult.finalAmount < finalDiscountResult.originalTotal
    );

    // 8. discount-info DOM 업데이트
    updateDiscountInfoDOM(finalDiscountResult);
  }, [cartItems, updateDiscountInfoDOM]);

  return {
    total,
    loyaltyPoints,
    discountInfo,
    showTuesdaySpecial,
    cartTotals,
  };
}
