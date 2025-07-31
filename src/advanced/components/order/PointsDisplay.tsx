import { PointsResult } from '../../types';

interface PointsDisplayProps {
  pointsResult: PointsResult;
  hasItems: boolean;
}

const PointsDisplay = ({ pointsResult, hasItems }: PointsDisplayProps) => {
  if (!hasItems || pointsResult.totalPoints <= 0) {
    return null;
  }

  return (
    <div className="text-xs text-blue-400 mt-2 text-right">
      <div>
        적립 포인트: <span className="font-bold">{pointsResult.totalPoints}p</span>
      </div>
      <div className="text-2xs opacity-70 mt-1">{pointsResult.pointsDetails.join(', ')}</div>
    </div>
  );
};

export default PointsDisplay;
