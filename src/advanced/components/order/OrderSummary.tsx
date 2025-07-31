import useCartSummary from '@/hooks/useCartSummary';
import { useCartWithProduct } from '@/hooks/useCartWithProducts';
import { isTuesday } from '@/utils/dateUtil';

import AppliedTuesdayDiscount from './AppliedTuesdayDiscount';
import { ItemDiscountList, TotalDiscountItem, TuesdayDiscountItem } from './DiscountList';
import DiscountSummary from './DiscountSummary';
import FinalPrice from './FinalPriceSummary';
import OrderList from './OrderList';
import SubTotal from './SubTotal';

const OrderSummary = () => {
  const { cartItems } = useCartWithProduct();
  const {
    subTotal,
    isAppliedItemDiscount,
    finalDiscountRate,
    finalTotal,
    isAppliedTotalDiscount,
    appliedItemDiscountList,
    bonusPoints,
  } = useCartSummary();

  return (
    <div className="bg-black text-white p-8 flex flex-col">
      <h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
      <div className="flex-1 flex flex-col">
        <div id="summary-details" className="space-y-3">
          <OrderList cartItems={cartItems} />
          <SubTotal subTotal={subTotal} />
          {isAppliedItemDiscount ? <ItemDiscountList discountList={appliedItemDiscountList} /> : null}
          {isAppliedTotalDiscount ? <TotalDiscountItem /> : null}
          {isTuesday() ? <TuesdayDiscountItem /> : null}
          <div className="flex justify-between text-sm tracking-wide text-gray-400">
            <span>Shipping</span>
            <span>Free</span>
          </div>
        </div>
        <div className="mt-auto">
          <DiscountSummary finalDiscountRate={finalDiscountRate} savedAmount={subTotal * (1 - finalDiscountRate)} />

          <div id="cart-total" className="pt-5 border-t border-white/10">
            <FinalPrice finalPrice={finalTotal} totalPoint={bonusPoints.total} pointDetails={bonusPoints.detail} />
          </div>
          {isTuesday() ? <AppliedTuesdayDiscount /> : null}
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
};

export default OrderSummary;
