interface TuesdayDiscountSectionProps {
  showTuesdayDiscount: boolean;
}

export function TuesdayDiscountSection({
  showTuesdayDiscount,
}: TuesdayDiscountSectionProps) {
  if (!showTuesdayDiscount) return null;

  return (
    <div className="flex justify-between text-sm tracking-wide text-purple-400">
      <span className="text-xs">🌟 화요일 추가 할인</span>
      <span className="text-xs">-10%</span>
    </div>
  );
}
