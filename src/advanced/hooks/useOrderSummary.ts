import { useCartStore } from '@/advanced/store';
import { OrderItem } from '@/advanced/types/cart.type';

export default function useOrderSummary() {
  const { cartItems } = useCartStore();

  const subTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const orderList: OrderItem[] = cartItems.map(cartItem => ({
    id: cartItem.id,
    name: cartItem.name,
    quantity: cartItem.quantity,
    totalPrice: cartItem.price * cartItem.quantity,
  }));

  return { subTotal, orderList };
}
