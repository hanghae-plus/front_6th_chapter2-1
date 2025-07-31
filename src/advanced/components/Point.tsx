import { useCartPointInfo } from '../hooks/cart';
import { formatPoint } from '../utils/point';

export function Point() {
  const { point, bonusItemDetail, bulkDetail } = useCartPointInfo();

  if (!point) {
    return null;
  }

  return (
    <div className="text-xs text-blue-400 mt-2 text-right">
      <div>적립 포인트: {formatPoint({ point })}</div>
      <div className="text-2xs opacity-70 mt-1">
        {[...bonusItemDetail, ...bulkDetail].join(', ')}
      </div>
    </div>
  );
}
