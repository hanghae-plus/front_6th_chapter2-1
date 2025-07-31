import { type Cart } from '../model/cart';
import { isTuesday } from '../utils/day';
import { html } from '../utils/html';
import { selectById } from '../utils/selector';

interface Props {
  carts: Cart[];
  cartTotalCount: number;
  finalTotalPrice: number;
}

export function renderPoint(props: Props) {
  const point = selectById('loyalty-points');
  const { points, pointsDetail } = calculatePoints(props);

  if (points > 0) {
    point.style.display = 'block';
    point.innerHTML = html`
      <div>적립 포인트: <span class="font-bold">${points}p</span></div>
      <div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>
    `;
  } else {
    point.textContent = '적립 포인트: 0p';
    point.style.display = 'none';
  }
}

function calculatePoints({
  carts,
  cartTotalCount,
  finalTotalPrice,
}: {
  carts: Cart[];
  cartTotalCount: number;
  finalTotalPrice: number;
}) {
  const basePoints = Math.floor(finalTotalPrice / 1_000);
  let finalPoints = isTuesday() ? basePoints * 2 : basePoints;

  const pointsDetail = [];
  if (basePoints > 0) {
    pointsDetail.push('기본: ' + basePoints + 'p');

    if (isTuesday()) {
      pointsDetail.push('화요일 2배');
    }
  }

  const hasKeyboard = carts.some((cart) => cart.id === 'p1');
  const hasMouse = carts.some((cart) => cart.id === 'p2');
  const hasMonitorArm = carts.some((cart) => cart.id === 'p3');

  if (hasKeyboard && hasMouse) {
    const KEYBOARD_AND_MOUSE_BONUS_POINTS = 50;
    finalPoints += KEYBOARD_AND_MOUSE_BONUS_POINTS;
    pointsDetail.push(
      `키보드+마우스 세트 +${KEYBOARD_AND_MOUSE_BONUS_POINTS}p`
    );
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    const FULL_SET_BONUS_POINTS = 100;
    finalPoints += FULL_SET_BONUS_POINTS;
    pointsDetail.push(`풀세트 구매 +${FULL_SET_BONUS_POINTS}p`);
  }

  const BULK_30 = 30;
  const BULK_20 = 20;
  const BULK_10 = 10;
  const BULK_30_POINTS = 100;
  const BULK_20_POINTS = 50;
  const BULK_10_POINTS = 20;

  if (cartTotalCount >= BULK_30) {
    finalPoints += BULK_30_POINTS;
    pointsDetail.push(`대량구매(${BULK_30}개+) +${BULK_30_POINTS}p`);
  } else if (cartTotalCount >= BULK_20) {
    finalPoints += BULK_20_POINTS;
    pointsDetail.push(`대량구매(${BULK_20}개+) +${BULK_20_POINTS}p`);
  } else if (cartTotalCount >= BULK_10) {
    finalPoints += BULK_10_POINTS;
    pointsDetail.push(`대량구매(${BULK_10}개+) +${BULK_10_POINTS}p`);
  }

  return {
    points: finalPoints,
    pointsDetail,
  };
}
