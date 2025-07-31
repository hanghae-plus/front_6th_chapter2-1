import CartContainer from '../components/CartContainer';
import OrderSummaryBox from '../components/OrderSummaryBox';

export const CartLayout = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
      <CartContainer />
      <OrderSummaryBox />
    </div>
  );
};

export default CartLayout;
