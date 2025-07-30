import { CART_TOTAL_BENEFIT_THRESHOLD } from '../const/discount';
import { PRODUCT_ONE, PRODUCT_THREE, PRODUCT_TWO } from './product';

/** @logic */
export const calculateBonusPoints = (cartItems, totalAmount, today = new Date()) => {
  let points = 0;
  const detail = [];

  const base = Math.floor(totalAmount / 1000);
  if (base > 0) {
    points = base;
    detail.push(`기본: ${base}p`);
  }

  if (today.getDay() === 2 && base > 0) {
    points = base * 2;
    detail.push('화요일 2배');
  }

  const productIds = cartItems.map((item) => item.productId);
  const hasKeyboard = productIds.includes(PRODUCT_ONE);
  const hasMouse = productIds.includes(PRODUCT_TWO);
  const hasMonitorArm = productIds.includes(PRODUCT_THREE);

  if (hasKeyboard && hasMouse) {
    points += 50;
    detail.push('키보드+마우스 세트 +50p');
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    points += 100;
    detail.push('풀세트 구매 +100p');
  }

  /** 이거 사실 cartManager의 getTotal 저시기 써야 하는데.. */
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  if (totalItemCount >= CART_TOTAL_BENEFIT_THRESHOLD) {
    points += 100;
    detail.push('대량구매(30개+) +100p');
  } else if (totalItemCount >= 20) {
    points += 50;
    detail.push('대량구매(20개+) +50p');
  } else if (totalItemCount >= 10) {
    points += 20;
    detail.push('대량구매(10개+) +20p');
  }

  return { total: points, detail };
};

/** @view */
export function renderBonusPoints(bonusPoints, detail) {
  const ptsTag = document.getElementById('loyalty-points');
  if (!ptsTag) return;

  if (bonusPoints > 0) {
    ptsTag.innerHTML =
      `<div>적립 포인트: <span class="font-bold">${bonusPoints}p</span></div>` +
      `<div class="text-2xs opacity-70 mt-1">${detail.join(', ')}</div>`;
  } else {
    ptsTag.textContent = '적립 포인트: 0p';
  }

  ptsTag.style.display = 'block';
}
