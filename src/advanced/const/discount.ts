import { KEYBOARD, MONITORARM, MOUSE, POUCH, SPEAKER } from '../data/product';

/** 개별 상품별 최소 할인 적용 수량 기준 */
export const PER_ITEM_DISCOUNT_THRESHOLD = 10;

/** 전체 장바구니 수량 할인 및 보너스포인트 적용 임계값 */
export const CART_TOTAL_DISCOUNT_THRESHOLD = 30;

/* 번개 세일 할인율 */
export const LIGHTNING_DISCOUNT_RATE = 20 / 100;

/* 추천 세일 할인율 */
export const SUGGEST_DISCOUNT_RATE = 5 / 100;

/* 개별 상품 할인율 (PER_ITEM_DISCOUNT_THRESHOLD개 이상 담았을 때 적용됨)*/
export const PER_ITEM_DISCOUNT_RATES = {
  [KEYBOARD]: 10 / 100 /** 버그 없애는 키보드: 10% 할인 */,
  [MOUSE]: 15 / 100 /** 생산성 폭발 마우스: 15% 할인 */,
  [MONITORARM]: 20 / 100 /** 거북목 탈출 모니터암: 20% 할인 */,
  [POUCH]: 5 / 100 /** 에러 방지 노트북 파우치: 5% 할인 */,
  [SPEAKER]: 25 / 100 /** 코딩할 때 듣는 Lo-Fi 스피커: 25% 할인 */,
} as const;

/** 전체 장바구니 할인율 (30개 이상 구매 시 적용, 개별 할인과 중복 불가) */
export const CART_TOTAL_DISCOUNT_RATE = 25 / 100;

/** 매주 화요일에 적용되는 추가 할인율 (다른 할인과 중복 가능) */
export const TUESDAY_DISCOUNT_RATE = 10 / 100;
