import { useCartStore } from '../../store';
import { CartItem } from './CartItem';

export const CartDisplay = () => {
  const items = useCartStore((state) => state.items);

  return (
    <div id="cart-items">
      {items.map((item) => (
        <CartItem key={item.id} item={item} onQuantityChange={() => {}} onRemove={() => {}} />
      ))}
    </div>
  );
}; 