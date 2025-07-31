import { useGlobalState } from '../providers/useGlobal';

export const CartTotalBox = () => {
  const { appState } = useGlobalState();
  const { totalAfterDiscount, totalPoints, pointsDetail } = appState;

  return (
    <div className="pt-5 border-t border-white/10">
      <div className="flex justify-between items-baseline">
        <span className="text-sm uppercase tracking-wider">Total</span>
        <div className="text-2xl tracking-tight">₩{Math.round(totalAfterDiscount).toLocaleString()}</div>
      </div>

      {totalPoints > 0 && (
        <div className="text-xs text-blue-400 mt-2 text-right">
          <div>
            적립 포인트: <span className="font-bold">{totalPoints}p</span>
          </div>
          <div className="text-2xs opacity-70 mt-1">{pointsDetail.join(', ')}</div>
        </div>
      )}
    </div>
  );
};

export default CartTotalBox;
