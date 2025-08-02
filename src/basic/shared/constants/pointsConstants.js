// 포인트 계산 상수
export const POINTS_CONFIG = {
  BASE_RATE: 1/1000,        // 기본 적립률 (1000원당 1포인트)
  TUESDAY_MULTIPLIER: 2,    // 화요일 배수
  
  // 세트 보너스
  COMBO_BONUS: {
    KEYBOARD_MOUSE: 50,     // 키보드+마우스 세트
    FULL_SET: 100           // 풀세트 (키보드+마우스+모니터암)
  },
  
  // 수량별 보너스
  QUANTITY_BONUS: {
    TIER_1: { min: 10, points: 20 },   // 10개 이상
    TIER_2: { min: 20, points: 50 },   // 20개 이상  
    TIER_3: { min: 30, points: 100 }   // 30개 이상
  }
};