// ============== 포인트 관련 타입 ==============

export interface PointsInfo {
  base: number;
  bonus: number;
  total: number;
  description: string[];
  isTuesdayDouble: boolean;
}

export interface PointsPolicy {
  BASE_RATE: number;
  TUESDAY_MULTIPLIER: number;
  KEYBOARD_MOUSE_BONUS: number;
  FULL_SET_BONUS: number;
  BULK_PURCHASE_BONUS: {
    [threshold: number]: number;
  };
} 