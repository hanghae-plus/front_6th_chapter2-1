// 포인트 적립 기준
export const POINT_RATES = {
  BASE_RATE: 0.001, // 0.1% (1000원당 1포인트)
  TUESDAY_MULTIPLIER: 2,
};

// 포인트 보너스
export const POINT_BONUS = {
  SET_BONUS: 50, // 키보드+마우스 세트
  FULL_SET_BONUS: 100, // 풀세트 (키보드+마우스+모니터암)
  QUANTITY_BONUS_10: 20, // 10개 이상
  QUANTITY_BONUS_20: 50, // 20개 이상
  QUANTITY_BONUS_30: 100, // 30개 이상
};

// 포인트 적립 조건
export const POINT_CONDITIONS = {
  MIN_QUANTITY_FOR_BONUS: 10,
  MIN_QUANTITY_FOR_SET: 1, // 세트 보너스는 각 상품 1개씩만 있으면 됨
};
