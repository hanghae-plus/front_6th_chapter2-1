import usePoint from '@/advanced/hooks/usePoint';
import { createPointPolicyTest } from '@/advanced/utils/point.util';

export default function PointInfo() {
  const { totalPoint, applicablePolicies, defaultPoint } = usePoint();

  return (
    <div id="loyalty-points" className="text-xs text-blue-400 mt-2 text-right">
      적립 포인트: {totalPoint}p
      <br />
      <div className="text-2xs opacity-70 mt-1">
        {createPointPolicyTest(applicablePolicies, defaultPoint)}
      </div>
    </div>
  );
}
