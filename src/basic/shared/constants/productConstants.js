// 상품 ID 상수
export const PRODUCT_IDS = {
  KEYBOARD: "p1",
  MOUSE: "p2", 
  MONITOR_ARM: "p3",
  LAPTOP_POUCH: "p4",
  SPEAKER: "p5"
};

// 할인율 상수
export const DISCOUNT_RATES = {
  INDIVIDUAL: {
    KEYBOARD: 0.1,        // 10%
    MOUSE: 0.15,          // 15%
    MONITOR_ARM: 0.2,     // 20%
    LAPTOP_POUCH: 0.05,   // 5%
    SPEAKER: 0.25         // 25%
  },
  BULK: 0.25,             // 25% (30개 이상)
  TUESDAY: 0.1,           // 10% (화요일)
  LIGHTNING: 0.2,         // 20% (번개세일)
  SUGGESTED: 0.05         // 5% (추천할인)
};

// 수량 임계값 상수
export const QUANTITY_THRESHOLDS = {
  INDIVIDUAL_DISCOUNT: 10,  // 개별 할인 적용 수량
  BULK_DISCOUNT: 30,        // 대량 할인 적용 수량
  LOW_STOCK: 5              // 재고 부족 알림 수량
};