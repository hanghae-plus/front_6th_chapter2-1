import React, { memo } from "react";

interface DiscountInfoProps {
  discountRate: number;
  savedAmount: number;
}

const DiscountInfo: React.FC<DiscountInfoProps> = ({ discountRate, savedAmount }) => (
  <div className="rounded-lg bg-green-500/20 p-3">
    <div className="mb-1 flex items-center justify-between">
      <span className="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
      <span className="text-sm font-medium text-green-400">{discountRate.toFixed(1)}%</span>
    </div>
    <div className="text-2xs text-gray-300">
      ₩{Math.round(savedAmount).toLocaleString()} 할인되었습니다
    </div>
  </div>
);

export default memo(DiscountInfo);
