import { PointPolicy } from '@/advanced/types/point.type';

const POINT_RATE_BASE = 1000;
const POINT_MULTIPLIER_TUESDAY = 2;
const POINT_BONUS_KEYBOARD_MOUSE_SET = 50;
const POINT_BONUS_FULL_SET = 100;
const POINT_BONUS_QUANTITY_TIER1 = 20; // 10개 이상
const POINT_BONUS_QUANTITY_TIER2 = 50; // 20개 이상
const POINT_BONUS_QUANTITY_TIER3 = 100; // 30개 이상

const POINT_POLICY_MAP: Record<PointPolicy, (originalPoint: number, totalPrice: number) => number> =
  {
    [PointPolicy.DEFAULT]: (_, totalPrice) => Math.floor(totalPrice / POINT_RATE_BASE),
    [PointPolicy.TUESDAY]: originalPoint => originalPoint * POINT_MULTIPLIER_TUESDAY,
    [PointPolicy.KEYBOARD_SET]: originalPoint => originalPoint + POINT_BONUS_KEYBOARD_MOUSE_SET,
    [PointPolicy.FULL_SET]: originalPoint => originalPoint + POINT_BONUS_FULL_SET,
    [PointPolicy.BULK_BONUS_10]: originalPoint => originalPoint + POINT_BONUS_QUANTITY_TIER1,
    [PointPolicy.BULK_BONUS_20]: originalPoint => originalPoint + POINT_BONUS_QUANTITY_TIER2,
    [PointPolicy.BULK_BONUS_30]: originalPoint => originalPoint + POINT_BONUS_QUANTITY_TIER3,
  };

export { POINT_POLICY_MAP };
