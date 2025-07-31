import { PRODUCT_IDS } from '../data/products';
import { CartItem, Product } from '../types';

interface BonusResult {
  bonus: number;
  detail: string;
}

interface SetBonusResult {
  bonus: number;
  details: string[];
}

interface PointsResult {
  totalPoints: number;
  details: string[];
}

// 기본 포인트 계산 (구매액의 0.1%)
export function calculateBasePoints(totalAmount: number): number {
  return Math.floor(totalAmount / 1000);
}

// 화요일 포인트 배수 적용
export function applyTuesdayBonus(basePoints: number): number {
  const today = new Date();
  const isTuesday = today.getDay() === 2;
  return isTuesday ? basePoints * 2 : basePoints;
}

// 특정 제품이 장바구니에 있는지 확인
function hasProductInCart(cartItems: CartItem[], productList: Product[], productId: string): boolean {
  return cartItems.some((item) => {
    const product = productList.find((p) => p.id === item.productId);
    return product && product.id === productId;
  });
}

// 키보드+마우스 세트 보너스 계산
function calculateKeyboardMouseBonus(cartItems: CartItem[], productList: Product[]): BonusResult {
  const hasKeyboard = hasProductInCart(cartItems, productList, PRODUCT_IDS.KEYBOARD);
  const hasMouse = hasProductInCart(cartItems, productList, PRODUCT_IDS.MOUSE);

  if (hasKeyboard && hasMouse) {
    return { bonus: 50, detail: '키보드+마우스 세트 +50p' };
  }

  return { bonus: 0, detail: '' };
}

// 풀세트 보너스 계산 (키보드+마우스+모니터암)
function calculateFullSetBonus(cartItems: CartItem[], productList: Product[]): BonusResult {
  const hasKeyboard = hasProductInCart(cartItems, productList, PRODUCT_IDS.KEYBOARD);
  const hasMouse = hasProductInCart(cartItems, productList, PRODUCT_IDS.MOUSE);
  const hasMonitorArm = hasProductInCart(cartItems, productList, PRODUCT_IDS.MONITOR_ARM);

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    return { bonus: 100, detail: '풀세트 구매 +100p' };
  }

  return { bonus: 0, detail: '' };
}

// 세트 구매 보너스 포인트 계산
export function calculateSetBonus(cartItems: CartItem[], productList: Product[]): SetBonusResult {
  let bonus = 0;
  const details: string[] = [];

  // 키보드+마우스 세트 보너스
  const keyboardMouseBonus = calculateKeyboardMouseBonus(cartItems, productList);
  bonus += keyboardMouseBonus.bonus;
  if (keyboardMouseBonus.detail) {
    details.push(keyboardMouseBonus.detail);
  }

  // 풀세트 보너스
  const fullSetBonus = calculateFullSetBonus(cartItems, productList);
  bonus += fullSetBonus.bonus;
  if (fullSetBonus.detail) {
    details.push(fullSetBonus.detail);
  }

  return { bonus, details };
}

// 대량구매 보너스 포인트 계산
export function calculateQuantityBonus(totalQuantity: number): BonusResult {
  let bonus = 0;
  let detail = '';

  switch (true) {
    case totalQuantity >= 30:
      bonus = 100;
      detail = '대량구매(30개+) +100p';
      break;
    case totalQuantity >= 20:
      bonus = 50;
      detail = '대량구매(20개+) +50p';
      break;
    case totalQuantity >= 10:
      bonus = 20;
      detail = '대량구매(10개+) +20p';
      break;
    default:
      bonus = 0;
      detail = '';
  }

  return { bonus, detail };
}

// 총 포인트 계산
export function calculateTotalPoints(totalAmount: number, cartItems: CartItem[], productList: Product[]): PointsResult {
  let basePoints = calculateBasePoints(totalAmount);
  let finalPoints = 0;
  const details: string[] = [];

  // 기본 포인트
  if (basePoints > 0) {
    finalPoints = basePoints;
    details.push(`기본: ${basePoints}p`);
  }

  // 화요일 보너스
  const tuesdayPoints = applyTuesdayBonus(basePoints);
  if (tuesdayPoints !== basePoints) {
    finalPoints = tuesdayPoints;
    details.push('화요일 2배');
  }

  // 세트 보너스
  const setBonus = calculateSetBonus(cartItems, productList);
  finalPoints += setBonus.bonus;
  details.push(...setBonus.details);

  // 대량구매 보너스
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const quantityBonus = calculateQuantityBonus(totalQuantity);
  finalPoints += quantityBonus.bonus;
  if (quantityBonus.detail) {
    details.push(quantityBonus.detail);
  }

  return {
    totalPoints: finalPoints,
    details: details,
  };
}
