// import type { Product, CartProduct, AppState } from '../type';
import { isTodayTuesday } from '../utils/isTodayTuesday';
import CheckOutButton from './Button/CheckOutButton';
import CartSummary from './CartSummary';
import CartTotalBox from './CartTotalBox';
import DiscountRateBox from './DiscountRateBox';
import TuesdaySpecialBox from './TuesdaySpecialBox';

// interface OrderSummaryBoxProps {
//   productList: Product[];
//   cartList: CartProduct[];
//   appState: AppState;
// }

// = rightColumn
export const OrderSummaryBox = () => {
  return (
    <div className="bg-black text-white p-8 flex flex-col">
      <h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
      <div className="flex-1 flex flex-col">
        <CartSummary />
        <div className="mt-auto">
          <DiscountRateBox />
          <CartTotalBox />
          {/* 화요일이 아니면 숨김 */}
          {isTodayTuesday() && <TuesdaySpecialBox />}
        </div>
      </div>
      <CheckOutButton />
      <p className="mt-4 text-2xs text-white/60 text-center leading-relaxed">
        Free shipping on all orders.
        <br />
        <span id="points-notice">Earn loyalty points with purchase.</span>
      </p>
    </div>
  );
};

export default OrderSummaryBox;
