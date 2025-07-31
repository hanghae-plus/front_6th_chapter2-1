// PointCalculator: compute loyalty points based on final amount and bonuses
import { isTuesday } from "../pricing/helpers.js";

/**
 * @param {import('../Cart.js').default} cart
 * @param {number} finalPayableAmount  // after all discounts
 * @param {Date} [now]
 */
export function calculatePoints(cart, finalPayableAmount, now = new Date()) {
  let points = Math.floor(finalPayableAmount / 1000); // 기본 0.1%
  const details = [];
  if (points > 0) details.push(`기본: ${points}p`);

  // 화요일 2배
  if (isTuesday(now)) {
    points *= 2;
    if (points > 0) details.push("화요일 2배");
  }

  // 세트/풀세트 보너스
  const hasKeyboard = cart.items.has("p1");
  const hasMouse = cart.items.has("p2");
  const hasMonitorArm = cart.items.has("p3");
  if (hasKeyboard && hasMouse) {
    points += 50;
    details.push("키보드+마우스 세트 +50p");
  }
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    points += 100;
    details.push("풀세트 구매 +100p");
  }

  // 수량별 보너스
  const qty = cart.totalQuantity;
  if (qty >= 30) {
    points += 100;
    details.push("대량구매(30개+) +100p");
  } else if (qty >= 20) {
    points += 50;
    details.push("대량구매(20개+) +50p");
  } else if (qty >= 10) {
    points += 20;
    details.push("대량구매(10개+) +20p");
  }

  return { points, details };
}
