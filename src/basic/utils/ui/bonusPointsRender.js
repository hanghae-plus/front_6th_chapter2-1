import { cartDisp, cartState } from '../../main.basic';
import { isTuesday } from '../dateUtils';
import { productList, PRODUCTS } from '../stores';
export function doRenderBonusPoints() {
  const ptsTag = document.getElementById('loyalty-points');
  const cartItems = Array.from(cartDisp.children);

  if (cartItems.length === 0) {
    ptsTag.style.display = 'none';
    return;
  }

  // 기본 포인트: 구매액의 0.1%
  const basePoints = Math.floor(cartState.totalAmt / 1000);
  let finalPoints = basePoints > 0 ? basePoints : 0;
  const pointsDetail = basePoints > 0 ? [`기본: ${basePoints}p`] : [];

  // 화요일 2배 포인트
  if (isTuesday() && basePoints > 0) {
    finalPoints *= 2;
    pointsDetail.push('화요일 2배');
  }

  // 장바구니 내 상품 ID 리스트
  const cartIds = cartItems.map((node) => node.id);
  const cartProducts = cartIds.map((id) => productList.find((p) => p.id === id)).filter(Boolean);

  const hasKeyboard = cartProducts.some((p) => p.id === PRODUCTS.KEYBOARD);
  const hasMouse = cartProducts.some((p) => p.id === PRODUCTS.MOUSE);
  const hasMonitorArm = cartProducts.some((p) => p.id === PRODUCTS.MONITOR_ARM);

  // 키보드+마우스 세트
  if (hasKeyboard && hasMouse) {
    finalPoints += 50;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }

  // 풀세트(키보드+마우스+모니터암)
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints += 100;
    pointsDetail.push('풀세트 구매 +100p');
  }

  // 대량 구매 보너스
  let bulkBonus = null;
  if (cartState.itemCnt >= 30) {
    bulkBonus = { pts: 100, label: '대량구매(30개+) +100p' };
  } else if (cartState.itemCnt >= 20) {
    bulkBonus = { pts: 50, label: '대량구매(20개+) +50p' };
  } else if (cartState.itemCnt >= 10) {
    bulkBonus = { pts: 20, label: '대량구매(10개+) +20p' };
  }

  if (bulkBonus) {
    finalPoints += bulkBonus.pts;
    pointsDetail.push(bulkBonus.label);
  }

  // 포인트 표시 업데이트
  if (ptsTag) {
    ptsTag.style.display = 'block';
    if (finalPoints > 0) {
      ptsTag.innerHTML = `
        <div>적립 포인트: <span class="font-bold">${finalPoints}p</span></div>
        <div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>
      `;
    } else {
      ptsTag.textContent = '적립 포인트: 0p';
    }
  }
}
