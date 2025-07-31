import { POINTS_POLICY } from './constants.js';
import { calculateTotalItemCount } from './cart.js';

// 포인트 관련 상수
const POINT_CONSTANTS = {
  BONUS_THRESHOLDS: {
    BULK_30: 30,  // 대량구매 보너스 기준 (30개)
    BULK_20: 20,  // 대량구매 보너스 기준 (20개)
    BULK_10: 10   // 대량구매 보너스 기준 (10개)
  },
  PRODUCT_IDS: {
    KEYBOARD: 'p1',
    MOUSE: 'p2',
    MONITOR_ARM: 'p3'
  }
};

// 기본 포인트 계산
export const calculateBasePoint = (totalPrice) => {
  return Math.floor(totalPrice * POINTS_POLICY.BASE_RATE);
};

// 보너스 포인트 계산
export const calculateBonusPoint = () => {
  const cartItems = document.getElementById('cart-items');
  if (!cartItems || cartItems.children.length === 0) return 0;

  let bonusPoints = 0;
  let hasKeyboard = false;
  let hasMouse = false;
  let hasMonitorArm = false;
  let totalItemCount = calculateTotalItemCount();

  // 세트 구매 보너스 확인
  for (let i = 0; i < cartItems.children.length; i++) {
    const cartItem = cartItems.children[i];
    const productId = cartItem.id;
    
    if (productId === POINT_CONSTANTS.PRODUCT_IDS.KEYBOARD) hasKeyboard = true;
    if (productId === POINT_CONSTANTS.PRODUCT_IDS.MOUSE) hasMouse = true;
    if (productId === POINT_CONSTANTS.PRODUCT_IDS.MONITOR_ARM) hasMonitorArm = true;
  }

  // 키보드+마우스 세트 보너스
  if (hasKeyboard && hasMouse) {
    bonusPoints += POINTS_POLICY.KEYBOARD_MOUSE_BONUS;
  }

  // 풀세트 보너스
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    bonusPoints += POINTS_POLICY.FULL_SET_BONUS;
  }

  // 수량별 보너스
  if (totalItemCount >= POINT_CONSTANTS.BONUS_THRESHOLDS.BULK_30) {
    bonusPoints += POINTS_POLICY.BULK_PURCHASE_BONUS[POINT_CONSTANTS.BONUS_THRESHOLDS.BULK_30];
  } else if (totalItemCount >= POINT_CONSTANTS.BONUS_THRESHOLDS.BULK_20) {
    bonusPoints += POINTS_POLICY.BULK_PURCHASE_BONUS[POINT_CONSTANTS.BONUS_THRESHOLDS.BULK_20];
  } else if (totalItemCount >= POINT_CONSTANTS.BONUS_THRESHOLDS.BULK_10) {
    bonusPoints += POINTS_POLICY.BULK_PURCHASE_BONUS[POINT_CONSTANTS.BONUS_THRESHOLDS.BULK_10];
  }

  return bonusPoints;
};

// 보너스 포인트 텍스트 생성
export const getBonusPointText = () => {
  const cartItems = document.getElementById('cart-items');
  if (!cartItems || cartItems.children.length === 0) return '없음';

  let bonusTexts = [];
  let hasKeyboard = false;
  let hasMouse = false;
  let hasMonitorArm = false;
  let totalItemCount = calculateTotalItemCount();

  // 세트 구매 보너스 확인
  for (let i = 0; i < cartItems.children.length; i++) {
    const cartItem = cartItems.children[i];
    const productId = cartItem.id;
    
    if (productId === POINT_CONSTANTS.PRODUCT_IDS.KEYBOARD) hasKeyboard = true;
    if (productId === POINT_CONSTANTS.PRODUCT_IDS.MOUSE) hasMouse = true;
    if (productId === POINT_CONSTANTS.PRODUCT_IDS.MONITOR_ARM) hasMonitorArm = true;
  }

  // 키보드+마우스 세트 보너스
  if (hasKeyboard && hasMouse) {
    bonusTexts.push('키보드+마우스 세트 +50p');
  }

  // 풀세트 보너스
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    bonusTexts.push('풀세트 구매 +100p');
  }

  // 수량별 보너스
  if (totalItemCount >= POINT_CONSTANTS.BONUS_THRESHOLDS.BULK_30) {
    bonusTexts.push('대량구매(30개+) +100p');
  } else if (totalItemCount >= POINT_CONSTANTS.BONUS_THRESHOLDS.BULK_20) {
    bonusTexts.push('대량구매(20개+) +50p');
  } else if (totalItemCount >= POINT_CONSTANTS.BONUS_THRESHOLDS.BULK_10) {
    bonusTexts.push('대량구매(10개+) +20p');
  }

  return bonusTexts.length > 0 ? bonusTexts.join(', ') : '없음';
}; 