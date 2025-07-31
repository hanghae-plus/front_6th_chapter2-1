interface LoyaltyPointsSectionProps {
  loyaltyPoints: string;
  loyaltyPointsZero: string;
}

export function LoyaltyPointsSection({
  loyaltyPoints,
  loyaltyPointsZero,
}: LoyaltyPointsSectionProps) {
  return (
    <div id="loyalty-points" className="text-xs text-blue-400 mt-2 text-right">
      {loyaltyPoints}
    </div>
  );
}
