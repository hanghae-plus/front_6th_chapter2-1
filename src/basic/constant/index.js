export const LIGHTNING_DELAY = Math.random() * 10000;
export const SUGGEST_DELAY = Math.random() * 20000;

export const LIGHTNING_INTERVAL = 30000;
export const SUGGEST_INTERVAL = 60000;

export const PRODUCT_IDS = {
  P1: 'p1', // 버그 없애는 키보드
  P2: 'p2', // 생산성 폭발 마우스
  P3: 'p3', // 거북목 탈출 모니터암
  P4: 'p4', // 에러 방지 노트북 파우치
  P5: 'p5', // 코딩할 때 듣는 Lo-Fi 스피커
};

export const DISCOUNT_RATES = {
  INDIVIDUAL: {
    [PRODUCT_IDS.P1]: 0.1,
    [PRODUCT_IDS.P2]: 0.15,
    [PRODUCT_IDS.P3]: 0.2,
    [PRODUCT_IDS.P5]: 0.25,
  },
  BULK: 0.25,
  TUESDAY: 0.1,
};
