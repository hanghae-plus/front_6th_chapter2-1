// ==========================================
// 타입 정의
// ==========================================

export interface DiscountRates {
  readonly KEYBOARD: number;
  readonly MOUSE: number;
  readonly MONITOR_ARM: number;
  readonly POUCH: number;
  readonly SPEAKER: number;
  readonly BULK_DISCOUNT: number;
  readonly TUESDAY_DISCOUNT: number;
  readonly LIGHTNING_SALE: number;
  readonly SUGGEST_SALE: number;
}

export interface Thresholds {
  readonly BULK_DISCOUNT_MIN: number;
  readonly BULK_20_MIN: number;
  readonly ITEM_DISCOUNT_MIN: number;
  readonly LOW_STOCK_WARNING: number;
  readonly STOCK_ALERT_THRESHOLD: number;
  readonly STOCK_MANAGEMENT_THRESHOLD: number;
  readonly POINTS_PER_WON: number;
}

export interface PointBonuses {
  readonly KEYBOARD_MOUSE_SET: number;
  readonly FULL_SET: number;
  readonly BULK_10: number;
  readonly BULK_20: number;
  readonly BULK_30: number;
  readonly TUESDAY_MULTIPLIER: number;
}

export interface Timers {
  readonly LIGHTNING_SALE_INTERVAL: number;
  readonly SUGGEST_SALE_INTERVAL: number;
  readonly MAX_INITIAL_DELAY: number;
  readonly MAX_LIGHTNING_DELAY: number;
}

export interface Days {
  readonly TUESDAY: number;
}

export interface ProductPrices {
  readonly KEYBOARD: number;
  readonly MOUSE: number;
  readonly MONITOR_ARM: number;
  readonly POUCH: number;
  readonly SPEAKER: number;
}

export interface InitialStock {
  readonly KEYBOARD: number;
  readonly MOUSE: number;
  readonly MONITOR_ARM: number;
  readonly POUCH: number;
  readonly SPEAKER: number;
}

export interface UIConstants {
  readonly INITIAL_CART_COUNT: number;
  readonly INITIAL_CART_AMOUNT: number;
  readonly INITIAL_BONUS_POINTS: number;
}

export interface BonusRule {
  readonly threshold: number;
  readonly bonus: number;
  readonly name: string;
}

// ==========================================
// 상수 정의
// ==========================================

// 💰 할인율 상수
export const DISCOUNT_RATES: DiscountRates = {
  KEYBOARD: 0.1, // 키보드 10% 할인
  MOUSE: 0.15, // 마우스 15% 할인
  MONITOR_ARM: 0.2, // 모니터암 20% 할인
  POUCH: 0.05, // 파우치 5% 할인
  SPEAKER: 0.25, // 스피커 25% 할인
  BULK_DISCOUNT: 0.25, // 대량구매 25% 할인
  TUESDAY_DISCOUNT: 0.1, // 화요일 10% 할인
  LIGHTNING_SALE: 0.2, // 번개세일 20% 할인
  SUGGEST_SALE: 0.05, // 추천할인 5% 할인
} as const;

// 📊 임계값 상수
export const THRESHOLDS: Thresholds = {
  BULK_DISCOUNT_MIN: 30, // 대량구매 최소 수량
  BULK_20_MIN: 20, // 20개 이상 보너스 기준
  ITEM_DISCOUNT_MIN: 10, // 개별할인 최소 수량
  LOW_STOCK_WARNING: 5, // 재고 부족 경고 임계값
  STOCK_ALERT_THRESHOLD: 50, // 재고 알림 임계값
  STOCK_MANAGEMENT_THRESHOLD: 30, // 재고 관리 임계값
  POINTS_PER_WON: 1000, // 포인트 적립 기준 (1000원당 1포인트)
} as const;

// 🎁 포인트 보너스 상수
export const POINT_BONUSES: PointBonuses = {
  KEYBOARD_MOUSE_SET: 50, // 키보드+마우스 세트 보너스
  FULL_SET: 100, // 풀세트 보너스
  BULK_10: 20, // 10개 이상 보너스
  BULK_20: 50, // 20개 이상 보너스
  BULK_30: 100, // 30개 이상 보너스
  TUESDAY_MULTIPLIER: 2, // 화요일 포인트 배수
} as const;

// ⏰ 타이머 상수 (밀리초)
export const TIMERS: Timers = {
  LIGHTNING_SALE_INTERVAL: 30000, // 번개세일 간격 (30초)
  SUGGEST_SALE_INTERVAL: 60000, // 추천세일 간격 (60초)
  MAX_INITIAL_DELAY: 20000, // 최대 초기 지연시간 (20초)
  MAX_LIGHTNING_DELAY: 10000, // 최대 번개세일 지연시간 (10초)
} as const;

// 📅 날짜 상수
export const DAYS: Days = {
  TUESDAY: 2, // 화요일 (getDay() 반환값)
} as const;

// 💳 상품 가격 상수 (원)
export const PRODUCT_PRICES: ProductPrices = {
  KEYBOARD: 10000, // 키보드 가격
  MOUSE: 20000, // 마우스 가격
  MONITOR_ARM: 30000, // 모니터암 가격
  POUCH: 15000, // 파우치 가격
  SPEAKER: 25000, // 스피커 가격
} as const;

// 📦 초기 재고 상수
export const INITIAL_STOCK: InitialStock = {
  KEYBOARD: 50, // 키보드 초기 재고
  MOUSE: 30, // 마우스 초기 재고
  MONITOR_ARM: 20, // 모니터암 초기 재고
  POUCH: 0, // 파우치 초기 재고 (품절)
  SPEAKER: 10, // 스피커 초기 재고
} as const;

// 🎨 UI 관련 상수
export const UI_CONSTANTS: UIConstants = {
  INITIAL_CART_COUNT: 0, // 초기 장바구니 수량
  INITIAL_CART_AMOUNT: 0, // 초기 장바구니 금액
  INITIAL_BONUS_POINTS: 0, // 초기 보너스 포인트
} as const;

// 🎁 보너스 규칙 데이터 (if-else 체인 → 데이터 기반)
export const BONUS_RULES: readonly BonusRule[] = [
  {
    threshold: THRESHOLDS.BULK_DISCOUNT_MIN, // 30
    bonus: POINT_BONUSES.BULK_30, // 100
    name: `${THRESHOLDS.BULK_DISCOUNT_MIN}개+`,
  },
  {
    threshold: THRESHOLDS.BULK_20_MIN, // 20
    bonus: POINT_BONUSES.BULK_20, // 50
    name: `${THRESHOLDS.BULK_20_MIN}개+`,
  },
  {
    threshold: THRESHOLDS.ITEM_DISCOUNT_MIN, // 10
    bonus: POINT_BONUSES.BULK_10, // 20
    name: `${THRESHOLDS.ITEM_DISCOUNT_MIN}개+`,
  },
] as const;