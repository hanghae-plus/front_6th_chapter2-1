// src/advanced/utils/calculator.ts
import { CartItem, Product } from '../types';
import { PRODUCT_ID, DISCOUNT, POINTS } from '../../basic/constants';

// 장바구니의 각 아이템에 대한 소계를 계산
function calculateItemTotal(item: CartItem, product: Product): number {
  return product.val * item.quantity;
}

// 전체 소계 계산
export function calculateSubtotal(cart: CartItem[], products: Product[]): number {
  return cart.reduce((total, item) => {
    const product = products.find((p) => p.id === item.id);
    return total + (product ? calculateItemTotal(item, product) : 0);
  }, 0);
}

// 개별 아이템 및 전체 수량에 따른 할인 정보 계산
export function calculateDiscounts(cart: CartItem[], products: Product[]) {
  let totalDiscount = 0;
  const itemDiscounts = [];
  let bulkDiscountRate = 0;

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (totalQuantity >= DISCOUNT.BULK_DISCOUNT_THRESHOLD) {
    bulkDiscountRate = DISCOUNT.BULK_DISCOUNT_RATE;
  } else {
    cart.forEach((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) return;

      let discountRate = 0;
      if (item.quantity >= 10) {
        switch (product.id) {
          case PRODUCT_ID.P1: discountRate = DISCOUNT.KEYBOARD_DISCOUNT_RATE; break;
          case PRODUCT_ID.P2: discountRate = DISCOUNT.MOUSE_DISCOUNT_RATE; break;
          case PRODUCT_ID.P3: discountRate = DISCOUNT.MONITOR_ARM_DISCOUNT_RATE; break;
          case PRODUCT_ID.P5: discountRate = DISCOUNT.SPEAKER_DISCOUNT_RATE; break;
          default: break;
        }
      }

      if (discountRate > 0) {
        const discountAmount = calculateItemTotal(item, product) * discountRate;
        totalDiscount += discountAmount;
        itemDiscounts.push({ name: product.name, discount: discountRate * 100 });
      }
    });
  }

  return { totalDiscount, itemDiscounts, bulkDiscountRate };
}

// 화요일 할인 적용
export function applyTuesdayDiscount(total: number, date: Date): number {
  if (date.getDay() === 2 && total > 0) { // 화요일
    return total * (1 - DISCOUNT.TUESDAY_DISCOUNT_RATE);
  }
  return total;
}

// 최종 결제 금액 계산
export function calculateTotal(subtotal: number, totalDiscount: number, bulkDiscountRate: number, date: Date): number {
  let total = subtotal;
  if (bulkDiscountRate > 0) {
    total = subtotal * (1 - bulkDiscountRate);
  } else {
    total = subtotal - totalDiscount;
  }
  return applyTuesdayDiscount(total, date);
}

// 포인트 계산
export function calculatePoints(cart: CartItem[], total: number, products: Product[], date: Date) {
  if (cart.length === 0) return { finalPoints: 0, pointsDetail: [] };

  let basePoints = Math.floor(total * POINTS.BASE_POINT_RATE);
  let finalPoints = basePoints;
  const pointsDetail = [];

  if (basePoints > 0) {
    pointsDetail.push(`기본: ${basePoints}p`);
  }

  if (date.getDay() === 2 && basePoints > 0) {
    finalPoints *= POINTS.TUESDAY_BONUS_RATE;
    pointsDetail.push('화요일 2배');
  }

  const hasProduct = (productId: string) => cart.some((item) => item.id === productId);
  const hasKeyboard = hasProduct(PRODUCT_ID.P1);
  const hasMouse = hasProduct(PRODUCT_ID.P2);
  const hasMonitorArm = hasProduct(PRODUCT_ID.P3);

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints += POINTS.FULL_SET_BONUS;
    pointsDetail.push(`풀세트 구매 +${POINTS.FULL_SET_BONUS}p`);
  }
  if (hasKeyboard && hasMouse) {
    finalPoints += POINTS.KEYBOARD_MOUSE_SET_BONUS;
    pointsDetail.push(`키보드+마우스 세트 +${POINTS.KEYBOARD_MOUSE_SET_BONUS}p`);
  }

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const bulkBonus = [
    POINTS.BULK_PURCHASE_BONUS.LEVEL_3,
    POINTS.BULK_PURCHASE_BONUS.LEVEL_2,
    POINTS.BULK_PURCHASE_BONUS.LEVEL_1,
  ].find((bonus) => totalQuantity >= bonus.threshold);

  if (bulkBonus) {
    finalPoints += bulkBonus.points;
    pointsDetail.push(`대량구매(${bulkBonus.threshold}개+) +${bulkBonus.points}p`);
  }

  return { finalPoints, pointsDetail };
}
