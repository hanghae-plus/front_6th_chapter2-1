import type { Product, CartProduct, appState } from '../type';
import CartContainer from './CartContainer';
import OrderSummaryBox from './OrderSummaryBox';

interface CartLayoutProps {
  productList: Product[];
  cartList: CartProduct[];
  appState: appState;
}

export const CartLayout = ({ productList, cartList, appState }: CartLayoutProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
      <CartContainer productList={productList} cartList={cartList} />
      <OrderSummaryBox productList={productList} cartList={cartList} appState={appState} />
    </div>
  );
};

export default CartLayout;
