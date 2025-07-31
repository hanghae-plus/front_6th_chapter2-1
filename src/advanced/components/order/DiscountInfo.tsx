import useDiscount from '@/advanced/hooks/useDiscount';

export default function DiscountInfo() {
  const { discountRate, savedAmount } = useDiscount();

  const formattedDiscountRate = (discountRate * 100).toFixed(1) + '%';

  if (discountRate === 0) return null;

  return (
    <div id="discount-info" className="mb-4">
      <div className="bg-green-500/20 rounded-lg p-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span className="text-sm font-medium text-green-400">{formattedDiscountRate}</span>
        </div>
        <div className="text-2xs text-gray-300">
          ₩{Math.round(savedAmount).toLocaleString()} 할인되었습니다
        </div>
      </div>
    </div>
  );
}
