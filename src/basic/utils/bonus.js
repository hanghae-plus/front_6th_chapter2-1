import {
  ITEM_COUNT_BONUS,
  KEYBOARD_MOUSE_ARM_BONUS,
  KEYBOARD_MOUSE_BONUS,
  POINTS_PER_ITEM,
  PRODUCT_ONE,
  PRODUCT_THREE,
  PRODUCT_TWO,
  TUESDAY,
} from '../constants/enum';

function calBonusPoints(totalAmount, itemCount) {
  const basePoints = Math.floor(totalAmount / POINTS_PER_ITEM);

  let finalPoints = 0;

  if (basePoints > 0) {
    finalPoints = basePoints;
  }

  const isTuesday = new Date().getDay() === TUESDAY; // 화요일

  if (isTuesday) {
    if (basePoints > 0) {
      finalPoints = basePoints * 2;
    }
  }

  const $cartItems = document.getElementById('cart-items');
  const cartItemList = Array.from($cartItems.children);

  const hasKeyboard = !!cartItemList.find((item) => item.id === PRODUCT_ONE);
  const hasMouse = !!cartItemList.find((item) => item.id === PRODUCT_TWO);
  const hasMonitorArm = !!cartItemList.find((item) => item.id === PRODUCT_THREE);

  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + KEYBOARD_MOUSE_BONUS;
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + KEYBOARD_MOUSE_ARM_BONUS;
  }

  if (itemCount >= 30) {
    finalPoints = finalPoints + ITEM_COUNT_BONUS[30];
  } else {
    if (itemCount >= 20) {
      finalPoints = finalPoints + ITEM_COUNT_BONUS[20];
    } else {
      if (itemCount >= 10) {
        finalPoints = finalPoints + ITEM_COUNT_BONUS[10];
      }
    }
  }

  return finalPoints;
}

function getBonusPointsDetail(totalAmount, itemCount) {
  const basePoints = Math.floor(totalAmount / POINTS_PER_ITEM);
  const pointsDetail = [];

  if (basePoints > 0) {
    pointsDetail.push(`기본: ${basePoints}p`);
  }

  const isTuesday = new Date().getDay() === 2;

  if (isTuesday) {
    if (basePoints > 0) {
      pointsDetail.push('화요일 2배');
    }
  }

  const $cartItems = document.getElementById('cart-items');
  const cartItemList = Array.from($cartItems.children);

  const hasKeyboard = !!cartItemList.find((item) => item.id === PRODUCT_ONE);
  const hasMouse = !!cartItemList.find((item) => item.id === PRODUCT_TWO);
  const hasMonitorArm = !!cartItemList.find((item) => item.id === PRODUCT_THREE);

  if (hasKeyboard && hasMouse) {
    pointsDetail.push('키보드+마우스 세트 +50p');
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    pointsDetail.push('풀세트 구매 +100p');
  }

  if (itemCount >= 30) {
    pointsDetail.push('대량구매(30개+) +100p');
  } else {
    if (itemCount >= 20) {
      pointsDetail.push('대량구매(20개+) +50p');
    } else {
      if (itemCount >= 10) {
        pointsDetail.push('대량구매(10개+) +20p');
      }
    }
  }

  return pointsDetail;
}

export { calBonusPoints, getBonusPointsDetail };
