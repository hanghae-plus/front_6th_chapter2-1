import { PRODUCT_IDS, POINT_RATES, DAYS_OF_WEEK } from '../constants.js';

// 보너스 포인트 계산 및 렌더링
export function renderBonusPoints(productList, cartDisplay, totalAmount, itemCount) {
  if (cartDisplay.children.length === 0) {
    document.getElementById('loyalty-points').style.display = 'none';
    return;
  }

  const basePoints = Math.floor(totalAmount / 1000);
  let finalPoints = 0;
  const pointsDetail = [];

  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push('기본: ' + basePoints + 'p');
  }

  if (new Date().getDay() === DAYS_OF_WEEK.TUESDAY) {
    if (basePoints > 0) {
      finalPoints = basePoints * POINT_RATES.TUESDAY_MULTIPLIER;
      pointsDetail.push('화요일 2배');
    }
  }

  let hasKeyboard = false;
  let hasMouse = false;
  let hasMonitorArm = false;

  for (const node of cartDisplay.children) {
    let product = null;
    for (let pIdx = 0; pIdx < productList.length; pIdx++) {
      if (productList[pIdx].id === node.id) {
        product = productList[pIdx];
        break;
      }
    }
    if (!product) continue;

    if (product.id === PRODUCT_IDS.KEYBOARD) {
      hasKeyboard = true;
    } else if (product.id === PRODUCT_IDS.MOUSE) {
      hasMouse = true;
    } else if (product.id === PRODUCT_IDS.MONITOR_ARM) {
      hasMonitorArm = true;
    }
  }

  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + POINT_RATES.KEYBOARD_MOUSE_BONUS;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + POINT_RATES.FULL_SET_BONUS;
    pointsDetail.push('풀세트 구매 +100p');
  }

  if (itemCount >= 30) {
    finalPoints = finalPoints + POINT_RATES.FULL_SET_BONUS;
    pointsDetail.push('대량구매(30개+) +100p');
  } else {
    if (itemCount >= 20) {
      finalPoints = finalPoints + POINT_RATES.KEYBOARD_MOUSE_BONUS;
      pointsDetail.push('대량구매(20개+) +50p');
    } else {
      if (itemCount >= 10) {
        finalPoints = finalPoints + 20;
        pointsDetail.push('대량구매(10개+) +20p');
      }
    }
  }

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
}
