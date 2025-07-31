import { useCart } from 'cart/context';
import { CartItem } from './CartItem';

export function CartDisplay() {
  const { cartItems } = useCart();

  return (
    <div id="cart-items" className="space-y-0">
      {cartItems.map(({ product, quantity }) => (
        <CartItem key={product.id} product={product} quantity={quantity} />
      ))}
    </div>
  );
}
