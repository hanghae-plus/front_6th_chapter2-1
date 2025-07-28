import { PRODUCT_ONE, PRODUCT_TWO, PRODUCT_THREE } from "../constants/index.js";

// 적립 포인트 계산
export function calculateBonusPoints(
  totalAmount,
  itemCount,
  cartItems,
  products
) {
  if (itemCount === 0) return { points: 0, details: [] };

  let basePoints = Math.floor(totalAmount / 1000);
  let finalPoints = basePoints;
  const pointsDetail = [];

  if (basePoints > 0) {
    pointsDetail.push("기본: " + basePoints + "p");
  }

  // 화요일 2배
  if (new Date().getDay() === 2 && basePoints > 0) {
    finalPoints = basePoints * 2;
    pointsDetail.push("화요일 2배");
  }

  // 상품 조합 확인
  const hasKeyboard = cartItems.some((item) => item.id === PRODUCT_ONE);
  const hasMouse = cartItems.some((item) => item.id === PRODUCT_TWO);
  const hasMonitorArm = cartItems.some((item) => item.id === PRODUCT_THREE);

  if (hasKeyboard && hasMouse) {
    finalPoints += 50;
    pointsDetail.push("키보드+마우스 세트 +50p");
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints += 100;
    pointsDetail.push("풀세트 구매 +100p");
  }

  // 수량별 보너스
  if (itemCount >= 30) {
    finalPoints += 100;
    pointsDetail.push("대량구매(30개+) +100p");
  } else if (itemCount >= 20) {
    finalPoints += 50;
    pointsDetail.push("대량구매(20개+) +50p");
  } else if (itemCount >= 10) {
    finalPoints += 20;
    pointsDetail.push("대량구매(10개+) +20p");
  }

  return { points: finalPoints, details: pointsDetail };
}
