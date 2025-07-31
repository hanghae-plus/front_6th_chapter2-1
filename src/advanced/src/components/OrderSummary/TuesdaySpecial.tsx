interface TuesdaySpecialProps {
  appliedDiscounts: string[];
  pointsBreakdown: string[];
}

export default function TuesdaySpecial({ appliedDiscounts, pointsBreakdown }: TuesdaySpecialProps) {
  const isTuesday = new Date().getDay() === 2;
  const hasTuesdayDiscount = appliedDiscounts.some(discount => 
    discount.includes('화요일 특가')
  );
  const hasTuesdayPoints = pointsBreakdown.some(breakdown => 
    breakdown.includes('화요일')
  );

  if (!isTuesday || (!hasTuesdayDiscount && !hasTuesdayPoints)) {
    return null;
  }

  return (
    <div className="mt-4 p-3 bg-white/10 rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-2xs">🎉</span>
        <span className="text-xs uppercase tracking-wide">
          Tuesday Special Applied
        </span>
      </div>
      <div className="text-2xs opacity-70 mt-1">
        {hasTuesdayDiscount && "10% 추가 할인"}
        {hasTuesdayDiscount && hasTuesdayPoints && " + "}
        {hasTuesdayPoints && "포인트 2배 적립"}
      </div>
    </div>
  );
}