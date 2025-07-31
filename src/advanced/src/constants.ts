export const PRODUCT = {
  ID: {
    1: 'p1',
    2: 'p2',
    3: 'p3',
    4: 'p4',
    5: 'p5',
  },

  NAME: {
    KEYBOARD: '버그 없애는 키보드',
    MOUSE: '생산성 폭발 마우스',
    MONITOR: '거북목 탈출 모니터암',
    POUCH: '에러 방지 노트북 파우치',
    SPEACKER: '코딩할 때 듣는 Lo-Fi 스피커',
  },
};

export const LOW_STOCK_THRESHOLD = 5;

export const DISCOUNT_THRESHOLD = {
  TOTAL: 30,
  BULK: 10,
};

export const DISCOUNT_RATE = {
  TUESDAY: 0.1,
  TOTAL: 0.25,
  FLASH: 0.2,
  SUGGEST: 0.05,
  BULK: {
    p1: 0.1,
    p2: 0.15,
    p3: 0.2,
    p4: 0.05,
    p5: 0.25,
  } as Record<string, number>,
};

export const BONUS_POINT = {
  TUESDAY_MULTIPLIER: 2,
  KEYBOARD_MOUSE_SET: 50,
  FULL_SET: 100,
  BULK: {
    30: 100,
    20: 50,
    10: 20,
  },
};

export const MESSAGE = {
  NO_STOCK: '재고가 부족합니다.',
  ALERT: {
    FLASH: (name: string) => `⚡번개세일! ${name}이(가) 20% 할인 중입니다!`,
    SUGGEST: (name: string) => `💝 ${name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`,
  },

  POINT: {
    BASE: (point: number) => `기본: ${point}p`,
    TUESDAY: '화요일 2배',
    KEYBOARD_MOUSE_SET: '키보드+마우스 세트 +50p',
    FULL_SET: '풀세트 구매 +100p',
    BULK: {
      30: '대량구매(30개+) +100p',
      20: '대량구매(20개+) +50p',
      10: '대량구매(10개+) +20p',
    },
  },
};
