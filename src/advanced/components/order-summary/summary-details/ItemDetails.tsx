import { useCartState } from '../../../contexts/CartContext';
import { CartItemForDisplay, getCartSummary } from '../../../reducer';

export const ItemDetails = () => {
  const state = useCartState();
  const { cartItemsForDisplay } = getCartSummary(state);

  return cartItemsForDisplay.map((item: CartItemForDisplay) => (
    <div className='flex justify-between text-xs tracking-wide text-gray-400'>
      <span>
        {item.name} x {item.quantity}
      </span>
      <span>₩{item.totalPrice}</span>
    </div>
  ));
};
