import { isTodayTuesday } from '../utils/isTodayTuesday';
import { findProductById } from '../utils/findProductById';
import { PRODUCT_1, PRODUCT_2, PRODUCT_3 } from '../main.basic';

// 포인트 출력
export const renderBonusPoints = ({ cartItems, productList, appState }) => {
  const { totalAfterDiscount, totalProductCount } = appState;

  // 기본 포인트 - 총 가격 / 1000
  const basePoints = Math.floor(totalAfterDiscount / 1000);
  // 최종 포인트
  let finalPoints = 0;
  // 포인트 상세 전체 텍스트
  const pointsDetail = [];

  // 각 상품의 존재 여부
  let hasKeyboard = false;
  let hasMouse = false;
  let hasMonitorArm = false;

  // 장바구니에 상품이 없으면 적립 포인트 요소 없앰
  if (cartItems.length === 0) {
    document.getElementById('loyalty-points').style.display = 'none';
    return;
  }

  // 기본 포인트 출력
  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push('기본: ' + basePoints + 'p');
  }
  // 화요일 포인트 출력
  if (isTodayTuesday()) {
    if (basePoints > 0) {
      finalPoints = basePoints * 2;
      pointsDetail.push('화요일 2배');
    }
  }

  for (const item of cartItems) {
    // 아이디로 현재 상품 찾기
    const product = findProductById(productList, item.id);
    if (!product) continue;

    // 찾은 상품으로 존재 여부 업데이트
    if (product.id === PRODUCT_1) hasKeyboard = true;
    if (product.id === PRODUCT_2) hasMouse = true;
    if (product.id === PRODUCT_3) hasMonitorArm = true;
  }

  // 상품에 따른 포인트 추가
  if (hasKeyboard && hasMouse) {
    finalPoints += 50;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints += 100;
    pointsDetail.push('풀세트 구매 +100p');
  }
  if (totalProductCount >= 30) {
    finalPoints += 100;
    pointsDetail.push('대량구매(30개+) +100p');
  } else {
    if (totalProductCount >= 20) {
      finalPoints += 50;
      pointsDetail.push('대량구매(20개+) +50p');
    } else {
      if (totalProductCount >= 10) {
        finalPoints += 20;
        pointsDetail.push('대량구매(10개+) +20p');
      }
    }
  }

  // 최종 적립 포인트 업데이트 - appState 값 직접 업데이트
  appState.totalPoint = finalPoints;
  const ptsTag = document.getElementById('loyalty-points');
  if (ptsTag) {
    if (finalPoints > 0) {
      ptsTag.innerHTML =
        '<div>적립 포인트: <span class="font-bold">' +
        finalPoints +
        'p</span></div>' +
        '<div class="text-2xs opacity-70 mt-1">' +
        pointsDetail.join(', ') +
        '</div>';
      ptsTag.style.display = 'block';
    } else {
      ptsTag.textContent = '적립 포인트: 0p';
      ptsTag.style.display = 'block';
    }
  }
};
