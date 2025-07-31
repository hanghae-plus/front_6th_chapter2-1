import React from 'react';
import { isTuesday } from '../utils/discount';

export const TuesdayBanner: React.FC = () => {
  if (!isTuesday()) {
    return null;
  }

  return (
    <div
      id="tuesday-special"
      className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg shadow-lg mb-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🎉</span>
          <div>
            <h3 className="font-bold text-lg">화요일 특별 할인!</h3>
            <p className="text-sm opacity-90">모든 상품 10% 추가 할인</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">10%</div>
          <div className="text-xs opacity-90">추가 할인</div>
        </div>
      </div>
    </div>
  );
};
