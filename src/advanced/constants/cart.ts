// ============== 장바구니 관련 상수 ==============

export const CART_CONSTANTS = {
  // 할인 기준 수량
  INDIVIDUAL_DISCOUNT_THRESHOLD: 10,  // 개별 상품 할인 기준 (10개 이상)
  BULK_PURCHASE_THRESHOLD: 30,        // 대량구매 기준 (30개 이상)
  
  // 할인율
  BULK_PURCHASE_DISCOUNT_RATE: 0.25,  // 대량구매 할인율 (25%)
  TUESDAY_DISCOUNT_RATE: 0.10,        // 화요일 할인율 (10%)
  
  // 개별 상품별 할인율 (10개 이상 구매 시)
  INDIVIDUAL_DISCOUNT_RATES: {
    'p1': 0.10,     // 키보드 10%
    'p2': 0.15,     // 마우스 15%
    'p3': 0.20,     // 모니터암 20%
    'p4': 0.05,     // 노트북파우치 5%
    'p5': 0.25,     // 스피커 25%
  } as const,
  
  // 할인 타입
  DISCOUNT_TYPES: {
    BULK: 'bulk',
    INDIVIDUAL: 'individual',
  } as const,
  
  // 할인 메시지
  DISCOUNT_MESSAGES: {
    BULK_PURCHASE: '대량구매 할인 (25%)',
    INDIVIDUAL: '개별 상품 할인',
    TUESDAY: '화요일 할인 (10%)',
  } as const,
} as const; 