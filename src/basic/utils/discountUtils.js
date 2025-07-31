import { PRODUCT_IDS } from '../data/products';

// 할인 기준값
export const DISCOUNT_THRESHOLDS = {
  ITEM: 10, // 개별 상품 할인 적용 최소 수량
  BULK: 30, // 대량구매 할인 적용 최소 수량
};

// 상품별 할인율
export const DISCOUNT_RATES = {
  [PRODUCT_IDS.KEYBOARD]: 0.1, // 키보드 10% 할인
  [PRODUCT_IDS.MOUSE]: 0.15, // 마우스 15% 할인
  [PRODUCT_IDS.MONITOR_ARM]: 0.2, // 모니터암 20% 할인
  [PRODUCT_IDS.POUCH]: 0.05, // 파우치 5% 할인
  [PRODUCT_IDS.SPEAKER]: 0.25, // 스피커 25% 할인
};

// 화요일 할인 설정
export const TUESDAY_DISCOUNT = 0.1; // 화요일 10% 할인
