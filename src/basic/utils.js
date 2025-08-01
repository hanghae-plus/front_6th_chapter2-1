// ============================================
// UTILITY FUNCTIONS
// ============================================

import {
  PRODUCT_ONE,
  PRODUCT_TWO,
  PRODUCT_THREE,
  PRODUCT_FOUR,
  PRODUCT_FIVE,
  QUANTITY_THRESHOLDS,
  POINTS_CONFIG,
  DISCOUNT_RATES,
} from './constants.js';

// 화요일 체크 캐시
const tuesdayCache = new Map();

// 캐시된 화요일 체크 함수
const getCachedTuesdayCheck = () => {
  const today = new Date().toDateString();

  if (tuesdayCache.has(today)) {
    return tuesdayCache.get(today);
  }

  const isTuesdayToday = new Date().getDay() === 2;
  tuesdayCache.set(today, isTuesdayToday);

  return isTuesdayToday;
};

// 화요일인지 확인하는 유틸리티 함수
export const isTuesdayDay = () => getCachedTuesdayCheck();

// 상품 ID로 상품 찾기
export function findProductById(productList, productId) {
  return productList.find((product) => product.id === productId);
}

// 개별 상품 할인율 계산
export function getIndividualDiscountRate(productId, quantity) {
  if (quantity < QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT) {
    return 0;
  }

  const discountRates = {
    [PRODUCT_ONE]: DISCOUNT_RATES.KEYBOARD,
    [PRODUCT_TWO]: DISCOUNT_RATES.MOUSE,
    [PRODUCT_THREE]: DISCOUNT_RATES.MONITOR_ARM,
    [PRODUCT_FOUR]: DISCOUNT_RATES.LAPTOP_POUCH,
    [PRODUCT_FIVE]: DISCOUNT_RATES.SPEAKER,
  };

  return discountRates[productId] || 0;
}

// 총 재고 계산
export function getTotalStock(productList) {
  return productList.reduce((total, product) => total + product.quantity, 0);
}

// 재고 상태 메시지 생성
export function getStockStatusMessage(productList) {
  let message = '';

  productList.forEach((product) => {
    if (product.quantity < QUANTITY_THRESHOLDS.LOW_STOCK) {
      if (product.quantity > 0) {
        message += `${product.name}: 재고 부족 (${product.quantity}개 남음)\n`;
      } else {
        message += `${product.name}: 품절\n`;
      }
    }
  });

  return message;
}

// 포인트 계산 함수
export function calculatePoints(totalAmount, cartItems, itemCount) {
  let finalPoints = Math.floor(totalAmount / POINTS_CONFIG.POINTS_DIVISOR);
  const pointsDetail = [];

  if (finalPoints > 0) {
    pointsDetail.push(`기본: ${finalPoints}p`);
  }

  // 화요일 보너스 - isTuesdayDay 함수 사용
  if (isTuesdayDay() && finalPoints > 0) {
    finalPoints = finalPoints * 2;
    pointsDetail.push('화요일 2배');
  }

  // 세트 보너스
  const hasKeyboard = cartItems.some((item) => item.id === PRODUCT_ONE);
  const hasMouse = cartItems.some((item) => item.id === PRODUCT_TWO);
  const hasMonitorArm = cartItems.some((item) => item.id === PRODUCT_THREE);

  if (hasKeyboard && hasMouse) {
    finalPoints += POINTS_CONFIG.KEYBOARD_MOUSE_BONUS;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints += POINTS_CONFIG.FULL_SET_BONUS;
    pointsDetail.push('풀세트 구매 +100p');
  }

  // 수량 보너스
  if (itemCount >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
    finalPoints += POINTS_CONFIG.BONUS_30_ITEMS;
    pointsDetail.push('대량구매(30개+) +100p');
  } else if (itemCount >= 20) {
    finalPoints += POINTS_CONFIG.BONUS_20_ITEMS;
    pointsDetail.push('대량구매(20개+) +50p');
  } else if (itemCount >= QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT) {
    finalPoints += POINTS_CONFIG.BONUS_10_ITEMS;
    pointsDetail.push('대량구매(10개+) +20p');
  }

  return { finalPoints, pointsDetail };
}
