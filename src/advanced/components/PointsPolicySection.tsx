import React from 'react';
import { POINTS_POLICY, UI_CONSTANTS } from '../constants';

/**
 * 포인트 정책 섹션 컴포넌트
 */
export const PointsPolicySection: React.FC = () => {
  return (
    <div className="mb-6">
      <h3 className="text-base font-bold mb-3">{UI_CONSTANTS.TEXT.POINTS_POLICY}</h3>
      <div className="space-y-3">
        <div className="bg-gray-100 rounded-lg p-3">
          <p className="font-semibold text-sm mb-1">{UI_CONSTANTS.TEXT.BASIC_POINTS}</p>
          <p className="text-gray-700 text-xs pl-2">
            • 구매액의 {(POINTS_POLICY.BASE_RATE * 100)}%
          </p>
        </div>
        <div className="bg-gray-100 rounded-lg p-3">
          <p className="font-semibold text-sm mb-1">{UI_CONSTANTS.TEXT.ADDITIONAL_POINTS}</p>
          <p className="text-gray-700 text-xs pl-2">
            • 화요일: {POINTS_POLICY.TUESDAY_MULTIPLIER}배<br />
            • 키보드+마우스: +{POINTS_POLICY.KEYBOARD_MOUSE_BONUS}p<br />
            • 풀세트: +{POINTS_POLICY.FULL_SET_BONUS}p<br />
            • 10개↑: +{POINTS_POLICY.BULK_PURCHASE_BONUS[10]}p / 20개↑: +{POINTS_POLICY.BULK_PURCHASE_BONUS[20]}p / 30개↑: +{POINTS_POLICY.BULK_PURCHASE_BONUS[30]}p
          </p>
        </div>
      </div>
    </div>
  );
}; 