/**
 * 이벤트 관련 상수 정의
 */

// 수량 변경 관련 상수
export const QUANTITY = {
  increment: 1,
  decrement: -1,
};

// 유효성 검증 결과 상수
export const VALIDATION_RESULTS = {
  valid: 'valid',
  remove: 'remove',
  insufficient: 'insufficient',
};

// CSS 클래스명 상수
export const CSS_CLASSES = {
  quantityChange: 'quantity-change',
  removeItem: 'remove-item',
  quantityNumber: 'quantity-number',
};

// 데이터 속성명 상수
export const DATA_ATTRIBUTES = {
  productId: 'productId',
  change: 'change',
};

// 알림 메시지 상수
export const ALERT_MESSAGES = {
  insufficientStock: '재고가 부족합니다.',
  lightningSale:
    '⚡번개세일! {productName}이(가) {discountRate}% 할인 중입니다!',
  tuesdaySpecial: '🌟 화요일 추가 할인',
  bulkPurchaseDiscount: '🎉 대량구매 할인 (30개 이상)',
  itemDiscount: '{productName} (10개↑)',
  outOfStock: '품절된 상품입니다.',
};

// 할인율 상수
export const DISCOUNT_RATES = {
  bulkPurchase: 0.25,
  tuesdaySpecial: 0.1,
  keyboard: 0.1,
  mouse: 0.15,
  monitorArm: 0.2,
  laptopCase: 0.05,
  speaker: 0.25,
};

// 수량 기준 상수
export const QUANTITY_THRESHOLDS = {
  lowStock: 5,
  individualDiscount: 10,
  bulkDiscount: 30,
};

// 포인트 관련 상수
export const POINTS = {
  baseRate: 1000,
  keyboardMouseSet: 50,
  fullSet: 100,
  bulk10: 20,
  bulk20: 50,
  bulk30: 100,
  tuesdayMultiplier: 2,
};

// 할인 관련 상수
export const DISCOUNT = {
  individualThreshold: 10,
  bulkThreshold: 30,
  bulkDiscountRate: 0.25,
  tuesdayDiscountRate: 0.1,
  tuesdayDay: 2,
};

// 재고 관련 상수
export const STOCK = {
  lowStockThreshold: 5,
};

// 날짜 관련 상수
export const DATE = {
  tuesday: 2,
};

// 타이머 관련 상수
export const TIMER = {
  suggestionDelay: 60000,
};

// UI 텍스트 상수
export const UI_TEXTS = {
  itemCount: '🛍️ {count} items in cart',
  subtotal: 'Subtotal',
  shipping: 'Shipping',
  shippingFree: 'Free',
  loyaltyPoints: '적립 포인트: {points}p',
  loyaltyPointsZero: '적립 포인트: 0p',
  totalDiscount: '총 할인율',
  discountSaved: '₩{amount} 할인되었습니다',
  pointsDetails: {
    base: '기본: {points}p',
    tuesdayBonus: '화요일 2배',
    keyboardMouseSet: '키보드+마우스 세트 +50p',
    fullSet: '풀세트 구매 +100p',
    bulk30: '대량구매(30개+) +100p',
    bulk20: '대량구매(20개+) +50p',
    bulk10: '대량구매(10개+) +20p',
  },
  stockMessages: {
    lowStock: '{productName}: 재고 부족 ({quantity}개 남음)',
    outOfStock: '{productName}: 품절',
  },
};

// CSS 스타일 상수
export const CSS_STYLES = {
  saleClasses: {
    both: 'text-purple-600',
    lightning: 'text-red-500',
    suggestion: 'text-blue-500',
  },
  fontWeight: {
    bold: 'bold',
    normal: 'normal',
  },
  display: {
    block: 'block',
    none: 'none',
  },
  hiddenClass: 'hidden',
};
