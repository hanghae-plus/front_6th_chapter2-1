export const DISCOUNT = {
  BULK: {
    THRESHOLD: 30, // 수량 기준
    RATE: 0.75, // 25% 할인율
    PERCENT: 25, // 25%
  },
  TUESDAY: {
    WEEKDAY: 2, // 화요일
    RATE: 0.9, // 10% 할인율
    PERCENT: 10, // 10%
  },
} as const;

export const ITEM_DISCOUNT = {
  THRESHOLD: 10, // 수량 기준
  RATES: {
    default: 0,
    p1: 0.1, // 10%
    p2: 0.15, // 15%
    p3: 0.2, // 20%
    p4: 0.05, // 5%
    p5: 0.25, // 25%
  },
} as const;

export const DISCOUNT_CONFIG = {
  LIGHTNING: {
    INTERVAL: 30000,
    DISCOUNT_RATE: 20,
    ALERT_MESSAGE: `⚡번개세일! {name}이(가) 20% 할인 중입니다!`, // 백틱 사용
    delay: Math.random() * 10000,
  },
  RECOMMENDATION: {
    INTERVAL: 60000,
    DISCOUNT_RATE: 5,
    ALERT_MESSAGE: ` {name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`, // 백틱 사용
    delay: Math.random() * 20000,
  },
} as const;
