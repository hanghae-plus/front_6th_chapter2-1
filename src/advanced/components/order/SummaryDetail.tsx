import Divider from '@/advanced/components/layout/Divider';
import BasicDiscount from '@/advanced/components/order/BasicDiscount';
import SpecialDiscount from '@/advanced/components/order/SpecialDiscount';
import useOrderSummary from '@/advanced/hooks/useOrderSummary';
import formatPrice from '@/advanced/utils/format.util';

export default function SummaryDetail() {
  const { subTotal, orderList } = useOrderSummary();

  const formattedSubTotal = formatPrice(subTotal);

  return (
    <div id="summary-details" className="space-y-3">
      {orderList.map(({ name, quantity, totalPrice }) => (
        <div key={name} className="flex justify-between text-xs tracking-wide text-gray-400">
          <span>
            {name} x {quantity}
          </span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
      ))}

      <Divider />

      <div className="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>{formattedSubTotal}</span>
      </div>

      <BasicDiscount />

      <SpecialDiscount />

      <div className="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    </div>
  );
}
