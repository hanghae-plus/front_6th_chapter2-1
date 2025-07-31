import { TUESDAY_DAY_OF_WEEK } from '@/advanced/data/date.data';
import { useCartStore, useProductStore } from '@/advanced/store';
import { getCartTotalCount } from '@/advanced/utils/cart.util';

export default function useDiscount() {
  const { cartItems } = useCartStore();
  const { products } = useProductStore();

  const isBulkDiscount = getCartTotalCount(cartItems) >= 30;

  const isTuesday = new Date().getDay() === TUESDAY_DAY_OF_WEEK;

  const basicDiscountedProducts: string[] = cartItems
    .map(cartItem => {
      if (cartItem.quantity < 10) return null;

      const product = products.find(product => product.id === cartItem.id);

      if (!product) return null;

      return product.id;
    })
    .filter(discount => discount !== null);

  return {
    basicDiscountedProducts,
    isBulkDiscount,
    isTuesday,
  };
}
