import { useCart } from '../../hooks/useCart';
import OrderItemsList from './OrderItemsList';
import DiscountSection from './DiscountSection';
import DiscountSummaryCard from './DiscountSummaryCard';
import OrderTotalSection from './OrderTotalSection';
import TuesdaySpecial from './TuesdaySpecial';

export default function OrderSummary() {
  const { state } = useCart();

  return (
    <div className="bg-black text-white p-8 flex flex-col">
      <h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">
        Order Summary
      </h2>

      <div className="flex-1 flex flex-col">
        <OrderItemsList
          items={state.items}
          originalAmount={state.originalAmount}
        />

        <DiscountSection appliedDiscounts={state.appliedDiscounts} />

        <div className="mt-auto">
          <DiscountSummaryCard
            discountAmount={state.discountAmount}
            originalAmount={state.originalAmount}
          />

          <OrderTotalSection
            totalAmount={state.totalAmount}
            loyaltyPoints={state.loyaltyPoints}
            pointsBreakdown={state.pointsBreakdown}
          />

          <TuesdaySpecial
            appliedDiscounts={state.appliedDiscounts}
            pointsBreakdown={state.pointsBreakdown}
          />
        </div>
      </div>

      <button className="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
        Proceed to Checkout
      </button>
      <p className="mt-4 text-2xs text-white/60 text-center leading-relaxed">
        Free shipping on all orders.
        <br />
        <span id="points-notice">Earn loyalty points with purchase.</span>
      </p>
    </div>
  );
}
