interface BulkDiscountSectionProps {
  showBulkDiscount: boolean;
}

export function BulkDiscountSection({
  showBulkDiscount,
}: BulkDiscountSectionProps) {
  if (!showBulkDiscount) return null;

  return (
    <div className="flex justify-between text-sm tracking-wide text-green-400">
      <span className="text-xs">🎉 대량구매 할인 (30개 이상)</span>
      <span className="text-xs">-25%</span>
    </div>
  );
}
