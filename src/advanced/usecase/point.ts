import {
  BONUS_BASE_UNIT,
  BONUS_FULL_SET,
  BONUS_KEYBOARD_MOUSE,
  BONUS_POINTS_TIER1,
  BONUS_POINTS_TIER2,
  BONUS_POINTS_TIER3,
  BONUS_THRESHOLD_TIER1,
  BONUS_THRESHOLD_TIER2,
  BONUS_THRESHOLD_TIER3,
} from '../const/point';
import { KEYBOARD, MONITORARM, MOUSE } from '../data/product';
import { isTuesday } from '../utils/dateUtil';
import { CartItem } from './../store/CartContext';

export const calculateBonusPoints = (cartItems: CartItem[], totalAmount: number) => {
  let points = 0;
  const detail = [];

  const base = Math.floor(totalAmount / BONUS_BASE_UNIT);
  if (base > 0) {
    points = base;
    detail.push(`기본: ${base}p`);
  }

  if (isTuesday() && base > 0) {
    points = base * 2;
    detail.push('화요일 2배');
  }

  const productIds = cartItems.map((item) => item.productId);
  const hasKeyboard = productIds.includes(KEYBOARD);
  const hasMouse = productIds.includes(MOUSE);
  const hasMonitorArm = productIds.includes(MONITORARM);

  if (hasKeyboard && hasMouse) {
    points += BONUS_KEYBOARD_MOUSE;
    detail.push(`키보드+마우스 세트 +${BONUS_KEYBOARD_MOUSE}p`);
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    points += BONUS_FULL_SET;
    detail.push(`풀세트 구매 +${BONUS_FULL_SET}p`);
  }

  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  if (totalItemCount >= BONUS_THRESHOLD_TIER3) {
    points += BONUS_POINTS_TIER3;
    detail.push(`대량구매(${BONUS_THRESHOLD_TIER3}개+) +${BONUS_POINTS_TIER3}p`);
  } else if (totalItemCount >= BONUS_THRESHOLD_TIER2) {
    points += BONUS_POINTS_TIER2;
    detail.push(`대량구매(${BONUS_THRESHOLD_TIER2}개+) +${BONUS_POINTS_TIER2}p`);
  } else if (totalItemCount >= BONUS_THRESHOLD_TIER1) {
    points += BONUS_POINTS_TIER1;
    detail.push(`대량구매(${BONUS_THRESHOLD_TIER1}개+) +${BONUS_POINTS_TIER1}p`);
  }

  return { total: points, detail };
};
