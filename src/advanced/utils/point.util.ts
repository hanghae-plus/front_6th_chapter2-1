import { POINT_BONUS_FULL_SET, POINT_BONUS_KEYBOARD_MOUSE_SET } from '@/advanced/data/point.data';
import {
  MIN_QUANTITY_FOR_POINT_BONUS_TIER1,
  MIN_QUANTITY_FOR_POINT_BONUS_TIER2,
  MIN_QUANTITY_FOR_POINT_BONUS_TIER3,
} from '@/advanced/data/quantity.data';
import { PointPolicy } from '@/advanced/types/point.type';

export const createPointPolicyTest = (policies: PointPolicy[], defaultPoint: number) => {
  const defaultPointText = `기본: ${defaultPoint}p`;

  const tuesdayPointText = `화요일 2배`;
  const keyboardSetPointText = `키보드+마우스 세트 +${POINT_BONUS_KEYBOARD_MOUSE_SET}p`;
  const fullSetPointText = `풀세트 구매 +${POINT_BONUS_FULL_SET}p`;
  const bulkBonus10PointText = `대량구매(${MIN_QUANTITY_FOR_POINT_BONUS_TIER1}개+) +${POINT_BONUS_QUANTITY_TIER1}p`;
  const bulkBonus20PointText = `대량구매(${MIN_QUANTITY_FOR_POINT_BONUS_TIER2}개+) +${POINT_BONUS_QUANTITY_TIER2}p`;
  const bulkBonus30PointText = `대량구매(${MIN_QUANTITY_FOR_POINT_BONUS_TIER3}개+) +${POINT_BONUS_QUANTITY_TIER1}p`;

  const pointPolicyTexts: Record<PointPolicy, string> = {
    [PointPolicy.DEFAULT]: defaultPointText,
    [PointPolicy.TUESDAY]: tuesdayPointText,
    [PointPolicy.KEYBOARD_SET]: keyboardSetPointText,
    [PointPolicy.FULL_SET]: fullSetPointText,
    [PointPolicy.BULK_BONUS_10]: bulkBonus10PointText,
    [PointPolicy.BULK_BONUS_20]: bulkBonus20PointText,
    [PointPolicy.BULK_BONUS_30]: bulkBonus30PointText,
  };

  return (
    defaultPointText +
    ', ' +
    policies
      .map(policy => {
        return pointPolicyTexts[policy];
      })
      .join(', ')
  );
};
