// 수량 관련 상수들
export const INITIAL_STOCK = {
  KEYBOARD: 50,
  MOUSE: 30,
  MONITOR_ARM: 20,
  LAPTOP_POUCH: 0, // 품절
  SPEAKER: 10,
};

// 수량 기준값들
export const QUANTITY_THRESHOLDS = {
  INDIVIDUAL_DISCOUNT: 10, // 개별 상품 할인 기준
  BULK_PURCHASE: 30, // 대량구매 기준
  LOW_STOCK_WARNING: 5, // 재고 부족 경고 기준
  TOTAL_STOCK_WARNING: 50, // 전체 재고 부족 경고
  TOTAL_STOCK_CRITICAL: 30, // 전체 재고 위험 기준
};

// 포인트 적립 기준 수량
export const POINTS_QUANTITY_THRESHOLDS = {
  SMALL_BULK: 10, // 10개 이상
  MEDIUM_BULK: 20, // 20개 이상
  LARGE_BULK: 30, // 30개 이상
};
