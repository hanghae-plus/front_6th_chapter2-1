// =========================
// 할인 관련 상수
// =========================
export const DISCOUNT_RATES = {
  ITEM_DISCOUNT_THRESHOLD: 10,
  BULK_PURCHASE_THRESHOLD: 30,
  BULK_PURCHASE_RATE: 0.25,
  TUESDAY_SPECIAL_RATE: 0.1,
  LIGHTNING_SALE_RATE: 0.2,
  SUGGEST_SALE_RATE: 0.05,
  TUESDAY_DAY: 2,
};

// =========================
// 포인트 관련 상수
// =========================
export const POINT_RATES = {
  BASE_POINT_RATE: 0.001,
  TUESDAY_BONUS_MULTIPLIER: 2,
  QUANTITY_BONUS: {
    TIER_1: 20,
    TIER_2: 50,
    TIER_3: 100,
  },
  COMBO_BONUS: {
    KEYBOARD_MOUSE: 50,
    FULL_SET: 100,
  },
};

// =========================
// 수량 임계값
// =========================
export const QUANTITY_THRESHOLDS = {
  ITEM_DISCOUNT: 10,
  BULK_PURCHASE: 30,
  BONUS_TIER_1: 10,
  BONUS_TIER_2: 20,
  BONUS_TIER_3: 30,
};

// =========================
// 시간 관련 상수 (ms)
// =========================
export const TIME_DELAYS = {
  LIGHTNING_SALE_MAX: 10000,
  SUGGEST_SALE_MAX: 20000,
  LIGHTNING_SALE_INTERVAL: 30000,
  SUGGEST_SALE_INTERVAL: 60000,
};

// =========================
// UI 관련 상수
// =========================
export const UI_CONSTANTS = {
  GRID_LAYOUT:
    'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0',
  PRODUCT_IMAGE_SIZE: 'w-20 h-20',
  PRODUCT_IMAGE_OVERLAY: 'w-[60%] h-[60%]',
  QUANTITY_MIN_WIDTH: 'min-w-[20px]',
  SALE_COLOR: 'text-red-500',
  SUGGEST_COLOR: 'text-blue-500',
  OVERLAY_OPACITY: 'bg-black/50',
  GREEN_OPACITY: 'bg-green-500/20',
  WHITE_OPACITY: 'bg-white/10',
  BORDER_OPACITY: 'border-white/10',
};

export const CALCULATION_CONSTANTS = {
  POINT_BASE_AMOUNT: 1000,
  PERCENTAGE_MULTIPLIER: 100,
  DISCOUNT_CALCULATION: 1,
  DEFAULT_QUANTITY: 1,
  MIN_QUANTITY: 0,
};

export const MESSAGES = {
  LIGHTNING_SALE: '⚡번개세일! {productName}이(가) 20% 할인 중입니다!',
  SUGGEST_SALE: '💝 {productName}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!',
  EMPTY_CART: '🛍️ 0 items in cart',
  ZERO_AMOUNT: '₩0',
  LOYALTY_POINTS: '적립 포인트: {points}p',
  ZERO_POINTS: '적립 포인트: 0p',
  SAVED_AMOUNT: '₩{amount} 할인되었습니다',
};

export const PRODUCT_COMBOS = {
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

export const UI_CLASSNAMES = {
  SELECTOR_CONTAINER: 'mb-6 pb-6 border-b border-gray-200',
  SELECT: 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3',
  STOCK_INFO: 'text-xs text-red-500 mt-3 whitespace-pre-line',
};

export const UI_IDS = {
  CART_ITEMS: 'cart-items',
  CART_TOTAL: 'cart-total',
};

export const UI_TEXTS = {
  SOLD_OUT: '품절',
  LOW_STOCK: '재고 부족',
};
