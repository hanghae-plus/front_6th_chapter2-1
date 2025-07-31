import { handleClickCartItems } from '../../handler/cart-items';
import { CART_ITEMS_ID } from '../../utils/selector';

export const CartItems = () => {
  const cartItems = document.createElement('div');
  cartItems.id = CART_ITEMS_ID;
  cartItems.onclick = handleClickCartItems;

  return cartItems;
};
