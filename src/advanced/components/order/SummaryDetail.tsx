import Divider from '@/advanced/components/layout/Divider';
import useOrderSummary from '@/advanced/hooks/useOrderSummary';
import { useCartStore } from '@/advanced/store';
import formatPrice from '@/advanced/utils/format.util';

export default function SummaryDetail() {
  const { cartItems } = useCartStore();

  const { subTotal } = useOrderSummary();

  const orderList = cartItems.map(cartItem => {
    const { name, price, quantity } = cartItem;

    const totalPrice = price * quantity;
    const formattedTotalPrice = formatPrice(totalPrice);

    return (
      <div key={cartItem.id} className="flex justify-between text-xs tracking-wide text-gray-400">
        <span>
          {name} x {quantity}
        </span>
        <span>{formattedTotalPrice}</span>
      </div>
    );
  });

  const formattedSubTotal = formatPrice(subTotal);

  return (
    <div id="summary-details" className="space-y-3">
      {/* 주문 요약 내용 */}
      {orderList}

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
