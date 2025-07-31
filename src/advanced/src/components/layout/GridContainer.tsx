import type { GridContainerProps } from '../../types';
import { LeftColumn } from './LeftColumn';
import { RightColumn } from '../summary/RightColumn';

export const GridContainer = ({ total, bonusPoints, pointsDetail }: GridContainerProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
      <LeftColumn />
      <RightColumn total={total} bonusPoints={bonusPoints} pointsDetail={pointsDetail} />
    </div>
  );
}; 