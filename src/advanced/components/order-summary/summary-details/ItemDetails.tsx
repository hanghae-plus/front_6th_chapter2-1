import { useCartState } from '../../../contexts/CartContext';
import { getCartSummary } from '../../../reducer';
import { CartItemForDisplay } from '../../../types';

export const ItemDetails = () => {
  const state = useCartState();
  const { cartItemsForDisplay } = getCartSummary(state);

  return cartItemsForDisplay.map((item: CartItemForDisplay) => (
    <div key={item.name} className='flex justify-between text-xs tracking-wide text-gray-400'>
      <span>
        {item.name} x {item.quantity}
      </span>
      <span>₩{item.totalPrice}</span>
    </div>
  ));
};
