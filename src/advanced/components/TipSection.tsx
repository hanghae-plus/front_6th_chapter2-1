import React from 'react';
import { UI_CONSTANTS } from '../constants';

/**
 * 팁 섹션 컴포넌트
 */
export const TipSection: React.FC = () => {
  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <p className="text-xs font-bold mb-1">{UI_CONSTANTS.TEXT.TIP}</p>
      <p className="text-2xs text-gray-600 leading-relaxed">
        • 화요일 대량구매 = MAX 혜택<br />
        • ⚡+💝 중복 가능<br />
        • 상품4 = 품절
      </p>
    </div>
  );
}; 