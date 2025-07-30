import { ReactElement } from 'react';

import Divider from '@/advanced/components/layout/Divider';
import useOrderSummary from '@/advanced/hooks/useOrderSummary';
import formatPrice from '@/advanced/utils/format.util';

export default function SummaryDetail(): ReactElement {
  const { subTotal } = useOrderSummary();

  const formattedSubTotal = formatPrice(subTotal);

  return (
    <div id="summary-details" className="space-y-3">
      {/* 주문 요약 내용 */}

      <Divider />

      <div className="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>{formattedSubTotal}</span>
      </div>

      <div className="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    </div>
  );
}
