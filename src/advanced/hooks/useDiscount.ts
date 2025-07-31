import { useCartStore } from '@/advanced/store';
import { Discount } from '@/advanced/types/discount.type';
import { getCartTotalCount } from '@/advanced/utils/cart.util';
import { getBasicDiscountRate } from '@/advanced/utils/discount.util';

export default function useDiscount() {
  const { cartItems } = useCartStore();

  const isBulkDiscount = getCartTotalCount(cartItems) >= 30;

  // const isTuesday = new Date().getDay() === 2;
  const isTuesday = true;

  const discountedProducts: Discount[] = cartItems
    .map(cartItem => ({
      id: cartItem.id,
      name: cartItem.name,
      discountRate: getBasicDiscountRate(cartItem),
    }))
    .filter(discount => discount.discountRate > 0);

  const discountRate = 0;

  const savedAmount = 0;

  return { discountedProducts, isBulkDiscount, isTuesday, discountRate, savedAmount };
}
