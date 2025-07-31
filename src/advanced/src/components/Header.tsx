import { useCart } from '../hooks/useCart';
import { getTotalCartItems } from '../utils/cartUtils';

export default function Header() {
  const { state } = useCart();

  return (
    <div className="mb-8">
      <h1 className="text-xs font-medium tracking-extra-wide uppercase mb-2">
        🛒 Hanghae Online Store
      </h1>
      <div className="text-5xl tracking-tight leading-none">Shopping Cart</div>
      <p id="item-count" className="text-sm text-gray-500 font-normal mt-3">
        🛍️ {getTotalCartItems(state.items)} items in cart
      </p>
    </div>
  );
}
