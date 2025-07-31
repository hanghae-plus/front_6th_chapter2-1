// UI 관련 공통 상수
export const UI_CONSTANTS = {
  COLORS: {
    // 할인 관련 색상
    SALE_PRICE: 'text-red-500',           // 번개세일 할인 가격 색상
    SUGGESTED_PRICE: 'text-blue-500',     // 추천할인 가격 색상
    DUAL_SALE_PRICE: 'text-purple-600',   // 번개세일+추천할인 가격 색상
    ORIGINAL_PRICE: 'text-gray-400',      // 원래 가격 색상 (취소선)
    
    // 기본 텍스트 색상
    DEFAULT_TEXT: 'text-black',           // 기본 텍스트 색상
    GRAY_TEXT: 'text-gray-500',           // 회색 텍스트 색상
    LIGHT_GRAY_TEXT: 'text-gray-400',     // 연한 회색 텍스트 색상
    DARK_GRAY_TEXT: 'text-gray-700',      // 진한 회색 텍스트 색상
    LIGHTER_GRAY_TEXT: 'text-gray-300',   // 더 연한 회색 텍스트 색상
    
    // 포인트 관련 색상
    POINTS_TEXT: 'text-blue-400',         // 포인트 텍스트 색상
    DISCOUNT_TEXT: 'text-purple-400',     // 할인 텍스트 색상
    
    // 경고/에러 색상
    ERROR_TEXT: 'text-red-500',           // 에러/경고 텍스트 색상
  },
  
  ICONS: {
    LIGHTNING_SALE: '⚡',                  // 번개세일 아이콘
    SUGGESTED_SALE: '💝',                  // 추천할인 아이콘
    DUAL_SALE: '⚡💝',                     // 번개세일+추천할인 아이콘
    CART: '🛍️',                          // 장바구니 아이콘
  },
  
  THRESHOLDS: {
    BOLD_TEXT_QUANTITY: 10,               // 굵은 글씨 표시 기준 수량
  },
  
  MESSAGES: {
    EMPTY_CART: '장바구니가 비어있습니다.',
    DISCOUNT_APPLIED: '할인되었습니다',
  }
}; 