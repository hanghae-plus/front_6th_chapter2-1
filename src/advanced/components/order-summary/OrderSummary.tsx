import { CartTotal } from './order-info/CartTotal';
import { DiscountInfo } from './order-info/DiscountInfo';
import { TuesdaySpecial } from './order-info/TuesdaySpecial';
import { SummaryDetails } from './summary-details/SummaryDetails';

export const OrderSummary = () => (
  <div className='bg-black text-white p-8 flex flex-col'>
    <h2 className='text-xs font-medium mb-5 tracking-extra-wide uppercase'>Order Summary</h2>
    <div className='flex-1 flex flex-col'>
      <SummaryDetails />
      <div className='mt-auto'>
        <DiscountInfo />
        <CartTotal />
        <TuesdaySpecial />
      </div>
    </div>
    <button className='w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30'>
      Proceed to Checkout
    </button>
    <p className='mt-4 text-2xs text-white/60 text-center leading-relaxed'>
      Free shipping on all orders.
      <br />
      <span id='points-notice'>Earn loyalty points with purchase.</span>
    </p>
  </div>
);
