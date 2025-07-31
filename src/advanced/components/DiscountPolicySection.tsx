import React from 'react';
import { DISCOUNT_POLICY, UI_CONSTANTS } from '../constants';

/**
 * 할인 정책 섹션 컴포넌트
 */
export const DiscountPolicySection: React.FC = () => {
  return (
    <div className="mb-6">
      <h3 className="text-base font-bold mb-3">{UI_CONSTANTS.TEXT.DISCOUNT_POLICY}</h3>
      <div className="space-y-3">
        <div className="bg-gray-100 rounded-lg p-3">
          <p className="font-semibold text-sm mb-1">{UI_CONSTANTS.TEXT.INDIVIDUAL_PRODUCTS}</p>
          <p className="text-gray-700 text-xs pl-2">
            • 키보드 10개↑: 10%<br />
            • 마우스 10개↑: 15%<br />
            • 모니터암 10개↑: 20%<br />
            • 스피커 10개↑: 25%
          </p>
        </div>
        <div className="bg-gray-100 rounded-lg p-3">
          <p className="font-semibold text-sm mb-1">{UI_CONSTANTS.TEXT.TOTAL_QUANTITY}</p>
          <p className="text-gray-700 text-xs pl-2">
            • {DISCOUNT_POLICY.BULK_PURCHASE_THRESHOLD}개 이상: {(DISCOUNT_POLICY.BULK_PURCHASE_RATE * 100)}%
          </p>
        </div>
        <div className="bg-gray-100 rounded-lg p-3">
          <p className="font-semibold text-sm mb-1">{UI_CONSTANTS.TEXT.SPECIAL_DISCOUNT}</p>
          <p className="text-gray-700 text-xs pl-2">
            • 화요일: +{(DISCOUNT_POLICY.TUESDAY_DISCOUNT_RATE * 100)}%<br />
            • ⚡번개세일: {(DISCOUNT_POLICY.LIGHTNING_SALE_RATE * 100)}%<br />
            • 💝추천할인: {(DISCOUNT_POLICY.SUGGESTED_SALE_RATE * 100)}%
          </p>
        </div>
      </div>
    </div>
  );
}; 