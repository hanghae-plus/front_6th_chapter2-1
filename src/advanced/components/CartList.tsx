import { useCart } from "../context/CartContext";
import { CartItem } from "./CartItem";

const CartList = () => {
  const { state } = useCart();
  const { cartItems } = state;

  if (cartItems.length === 0) {
    return <div className="text-center py-8 text-gray-500">장바구니가 비어있습니다.</div>;
  }

  return (
    <div id="cart-items" className="cart-items space-y-0">
      {cartItems.map(item => (
        <CartItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default CartList;
