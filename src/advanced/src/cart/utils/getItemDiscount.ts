import { Product, DiscountRates, ItemDiscountResult } from 'types';

// 할인율 상수 정의
const PRODUCT_DISCOUNT_RATES: DiscountRates = {
  p1: 0.1, // keyboard
  p2: 0.15, // mouse
  p3: 0.2, // monitor arm
  p4: 0.05, // laptop pouch
  p5: 0.25, // speaker
};

const DISCOUNT_THRESHOLDS = {
  INDIVIDUAL_ITEM_MIN: 10, // 개별 상품 할인 최소 수량
} as const;

// 개별 상품 할인 계산
export const getItemDiscount = (
  product: Product,
  quantity: number
): ItemDiscountResult => {
  const itemTotal = product.val * quantity;
  let itemDiscount = 0;

  // 10개 이상 구매 시 개별 할인 적용
  if (quantity >= DISCOUNT_THRESHOLDS.INDIVIDUAL_ITEM_MIN) {
    itemDiscount = PRODUCT_DISCOUNT_RATES[product.id] || 0;
  }

  return {
    itemTotal,
    itemDiscount,
    quantity,
    product,
  };
};

// 화요일 여부 확인
export const isTuesday = (): boolean => {
  return new Date().getDay() === 2;
};
