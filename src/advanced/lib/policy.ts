/** 포인트 정책*/
export const POINTS_POLICY = {
  BASE_RATE: 0.001, // 1000원당 1포인트 (0.1%)
  TUESDAY_MULTIPLIER: 2,
  SET_BONUS: {
    KEYBOARD_MOUSE: 50,
    FULL_SET: 100,
  },
  BULK_PURCHASE_BONUS: {
    // 구매 수량 보너스
    SMALL: { minQuantity: 10, points: 20 },
    MEDIUM: { minQuantity: 20, points: 50 },
    LARGE: { minQuantity: 30, points: 100 },
  },
};

/** 대량 구매 기준*/
export const DISCOUNT_POLICY = { BULK_PURCHASE_MIN: 30 };

/** 재고 부족 경고 기준 */
export const TOTAL_STOCK_WARNING = 50;

/** 개별 상품 재고 부족 기준 */
export const LOW_STOCK_LIMIT = 5;
