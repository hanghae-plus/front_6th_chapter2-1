// ===== 할인 규칙 =====
export const DISCOUNT_RATES = {
  bulkPurchase: {
    threshold: 30,
    rate: 0.25,
  },

  // 개별 상품 할인 (10개 이상 구매 시)
  individual: {
    threshold: 10,
    rates: {
      keyboard: 0.1,
      mouse: 0.15,
      monitorArm: 0.2,
      laptopPouch: 0.05,
      speaker: 0.25,
    },
  },

  tuesdaySpecial: {
    rate: 0.1,
  },
};

// ===== 재고 관리 =====
export const STOCK_THRESHOLDS = {
  lowStock: 5,
  warningTotal: 50,
};

// ===== 포인트 적립 =====
export const LOYALTY_POINTS = {
  baseRate: 1000,

  setBonuses: {
    keyboardMouse: 50, // 키보드+마우스
    fullSet: 100, // 키보드+마우스+모니터암
  },

  bulkBonuses: {
    small: { threshold: 10, points: 20 }, // 10개+
    medium: { threshold: 20, points: 50 }, // 20개+
    large: { threshold: 30, points: 100 }, // 30개+
  },

  tuesdayMultiplier: 2,
};

// ===== 세일 이벤트 =====
export const SALE_EVENTS = {
  lightning: {
    discountRate: 0.2, // 20% 할인 (80% 가격)
    priceMultiplier: 0.8, // 80/100
    duration: 30000, // 30초
  },
  suggestion: {
    discountRate: 0.05, // 5% 할인
    priceMultiplier: 0.95, // (100-5)/100
  },
};

// ===== 타이머 상수 =====
export const TIMERS = {
  lightningDelayMax: 10000, // 번개세일 최대 지연시간 (10초)
  suggestionDelayMax: 20000, // 추천세일 최대 지연시간 (20초)
  saleInterval: 30000, // 세일 간격 (30초)
};

// ===== 요일 상수 =====
export const DAYS_OF_WEEK = {
  tuesday: 2, // 0=일요일, 1=월요일, 2=화요일
};

// ===== 기타 상수 =====
export const PARSING = {
  radix: 10, // parseInt 기본 진법
};

// ===== 상품 ID =====
export const PRODUCT_IDS = {
  keyboard: 'p1',
  mouse: 'p2',
  monitorArm: 'p3',
  laptopPouch: 'p4',
  speaker: 'p5',
};
