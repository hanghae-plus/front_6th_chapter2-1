// ============== UI 관련 상수들 ==============

export const UI_CONSTANTS = {
  // 텍스트 상수
  TEXT: {
    // 헤더 관련
    STORE_NAME: '🛒 Hanghae Online Store',
    SHOPPING_CART: 'Shopping Cart',
    ITEM_SINGULAR: 'item',
    ITEM_PLURAL: 'items',
    IN_CART: ' in cart',
    CART_ICON: '🛍️',

    // 상품 선택 관련
    SALE_SUFFIX: ' ⚡SALE',
    RECOMMENDED_SUFFIX: ' 💝추천',
    OUT_OF_STOCK: '품절',
    SUPER_SALE: '25% SUPER SALE!',
    LIGHTNING_SALE: '20% SALE!',
    RECOMMENDED_SALE: '5% 추천!',
    ADD_TO_CART: 'Add to Cart',

    // 장바구니 관련
    EMPTY_CART: '장바구니가 비어있습니다.',
    REMOVE: 'Remove',
    PRODUCT: 'PRODUCT',

    // 할인 관련
    BULK_DISCOUNT: '🎉 대량구매 할인 (30개 이상)',
    BULK_DISCOUNT_RATE: '-25%',
    TUESDAY_DISCOUNT: '🌟 화요일 추가 할인',
    TUESDAY_DISCOUNT_RATE: '-10%',
    SHIPPING: 'Shipping',
    FREE_SHIPPING: 'Free',
    TOTAL: 'Total',
    SUBTOTAL: 'Subtotal',
    DISCOUNT_APPLIED: '할인되었습니다',
    TOTAL_DISCOUNT_RATE: '총 할인율',
    LOYALTY_POINTS: '적립 포인트: ',
    PROCEED_TO_CHECKOUT: 'Proceed to Checkout',
    FREE_SHIPPING_NOTICE: 'Free shipping on all orders.',
    POINTS_NOTICE: 'Earn loyalty points with purchase.',
    TUESDAY_SPECIAL: 'Tuesday Special 10% Applied',

    // 도움말 관련
    MANUAL_TITLE: '📖 이용 안내',
    DISCOUNT_POLICY: '💰 할인 정책',
    POINTS_POLICY: '🎁 포인트 적립',
    TIP: '💡 TIP',
    INDIVIDUAL_PRODUCTS: '개별 상품',
    TOTAL_QUANTITY: '전체 수량',
    SPECIAL_DISCOUNT: '특별 할인',
    BASIC_POINTS: '기본',
    ADDITIONAL_POINTS: '추가',
  },

  // 색상 클래스
  COLORS: {
    // 할인 관련 색상
    LIGHTNING_SALE: 'text-red-500',
    RECOMMENDED_SALE: 'text-blue-500',
    DUAL_SALE: 'text-purple-600',
    OUT_OF_STOCK: 'text-gray-400',
    
    // 할인 표시 색상
    DISCOUNT_GREEN: 'text-green-400',
    TUESDAY_PURPLE: 'text-purple-400',
    GRAY_TEXT: 'text-gray-400',
    GRAY_500: 'text-gray-500',
    GRAY_700: 'text-gray-700',
    GRAY_300: 'text-gray-300',
    
    // 포인트 관련 색상
    POINTS_BLUE: 'text-blue-400',
  },

  // 아이콘
  ICONS: {
    LIGHTNING: '⚡',
    RECOMMENDED: '💝',
    DUAL_SALE: '⚡💝',
    BULK_DISCOUNT: '🎉',
    TUESDAY_DISCOUNT: '🌟',
    STORE: '🛒',
    CART: '🛍️',
    MANUAL: '📖',
    DISCOUNT: '💰',
    POINTS: '🎁',
    TIP: '💡',
  },

  // 임계값
  THRESHOLDS: {
    BOLD_TEXT_QUANTITY: 10,  // 굵은 글씨 표시 기준 수량
    BULK_PURCHASE: 30,       // 대량구매 기준 수량
  },

  // 할인율 표시
  DISCOUNT_RATES: {
    BULK: 25,
    TUESDAY: 10,
    LIGHTNING: 20,
    RECOMMENDED: 5,
  },
} as const; 