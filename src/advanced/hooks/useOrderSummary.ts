import { useCartStore } from '@/advanced/store/cartStore';

export default function useOrderSummary() {
  const { cartItems } = useCartStore();

  const subTotal = cartItems.reduce((acc, item) => acc + item.price, 0);

  return { subTotal };
}
