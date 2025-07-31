import { useGlobalDispatch } from '../providers/useGlobal';
import type { CartProduct, Product } from '../type';
import { findProductById } from '../lib/findProductById';
import CartProductItem from './CartProductItem';

interface CartProductSectionProps {
  productList: Product[];
  cartList: CartProduct[];
}

export const CartProductSection = ({ productList, cartList }: CartProductSectionProps) => {
  const dispatch = useGlobalDispatch();

  return (
    <div>
      {cartList.map((item) => {
        const product = findProductById(productList, item.id);
        if (!product) return null;

        const handleIncreaseButtonClick = () => {
          dispatch({ type: 'CHANGE_QUANTITY', productId: product.id, delta: 1 });
        };

        const handleDecreaseButtonClick = () => {
          dispatch({ type: 'CHANGE_QUANTITY', productId: product.id, delta: -1 });
        };

        const handleRemoveButtonClick = () => {
          dispatch({ type: 'REMOVE_FROM_CART', productId: product.id });
        };

        return (
          <CartProductItem
            key={product.id}
            product={product}
            count={item.count}
            onIncrease={handleIncreaseButtonClick}
            onDecrease={handleDecreaseButtonClick}
            onRemove={handleRemoveButtonClick}
          />
        );
      })}
    </div>
  );
};

export default CartProductSection;
