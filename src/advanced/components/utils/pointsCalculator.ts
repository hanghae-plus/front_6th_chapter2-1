import { CartItem, Product, PRODUCT_IDS } from '../../lib/products';

export interface PointsResult {
  totalPoints: number;
  pointsDetails: string[];
}

export function calculatePoints(cartItems: CartItem[], products: Product[], finalTotal: number): PointsResult {
  if (cartItems.length === 0) {
    return { totalPoints: 0, pointsDetails: [] };
  }

  const basePoints = Math.floor(finalTotal / 1000);
  let totalPoints = 0;
  const pointsDetails: string[] = [];

  // 기본 포인트
  if (basePoints > 0) {
    totalPoints = basePoints;
    pointsDetails.push(`기본: ${basePoints}p`);
  }

  // 화요일 2배
  const today = new Date();
  const isTuesday = today.getDay() === 2;
  if (isTuesday && basePoints > 0) {
    totalPoints = basePoints * 2;
    pointsDetails.push('화요일 2배');
  }

  // 세트 보너스 확인
  const hasKeyboard = cartItems.some(
    (item) => products.find((p) => p.productId === item.productId)?.productId === PRODUCT_IDS.KEYBOARD
  );
  const hasMouse = cartItems.some(
    (item) => products.find((p) => p.productId === item.productId)?.productId === PRODUCT_IDS.MOUSE
  );
  const hasMonitorArm = cartItems.some(
    (item) => products.find((p) => p.productId === item.productId)?.productId === PRODUCT_IDS.MONITOR_ARM
  );

  // 키보드+마우스 세트
  if (hasKeyboard && hasMouse) {
    totalPoints += 50;
    pointsDetails.push('키보드+마우스 세트 +50p');
  }

  // 풀세트 (키보드+마우스+모니터암)
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    totalPoints += 100;
    pointsDetails.push('풀세트 구매 +100p');
  }

  // 대량구매 보너스
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  if (totalQuantity >= 30) {
    totalPoints += 100;
    pointsDetails.push('대량구매(30개+) +100p');
  } else if (totalQuantity >= 20) {
    totalPoints += 50;
    pointsDetails.push('대량구매(20개+) +50p');
  } else if (totalQuantity >= 10) {
    totalPoints += 20;
    pointsDetails.push('대량구매(10개+) +20p');
  }

  return { totalPoints, pointsDetails };
}
