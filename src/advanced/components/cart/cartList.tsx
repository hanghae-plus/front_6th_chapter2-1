import { CartItem as CartItemType } from '../../types';
import CartItem from './CartItem';

interface CartListProps {
  cartItems: CartItemType[];
  onQuantityChange?: (productId: string, change: number) => void;
  onRemove?: (productId: string) => void;
}

export default function CartList({
  cartItems,
  onQuantityChange,
  onRemove,
}: CartListProps) {
  return (
    <div id="cart-items">
      {cartItems.map((item) => (
        <CartItem
          key={item.id}
          product={item}
          quantity={item.cartQuantity || 1}
          onQuantityChange={onQuantityChange}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
