export const POINT_RULES = {
  BASE_UNIT_AMOUNT: 1000,
  TUESDAY_MULTIPLIER: 2,
} as const;

export const BONUS_SETS = {
  KEYBOARD_MOUSE: {
    points: 50,
    label: "키보드+마우스 세트 +50p",
  },
  FULL_SET: {
    points: 100,
    label: "풀세트 구매 +100p",
  },
} as const;

export const BULK_PURCHASE_BONUS_RULES = [
  { threshold: 30, points: 100 },
  { threshold: 20, points: 50 },
  { threshold: 10, points: 20 },
] as const;
