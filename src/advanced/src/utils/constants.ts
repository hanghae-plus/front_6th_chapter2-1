export const DISCOUNT_THRESHOLDS = {
  ITEM: 10, // main.original.js에서는 10개 이상일 때 개별 상품 할인
  BULK: 30, // main.original.js에서는 30개 이상일 때 전체 수량 할인
};

export const DISCOUNT_RATES = {
  p1: 0.1, // 키보드 10개 이상 10%
  p2: 0.15, // 마우스 10개 이상 15%
  p3: 0.2, // 모니터암 10개 이상 20%
  p4: 0.05, // 파우치 10개 이상 5%
  p5: 0.25, // 스피커 10개 이상 25%
  BULK: 0.25, // 30개 이상 25%
  TUESDAY: 0.1, // 화요일 10%
  LIGHTNING_SALE: 0.2, // 번개세일 20%
  SUGGEST_SALE: 0.05, // 추천할인 5%
};

export const BONUS = {
  TUES_DAY_X2: 2,
  SET_KM: 50,
  SET_FULL: 100,
  QTY10: 20,
  QTY20: 50,
  QTY30: 100,
};

export const STOCK_ALERT = 5; // main.original.js에서 재고 부족 기준은 5개 미만
