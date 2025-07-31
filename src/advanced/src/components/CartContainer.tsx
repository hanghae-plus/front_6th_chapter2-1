import { useGlobalState } from '../providers/useGlobal';
import type { CartProduct, Product } from '../type';
import CartActionSection from './CartAcionSection';
import CartProductSection from './CartProductSection';

interface CartContainerProps {
  productList: Product[];
  cartList: CartProduct[];
}

// = leftColumn
// = CartActionSection + CartProductSection
export const CartContainer = () => {
  const { productList, cartList } = useGlobalState();

  return (
    <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
      <CartActionSection productList={productList} />
      <CartProductSection productList={productList} cartList={cartList} />
    </div>
  );
};

export default CartContainer;
