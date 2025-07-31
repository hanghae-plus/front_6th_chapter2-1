// =========================
// 할인 관련 상수
// - 할인율, 임계값 등 할인 정책에 사용
// =========================
export const DISCOUNT_RATES = {
  // 개별 상품 할인율 적용 수량
  ITEM_DISCOUNT_THRESHOLD: 10,
  // 대량구매 할인 적용 수량
  BULK_PURCHASE_THRESHOLD: 30,
  // 대량구매 할인율(25%)
  BULK_PURCHASE_RATE: 0.25,
  // 화요일 특가 할인율(10%)
  TUESDAY_SPECIAL_RATE: 0.1,
  // 번개세일 할인율(20%)
  LIGHTNING_SALE_RATE: 0.2,
  // 추천세일 할인율(5%)
  SUGGEST_SALE_RATE: 0.05,
  // 화요일 요일 (0: 일, 1: 월, 2: 화)
  TUESDAY_DAY: 2,
};

// =========================
// 포인트 관련 상수
// - 포인트 적립, 보너스, 조합 등 포인트 정책에 사용
// =========================
export const POINT_RATES = {
  // 기본 포인트율(0.1%) - 결제금액의 0.1% 적립
  BASE_POINT_RATE: 0.001,
  // 화요일 포인트 2배 (화요일 결제 시 포인트 2배 적립)
  TUESDAY_BONUS_MULTIPLIER: 2,
  // 수량별 추가 보너스 포인트
  QUANTITY_BONUS: {
    // 10개 이상 구매 시 추가 보너스 포인트
    TIER_1: 20,
    // 20개 이상 구매 시 추가 보너스 포인트
    TIER_2: 50,
    // 30개 이상 구매 시 추가 보너스 포인트
    TIER_3: 100,
  },
  // 특정 상품 조합(세트) 구매 시 추가로 지급되는 보너스 포인트
  COMBO_BONUS: {
    KEYBOARD_MOUSE: 50,
    FULL_SET: 100,
  },
};

// =========================
// 수량 임계값
// - 할인/보너스 적용을 위한 수량 기준값
// =========================
export const QUANTITY_THRESHOLDS = {
  // 개별 상품 할인 임계값
  ITEM_DISCOUNT: 10,
  // 대량구매 할인 임계값
  BULK_PURCHASE: 30,

  // 보너스 포인트 임계값
  // 10개 이상 구매 시(티어1)
  BONUS_TIER_1: 10,
  // 20개 이상 구매 시(티어2)
  BONUS_TIER_2: 20,
  // 30개 이상 구매 시(티어3)
  BONUS_TIER_3: 30,
};

// =========================
// 시간 관련 상수 (ms)
// - 세일, 추천 등 시간 지연/반복에 사용
// =========================
export const TIME_DELAYS = {
  // 번개세일 지연(0~10초)
  LIGHTNING_SALE_MAX: 10000,
  // 추천세일 지연(0~20초)
  SUGGEST_SALE_MAX: 20000,
  // 번개세일 반복(30초)
  LIGHTNING_SALE_INTERVAL: 30000,
  // 추천세일 반복(60초)
  SUGGEST_SALE_INTERVAL: 60000,
};

// =========================
// UI 관련 상수
// - CSS 클래스, 색상, 투명도 등 UI 스타일 관리
// =========================
export const UI_CONSTANTS = {
  // CSS 클래스
  GRID_LAYOUT:
    'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0',
  PRODUCT_IMAGE_SIZE: 'w-20 h-20',
  PRODUCT_IMAGE_OVERLAY: 'w-[60%] h-[60%]',
  QUANTITY_MIN_WIDTH: 'min-w-[20px]',

  // 색상 클래스
  SALE_COLOR: 'text-red-500',
  SUGGEST_COLOR: 'text-blue-500',

  // 투명도/배경 관련
  OVERLAY_OPACITY: 'bg-black/50',
  GREEN_OPACITY: 'bg-green-500/20',
  WHITE_OPACITY: 'bg-white/10',
  BORDER_OPACITY: 'border-white/10',
};

// =========================
// 계산 관련 상수
// - 포인트, 할인, 수량 등 계산식에 사용
// =========================
export const CALCULATION_CONSTANTS = {
  // 포인트 계산 기준
  POINT_BASE_AMOUNT: 1000,

  // 계산 보조 상수
  PERCENTAGE_MULTIPLIER: 100,
  DISCOUNT_CALCULATION: 1,

  // 수량 관련
  DEFAULT_QUANTITY: 1,
  MIN_QUANTITY: 0,
};

// =========================
// 메시지 상수
// - 알림, 안내, 템플릿 메시지 관리
// =========================
export const MESSAGES = {
  // 알림/상태 메시지 템플릿
  LIGHTNING_SALE: '⚡번개세일! {productName}이(가) 20% 할인 중입니다!',
  SUGGEST_SALE: '💝 {productName}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!',
  EMPTY_CART: '🛍️ 0 items in cart',
  ZERO_AMOUNT: '₩0',
  LOYALTY_POINTS: '적립 포인트: {points}p',
  ZERO_POINTS: '적립 포인트: 0p',
  SAVED_AMOUNT: '₩{amount} 할인되었습니다',
};

// =========================
// 상품 조합 상수
// - 특정 상품 조합 구매 시 추가 보너스 포인트 지급 조건
// =========================
export const PRODUCT_COMBOS = {
  // 상품 조합별 추가 보너스 포인트 지급 조건 및 정보
  KEYBOARD_MOUSE: {
    products: ['keyboard', 'mouse'],
    bonusPoints: 50,
    name: '키보드+마우스 세트',
  },
  FULL_SET: {
    products: ['keyboard', 'mouse', 'monitor-arm', 'speaker'],
    bonusPoints: 100,
    name: '풀세트 구매',
  },
};

// UI 관련 상수 및 매직넘버를 한 곳에 모아 관리합니다.

export const UI_CLASSNAMES = {
  SELECTOR_CONTAINER: 'mb-6 pb-6 border-b border-gray-200',
  SELECT: 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3',
  STOCK_INFO: 'text-xs text-red-500 mt-3 whitespace-pre-line',
  // 필요시 추가
};

export const UI_IDS = {
  CART_ITEMS: 'cart-items',
  CART_TOTAL: 'cart-total',
  // 필요시 추가
};

export const UI_TEXTS = {
  SOLD_OUT: '품절',
  LOW_STOCK: '재고 부족',
  // 필요시 추가
};
