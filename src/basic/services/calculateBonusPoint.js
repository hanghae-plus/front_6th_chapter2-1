import { BONUS_POINT, PRODUCT, MESSAGE } from '../constants/constants';
import { isTodayTuesday } from '../utils/isTodayTuesday';

// 포인트 계산
export const calculateBonusPoint = ({ state, appState }) => {
  const { cartState } = state;
  const { totalAfterDiscount, totalProductCount } = appState;

  // 기본 포인트 - 총 가격 / 1000
  const basePoints = Math.floor(totalAfterDiscount / 1000);
  // 최종 포인트
  let totalPoints = 0;
  // 포인트 상세 전체 텍스트
  const pointsDetail = [];

  // 각 상품의 존재 여부
  let hasKeyboard = false;
  let hasMouse = false;
  let hasMonitorArm = false;

  // 장바구니에 상품이 없으면 적립 포인트 요소 없앰
  if (cartState.length === 0) {
    return { totalPoints: 0, pointsDetail: [] };
  }

  // 기본 포인트 출력
  if (basePoints > 0) {
    totalPoints = basePoints;
    pointsDetail.push(MESSAGE.POINT.BASE(basePoints));
  }
  // 화요일 포인트 출력
  if (isTodayTuesday()) {
    if (basePoints > 0) {
      totalPoints = basePoints * BONUS_POINT.TUESDAY_MULTIPLIER;
      pointsDetail.push(MESSAGE.POINT.TUESDAY);
    }
  }

  for (const item of cartState) {
    // 상품 존재 여부 업데이트
    if (item.id === PRODUCT.ID[1]) hasKeyboard = true;
    if (item.id === PRODUCT.ID[2]) hasMouse = true;
    if (item.id === PRODUCT.ID[3]) hasMonitorArm = true;
  }

  // 상품에 따른 포인트 추가
  if (hasKeyboard && hasMouse) {
    totalPoints += BONUS_POINT.KEYBOARD_MOUSE_SET;
    pointsDetail.push(MESSAGE.POINT.KEYBOARD_MOUSE_SET);
  }
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    totalPoints += BONUS_POINT.FULL_SET;
    pointsDetail.push(MESSAGE.POINT.FULL_SET);
  }

  if (totalProductCount >= 30) {
    totalPoints += BONUS_POINT.BULK[30];
    pointsDetail.push(MESSAGE.POINT.BULK[30]);
  } else {
    if (totalProductCount >= 20) {
      totalPoints += BONUS_POINT.BULK[20];
      pointsDetail.push(MESSAGE.POINT.BULK[20]);
    } else {
      if (totalProductCount >= 10) {
        totalPoints += BONUS_POINT.BULK[10];
        pointsDetail.push(MESSAGE.POINT.BULK[10]);
      }
    }
  }

  return { totalPoints, pointsDetail };
};
