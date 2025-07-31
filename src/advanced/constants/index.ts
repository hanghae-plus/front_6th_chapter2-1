export const PRODUCT_ONE = 'p1';
export const PRODUCT_TWO = 'p2';
export const PRODUCT_THREE = 'p3';
export const PRODUCT_FOUR = 'p4';
export const PRODUCT_FIVE = 'p5';

export const DISCOUNT_RATES = {
  PRODUCT_ONE_BULK: 0.1, // 키보드 10개 이상: 10%
  PRODUCT_TWO_BULK: 0.15, // 마우스 10개 이상: 15%
  PRODUCT_THREE_BULK: 0.2, // 모니터암 10개 이상: 20%
  PRODUCT_FIVE_BULK: 0.25, // 스피커 10개 이상: 25% (원래 코드 기준)
  TOTAL_BULK_THRESHOLD: 30, // 전체 수량 30개 이상
  TOTAL_BULK_RATE: 0.25, // 전체 수량 30개 이상: 25%
  TUESDAY_SPECIAL_RATE: 0.1, // 화요일 특별 할인: 10%
  LIGHTNING_SALE_RATE: 0.2, // 번개세일: 20%
  SUGGESTION_SALE_RATE: 0.05, // 추천 할인: 5%
};

export const LOYALTY_POINTS = {
  BASE_RATE: 0.001, // 기본 적립: 0.1%
  TUESDAY_MULTIPLIER: 2, // 화요일 2배 적립
  KEYBOARD_MOUSE_BONUS: 50, // 키보드 + 마우스 구매 시 보너스 50p
  FULL_SET_BONUS: 100, // 풀세트 구매 시 보너스 100p
  BULK_BONUS_10: 20, // 10개 이상 구매 시 20p
  BULK_BONUS_20: 50, // 20개 이상 구매 시 50p
  BULK_BONUS_30: 100, // 30개 이상 구매 시 100p
  BULK_THRESHOLD_10: 10,
  BULK_THRESHOLD_20: 20,
  BULK_THRESHOLD_30: 30,
};
