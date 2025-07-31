import React from 'react';
import { UI_CONSTANTS } from '../constants';

interface TuesdaySpecialProps {
  isTuesday: boolean;
  totalAmount: number;
}

/**
 * 화요일 특가 표시 컴포넌트
 */
export const TuesdaySpecial: React.FC<TuesdaySpecialProps> = ({
  isTuesday,
  totalAmount
}) => {
  if (!isTuesday || totalAmount <= 0) {
    return null;
  }

  return (
    <div 
      id="tuesday-special" 
      className="mt-4 p-3 bg-white/10 rounded-lg"
    >
      <div className="flex items-center gap-2">
        <span className="text-2xs">{UI_CONSTANTS.ICONS.BULK_DISCOUNT}</span>
        <span className="text-xs uppercase tracking-wide">
          {UI_CONSTANTS.TEXT.TUESDAY_SPECIAL}
        </span>
      </div>
    </div>
  );
}; 