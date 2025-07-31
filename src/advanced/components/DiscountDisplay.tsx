import React from 'react';
import { DiscountInfo } from '../types/discount';
import { UI_CONSTANTS } from '../constants';

interface DiscountDisplayProps {
  discountInfo: DiscountInfo | null;
  totalAmount: number;
}

/**
 * 할인 정보 표시 컴포넌트
 */
export const DiscountDisplay: React.FC<DiscountDisplayProps> = ({
  discountInfo,
  totalAmount
}) => {
  return (
    <div id="discount-info" className="mb-4">
      {discountInfo && totalAmount > 0 && (
        <div className="bg-green-500/20 rounded-lg p-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs uppercase tracking-wide text-green-400">
              {UI_CONSTANTS.TEXT.TOTAL_DISCOUNT_RATE}
            </span>
            <span className="text-sm font-medium text-green-400">
              {(discountInfo.rate * 100).toFixed(1)}%
            </span>
          </div>
          <div className="text-2xs text-gray-300">
            ₩{Math.round(discountInfo.amount).toLocaleString()} {UI_CONSTANTS.TEXT.DISCOUNT_APPLIED}
          </div>
        </div>
      )}
    </div>
  );
}; 