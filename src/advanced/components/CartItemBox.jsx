import { CartItem } from "./CartItem";

export const CartItemBox = ({ onClick, cartItems = [] }) => {
  return (
    <div id="cart-items" onClick={onClick}>
      {cartItems.map((cartItem) => (
        <CartItem key={`cartItem-${cartItem.id}`} {...cartItem} />
      ))}
    </div>
  );
};
