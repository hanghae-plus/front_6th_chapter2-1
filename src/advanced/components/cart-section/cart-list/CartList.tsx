import { CartItem } from './CartItem';
import { useCartState } from '../../../contexts/CartContext';

export const CartList = () => {
  const state = useCartState();

  return (
    <div id='cart-items'>
      {state?.cartList.map((item, idx) => (
        <CartItem key={idx} productId={item.productId} quantity={item.quantity} />
      ))}
    </div>
  );
};
