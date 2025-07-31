interface TuesdayBannerProps {
  isTuesday: boolean;
  hasDiscount: boolean;
}

const TuesdayBanner = ({ isTuesday, hasDiscount }: TuesdayBannerProps) => {
  if (!isTuesday || !hasDiscount) {
    return null;
  }

  return (
    <div className="mt-4 p-3 bg-white/10 rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-2xs">🎉</span>
        <span className="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
      </div>
    </div>
  );
};

export default TuesdayBanner;
