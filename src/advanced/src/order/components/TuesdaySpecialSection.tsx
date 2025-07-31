interface TuesdaySpecialSectionProps {
  isCurrentlyTuesday: boolean;
}

export function TuesdaySpecialSection({
  isCurrentlyTuesday,
}: TuesdaySpecialSectionProps) {
  return (
    <div
      id="tuesday-special"
      className={`mt-4 p-3 bg-white/10 rounded-lg ${
        isCurrentlyTuesday ? '' : 'hidden'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-2xs">🎉</span>
        <span className="text-xs uppercase tracking-wide">
          Tuesday Special 10% Applied
        </span>
      </div>
    </div>
  );
}
