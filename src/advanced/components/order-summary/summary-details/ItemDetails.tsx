import { useCartState } from '../../../contexts/CartContext';
import { getCartDetails } from '../../../contexts/getters';

export const ItemDetails = () => {
  const state = useCartState();
  const cartItemsForDisplay = getCartDetails(state).map((item) => ({
    name: item.product ? item.product.name : '',
    quantity: item.quantity,
    totalPrice: item.itemTotal,
  }));

  return cartItemsForDisplay.map((item) => (
    <div key={item.name} className='flex justify-between text-xs tracking-wide text-gray-400'>
      <span>
        {item.name} x {item.quantity}
      </span>
      <span>₩{item.totalPrice}</span>
    </div>
  ));
};
