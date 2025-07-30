import { useCartStore } from '@/advanced/store';
import { OrderItem } from '@/advanced/types/cart.type';
import { getCartTotalCount } from '@/advanced/utils/cart.util';
import { getBasicDiscountRate } from '@/advanced/utils/discount.util';

export default function useOrderSummary() {
  const { cartItems } = useCartStore();

  const subTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const isBulkDiscount = getCartTotalCount(cartItems) >= 30;

  const orderList: OrderItem[] = cartItems.map(cartItem => ({
    id: cartItem.id,
    name: cartItem.name,
    quantity: cartItem.quantity,
    totalPrice: cartItem.price * cartItem.quantity,
    discountRate: getBasicDiscountRate(cartItem),
  }));

  const discountedProducts = orderList.filter(item => item.discountRate > 0);

  return { subTotal, orderList, isBulkDiscount, discountedProducts };
}
