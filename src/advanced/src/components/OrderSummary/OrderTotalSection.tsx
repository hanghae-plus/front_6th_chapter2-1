interface OrderTotalSectionProps {
  totalAmount: number;
  loyaltyPoints: number;
  pointsBreakdown: string[];
}

export default function OrderTotalSection({ totalAmount, loyaltyPoints, pointsBreakdown }: OrderTotalSectionProps) {
  return (
    <div className="pt-5 border-t border-white/10">
      <div className="flex justify-between items-baseline">
        <span className="text-sm uppercase tracking-wider">Total</span>
        <div className="text-2xl tracking-tight">
          ₩{totalAmount.toLocaleString()}
        </div>
      </div>
      {loyaltyPoints > 0 && (
        <div
          className="text-xs text-blue-400 mt-2 text-right"
          style={{ display: 'block' }}
        >
          <div>
            적립 포인트:{' '}
            <span className="font-bold">{loyaltyPoints}p</span>
          </div>
          <div className="text-2xs opacity-70 mt-1">
            {pointsBreakdown.join(', ')}
          </div>
        </div>
      )}
    </div>
  );
}