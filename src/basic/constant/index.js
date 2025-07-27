// 💰 할인율 상수
export const DISCOUNT_RATES = {
  KEYBOARD: 0.1, // 키보드 10% 할인
  MOUSE: 0.15, // 마우스 15% 할인
  MONITOR_ARM: 0.2, // 모니터암 20% 할인
  POUCH: 0.05, // 파우치 5% 할인
  SPEAKER: 0.25, // 스피커 25% 할인
  BULK_DISCOUNT: 0.25, // 대량구매 25% 할인
  TUESDAY_DISCOUNT: 0.1, // 화요일 10% 할인
  LIGHTNING_SALE: 0.2, // 번개세일 20% 할인
  SUGGEST_SALE: 0.05, // 추천할인 5% 할인
};

// 📊 임계값 상수
export const THRESHOLDS = {
  BULK_DISCOUNT_MIN: 30, // 대량구매 최소 수량
  ITEM_DISCOUNT_MIN: 10, // 개별할인 최소 수량
  LOW_STOCK_WARNING: 5, // 재고 부족 경고 임계값
  STOCK_ALERT_THRESHOLD: 50, // 재고 알림 임계값
  POINTS_PER_WON: 1000, // 포인트 적립 기준 (1000원당 1포인트)
};

// 🎁 포인트 보너스 상수
export const POINT_BONUSES = {
  KEYBOARD_MOUSE_SET: 50, // 키보드+마우스 세트 보너스
  FULL_SET: 100, // 풀세트 보너스
  BULK_10: 20, // 10개 이상 보너스
  BULK_20: 50, // 20개 이상 보너스
  BULK_30: 100, // 30개 이상 보너스
  TUESDAY_MULTIPLIER: 2, // 화요일 포인트 배수
};

// ⏰ 타이머 상수 (밀리초)
export const TIMERS = {
  LIGHTNING_SALE_INTERVAL: 30000, // 번개세일 간격 (30초)
  SUGGEST_SALE_INTERVAL: 60000, // 추천세일 간격 (60초)
  MAX_INITIAL_DELAY: 20000, // 최대 초기 지연시간 (20초)
  MAX_LIGHTNING_DELAY: 10000, // 최대 번개세일 지연시간 (10초)
};

// 📅 날짜 상수
export const DAYS = {
  TUESDAY: 2, // 화요일 (getDay() 반환값)
};
