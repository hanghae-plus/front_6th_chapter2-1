import Divider from '@/advanced/components/layout/Divider';
import useOrderSummary from '@/advanced/hooks/useOrderSummary';
import formatPrice from '@/advanced/utils/format.util';

export default function SummaryDetail() {
  const { subTotal, orderList, isBulkDiscount, discountedProducts } = useOrderSummary();

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

      {isBulkDiscount ? (
        <div className="flex justify-between text-sm tracking-wide text-green-400">
          <span className="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span className="text-xs">-25%</span>
        </div>
      ) : (
        discountedProducts.map(({ name, discountRate }) => (
          <div className="flex justify-between text-sm tracking-wide text-green-400">
            <span className="text-xs">{name} (10개↑)</span>
            <span className="text-xs">-{discountRate}%</span>
          </div>
        ))
      )}

      <div className="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    </div>
  );
}
