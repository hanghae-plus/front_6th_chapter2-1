/**
 * 포인트 계산 로직을 처리하는 Custom Hook
 */

import { useMemo } from 'react';
import { CartItem, PointsDetail, UsePointsReturn, PointsCalculation } from '../types';
import { BUSINESS_CONSTANTS, PRODUCT_IDS, POINTS_BONUS } from '../constants';

export const usePoints = (cartItems: CartItem[], totalAmount: number): UsePointsReturn => {
  return useMemo(() => {
    if (cartItems.length === 0 || totalAmount <= 0) {
      return {
        bonusPoints: 0,
        pointsDetails: [],
        pointsCalculation: {
          basePoints: 0,
          tuesdayBonus: 0,
          setBonus: 0,
          quantityBonus: 0,
          totalPoints: 0,
          details: [],
        },
      };
    }

    const pointsDetails: PointsDetail[] = [];
    
    // 1. 기본 포인트 (구매액의 0.1%)
    const basePoints = Math.floor(totalAmount * BUSINESS_CONSTANTS.POINTS_RATE);
    pointsDetails.push({
      type: 'base',
      description: `구매액의 ${BUSINESS_CONSTANTS.POINTS_RATE * 100}%`,
      points: basePoints,
    });

    // 2. 화요일 보너스 (기본 포인트 2배)
    let tuesdayBonus = 0;
    const today = new Date();
    if (today.getDay() === BUSINESS_CONSTANTS.TUESDAY_DAY_OF_WEEK) {
      tuesdayBonus = basePoints;
      pointsDetails.push({
        type: 'tuesday',
        description: '화요일 포인트 2배 적립',
        points: tuesdayBonus,
      });
    }

    // 3. 세트 구매 보너스
    let setBonus = 0;
    const cartProductIds = cartItems.map(item => item.id);
    
    // 풀세트 체크 (모든 상품 구매)
    const hasFullSet = Object.values(PRODUCT_IDS).every(productId => 
      cartProductIds.includes(productId)
    );
    
    if (hasFullSet) {
      setBonus = POINTS_BONUS.SET_BONUS.FULL_SET.bonusPoints;
      pointsDetails.push({
        type: 'set',
        description: POINTS_BONUS.SET_BONUS.FULL_SET.name,
        points: setBonus,
      });
    } else {
      // 키보드+마우스 세트 체크
      const hasKeyboardMouseSet = POINTS_BONUS.SET_BONUS.KEYBOARD_MOUSE.requiredProducts
        .every(productId => cartProductIds.includes(productId));
      
      if (hasKeyboardMouseSet) {
        setBonus = POINTS_BONUS.SET_BONUS.KEYBOARD_MOUSE.bonusPoints;
        pointsDetails.push({
          type: 'set',
          description: POINTS_BONUS.SET_BONUS.KEYBOARD_MOUSE.name,
          points: setBonus,
        });
      }
    }

    // 4. 수량별 보너스
    let quantityBonus = 0;
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // 수량 보너스는 가장 높은 단계만 적용
    const applicableBonus = POINTS_BONUS.QUANTITY_BONUS
      .filter(bonus => totalQuantity >= bonus.threshold)
      .sort((a, b) => b.bonusPoints - a.bonusPoints)[0];
    
    if (applicableBonus) {
      quantityBonus = applicableBonus.bonusPoints;
      pointsDetails.push({
        type: 'quantity',
        description: applicableBonus.description,
        points: quantityBonus,
      });
    }

    // 총 포인트 계산
    const totalPoints = basePoints + tuesdayBonus + setBonus + quantityBonus;

    const pointsCalculation: PointsCalculation = {
      basePoints,
      tuesdayBonus,
      setBonus,
      quantityBonus,
      totalPoints,
      details: pointsDetails.map(detail => 
        `${detail.description}: +${detail.points}P`
      ),
    };

    return {
      bonusPoints: totalPoints,
      pointsDetails,
      pointsCalculation,
    };
  }, [cartItems, totalAmount]);
};