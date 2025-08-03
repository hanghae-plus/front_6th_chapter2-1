import { useCartTotalCount } from '../hooks/cart';
import { formatQuantity } from '../utils/quantity';

export function Header() {
  const cartTotalCount = useCartTotalCount();

  return (
    <div className="mb-8">
      <h1 className="text-xs font-medium tracking-extra-wide uppercase mb-2">
        🛒 Hanghae Online Store
      </h1>
      <div className="text-5xl tracking-tight leading-none">Shopping Cart</div>
      <p className="text-sm text-gray-500 font-normal mt-3">
        🛍️ {formatQuantity({ quantity: cartTotalCount })} items in cart
      </p>
    </div>
  );
}
