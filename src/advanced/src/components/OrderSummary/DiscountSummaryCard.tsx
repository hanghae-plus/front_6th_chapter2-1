interface DiscountSummaryCardProps {
  discountAmount: number;
  originalAmount: number;
}

export default function DiscountSummaryCard({ discountAmount, originalAmount }: DiscountSummaryCardProps) {
  if (discountAmount <= 0) {
    return null;
  }

  const discountRate = ((discountAmount / originalAmount) * 100).toFixed(1);

  return (
    <div className="bg-green-500/20 rounded-lg p-3 mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs uppercase tracking-wide text-green-400">
          총 할인율
        </span>
        <span className="text-sm font-medium text-green-400">
          {discountRate}%
        </span>
      </div>
      <div className="text-2xs text-gray-300">
        ₩{discountAmount.toLocaleString()} 할인되었습니다
      </div>
    </div>
  );
}