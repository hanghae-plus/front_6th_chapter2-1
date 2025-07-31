import useOrderSummary from '@/advanced/hooks/useOrderSummary';
import { formatDiscountRate } from '@/advanced/utils/format.util';

export default function DiscountInfo() {
  const { totalDiscountRate, totalSavedAmount } = useOrderSummary();

  const formattedDiscountRate = formatDiscountRate(totalDiscountRate);

  if (totalDiscountRate === 0) return null;

  return (
    <div id="discount-info" className="mb-4">
      <div className="bg-green-500/20 rounded-lg p-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span className="text-sm font-medium text-green-400">{formattedDiscountRate}</span>
        </div>
        <div className="text-2xs text-gray-300">
          ₩{Math.round(totalSavedAmount).toLocaleString()} 할인되었습니다
        </div>
      </div>
    </div>
  );
}
