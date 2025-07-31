// import { useGlobalState } from '../providers/useGlobal';
// import type { Product, CartProduct, AppState } from '../type';
import CartContainer from '../components/CartContainer';
import OrderSummaryBox from '../components/OrderSummaryBox';

// interface CartLayoutProps {
//   productList: Product[];
//   cartList: CartProduct[];
//   appState: AppState;
// }

export const CartLayout = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
      <CartContainer />
      <OrderSummaryBox />
    </div>
  );
};

export default CartLayout;
