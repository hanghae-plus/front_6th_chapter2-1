// UI 관련 상수
export const UI_CONSTANTS = {
  // 재고 관련
  LOW_STOCK_THRESHOLD: 5,
  TOTAL_STOCK_THRESHOLD: 50,

  // 요일 상수
  TUESDAY: 2,

  // 타이머 관련
  LIGHTNING_SALE_INTERVAL: 30000,
  LIGHTNING_SALE_DELAY: 10000,
  SUGGEST_SALE_INTERVAL: 60000,
  SUGGEST_SALE_DELAY: 20000,

  // CSS 클래스명
  CLASSES: {
    LOW_STOCK_WARNING: 'text-red-500',
    SALE_ITEM: 'text-red-500 font-bold',
    RECOMMENDATION_ITEM: 'text-blue-500 font-bold',
    SUPER_SALE_ITEM: 'text-purple-600 font-bold',
    SOLD_OUT_ITEM: 'text-gray-400',
  },

  // 메시지
  MESSAGES: {
    INSUFFICIENT_STOCK: '재고가 부족합니다.',
    LIGHTNING_SALE: '⚡번개세일! {productName}이(가) 20% 할인 중입니다!',
    RECOMMENDATION_SALE: '💝 {productName}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!',
  },
};
