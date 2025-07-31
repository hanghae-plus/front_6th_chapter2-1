import type { LoyaltyPointsTagProps } from '../../types';

export const LoyaltyPointsTag = ({ bonusPoints, pointsDetail }: LoyaltyPointsTagProps) => {
  if (bonusPoints === 0) {
    return <div>적립 포인트: 0p</div>;
  }

  return (
    <div>
      <div>
        적립 포인트: <span className="font-bold">{bonusPoints}p</span>
      </div>
      {pointsDetail.length > 0 && (
        <div className="text-2xs opacity-70 mt-1">
          {pointsDetail.map((detail, index) => (
            <span key={index}>
              {detail.description}: {detail.amount}p
              {index < pointsDetail.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}; 