import React from 'react';
import { PointsInfo } from '../types';
import { createLoyaltyPointsHTML } from '../utils';

interface PointsDisplayProps {
  pointsInfo: PointsInfo;
  itemsCount: number;
}

/**
 * 포인트 정보 표시 컴포넌트
 */
export const PointsDisplay: React.FC<PointsDisplayProps> = ({
  pointsInfo,
  itemsCount
}) => {
  const formatLoyaltyPoints = () => createLoyaltyPointsHTML(pointsInfo);

  return (
    <div 
      id="loyalty-points" 
      className="text-xs text-blue-400 mt-2 text-right"
      style={{ display: itemsCount > 0 ? 'block' : 'none' }}
      dangerouslySetInnerHTML={{ __html: formatLoyaltyPoints() }}
    />
  );
}; 