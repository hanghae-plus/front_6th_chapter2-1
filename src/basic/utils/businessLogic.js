/**
 * 비즈니스 로직 순수 함수들
 * 원본 main.original.js의 계산 로직을 100% 유지
 */
import {
  BASE_POINTS_RATE,
  BULK_DISCOUNT_RATE,
  BULK_DISCOUNT_THRESHOLD,
  CALCULATION_CONSTANTS,
  DAYS_OF_WEEK,
  DISCOUNT_RATES,
  FULL_SET_BONUS_POINTS,
  PRODUCT_ONE,
  PRODUCT_THREE,
  PRODUCT_TWO,
  QUANTITY_BONUS_POINTS,
  SET_BONUS_POINTS,
  TUESDAY_DISCOUNT_RATE,
  TUESDAY_POINTS_MULTIPLIER,
} from "../constants/productConstants.js";

// 메모이제이션 캐시
const calculationCache = new Map();

/**
 * 캐시 키 생성
 * @param {Array} cartItems - 장바구니 아이템들
 * @param {Array} productList - 상품 목록
 * @returns {string} 캐시 키
 */
const generateCacheKey = (cartItems, productList) => {
  const itemsKey = cartItems.map((item) => `${item.id}:${item.quantity}`).join("|");
  const productsKey = productList.map((p) => `${p.id}:${p.q}`).join("|");
  return `${itemsKey}|${productsKey}`;
};

/**
 * 장바구니 총액 계산 - 원본과 동일
 * @param {Array} cartItems - 장바구니 아이템들
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 * @returns {Object} 계산 결과
 */
export function calculateCartTotals(cartItems, productList, appState) {
  const cacheKey = generateCacheKey(cartItems, productList);

  if (calculationCache.has(cacheKey)) {
    return calculationCache.get(cacheKey);
  }

  let totalAmt = 0;
  let itemCnt = 0;
  let subTot = 0;
  let itemDiscounts = [];
  let lowStockItems = [];

  // 재고 부족 아이템 확인
  for (let idx = 0; idx < productList.length; idx++) {
    if (productList[idx].q < 5 && productList[idx].q > 0) {
      lowStockItems.push(productList[idx].name);
    }
  }

  // 각 장바구니 아이템 계산 - 원본과 동일
  for (let i = 0; i < cartItems.length; i++) {
    let curItem = null;

    // 상품 정보 찾기
    for (let j = 0; j < productList.length; j++) {
      if (productList[j].id === cartItems[i].id) {
        curItem = productList[j];
        break;
      }
    }

    if (!curItem) continue;

    const q = cartItems[i].quantity;
    const itemTot = curItem.val * q;
    let disc = 0;

    itemCnt += q;
    subTot += itemTot;

    // 10개 이상 구매 시 개별 할인 - 원본과 동일
    if (q >= 10) {
      if (curItem.id === PRODUCT_ONE) {
        disc = 10 / 100;
      } else if (curItem.id === PRODUCT_TWO) {
        disc = 15 / 100;
      } else if (curItem.id === PRODUCT_THREE) {
        disc = 20 / 100;
      } else if (curItem.id === "p4") {
        disc = 5 / 100;
      } else if (curItem.id === "p5") {
        disc = 25 / 100;
      }

      if (disc > 0) {
        itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
      }
    }

    totalAmt += itemTot * (1 - disc);
  }

  let discRate = 0;
  const originalTotal = subTot;

  // 30개 이상 구매 시 대량 할인 - 원본과 동일
  if (itemCnt >= 30) {
    totalAmt = (subTot * 75) / 100;
    discRate = 25 / 100;
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }

  // 화요일 특별 할인 - 원본과 동일
  const today = new Date();
  const isTuesday = today.getDay() === 2;

  if (isTuesday && totalAmt > 0) {
    totalAmt = (totalAmt * 90) / 100;
    discRate = 1 - totalAmt / originalTotal;
  }

  const result = {
    totalAmt: Math.round(totalAmt),
    itemCnt,
    subTot,
    discRate,
    isTuesday,
    itemDiscounts,
    lowStockItems,
    originalTotal,
  };

  calculationCache.set(cacheKey, result);
  return result;
}

/**
 * 보너스 포인트 계산 - 원본과 동일
 * @param {Array} cartItems - 장바구니 아이템들 (DOM 요소 또는 객체)
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 * @param {number} totalAmount - 총액
 * @returns {Object} 포인트 계산 결과 { finalPoints, pointsDetail }
 */
export function calculateBonusPoints(cartItems, productList, appState, totalAmount) {
  if (cartItems.length === 0) {
    return { finalPoints: 0, pointsDetail: [] };
  }

  let basePoints = Math.floor(totalAmount / 1000);
  let finalPoints = 0;
  let pointsDetail = [];

  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push("기본: " + basePoints + "p");
  }

  // 화요일 포인트 배수 - 원본과 동일
  const today = new Date();
  if (today.getDay() === 2) {
    if (basePoints > 0) {
      finalPoints = basePoints * 2;
      pointsDetail.push("화요일 2배");
    }
  }

  // 상품 조합 보너스 - 원본과 동일
  const cartItemInfo = extractCartItemInfo(cartItems);
  const hasKeyboard = cartItemInfo.hasKeyboard;
  const hasMouse = cartItemInfo.hasMouse;
  const hasMonitorArm = cartItemInfo.hasMonitorArm;

  if (hasKeyboard && hasMouse) {
    finalPoints += 50;
    pointsDetail.push("키보드+마우스 세트 +50p");
  }
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints += 100;
    pointsDetail.push("풀세트 구매 +100p");
  }

  // 수량 보너스 - 원본과 동일
  if (cartItemInfo.totalQuantity >= 30) {
    finalPoints += 100;
    pointsDetail.push("대량구매(30개+) +100p");
  } else if (cartItemInfo.totalQuantity >= 20) {
    finalPoints += 50;
    pointsDetail.push("대량구매(20개+) +50p");
  } else if (cartItemInfo.totalQuantity >= 10) {
    finalPoints += 20;
    pointsDetail.push("대량구매(10개+) +20p");
  }

  return { finalPoints, pointsDetail };
}

/**
 * 장바구니 아이템 정보 추출 - 원본과 동일
 * @param {Array} cartItems - 장바구니 아이템들 (DOM 요소 배열)
 * @returns {Object} 추출된 정보
 */
export function extractCartItemInfo(cartItems) {
  let hasKeyboard = false;
  let hasMouse = false;
  let hasMonitorArm = false;
  let totalQuantity = 0;

  for (const item of cartItems) {
    const quantityElement = item.querySelector(".quantity-number");
    const quantity = quantityElement ? parseInt(quantityElement.textContent) : 0;
    totalQuantity += quantity;

    if (item.id === "p1") {
      hasKeyboard = true;
    } else if (item.id === "p2") {
      hasMouse = true;
    } else if (item.id === "p3") {
      hasMonitorArm = true;
    }
  }

  return {
    hasKeyboard,
    hasMouse,
    hasMonitorArm,
    totalQuantity,
  };
}
