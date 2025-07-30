import { useCartStore } from '@/advanced/store';

export default function useOrderSummary() {
  const { cartItems } = useCartStore();

  const subTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return { subTotal };
}
