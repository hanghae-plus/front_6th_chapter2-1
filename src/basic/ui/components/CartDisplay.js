import { CartItem } from './CartItem.js';

export const CartDisplay = ({ cartItems = [] } = {}) => {
  const cartItemsHtml = cartItems
    .map(item => {
      const { product, quantity } = item;
      return CartItem({ product, quantity });
    })
    .join('');

  return /* HTML */ ` <div id="cart-items">${cartItemsHtml}</div> `;
};
