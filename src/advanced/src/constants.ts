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
  BULK: {
    p1: 0.1,
    p2: 0.15,
    p3: 0.2,
    p4: 0.05,
    p5: 0.25,
  },
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
