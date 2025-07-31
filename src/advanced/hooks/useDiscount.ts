import { useCartStore, useProductStore } from '@/advanced/store';
import { Discount } from '@/advanced/types/discount.type';
import { getCartTotalCount } from '@/advanced/utils/cart.util';
import { getBasicDiscountRate } from '@/advanced/utils/discount.util';

export default function useDiscount() {
  const { cartItems } = useCartStore();
  const { products } = useProductStore();

  const isBulkDiscount = getCartTotalCount(cartItems) >= 30;

  // const isTuesday = new Date().getDay() === 2;
  const isTuesday = true;

  const discountedProducts: Discount[] = cartItems
    .map(cartItem => {
      const product = products.find(product => product.id === cartItem.id);

      if (!product) return null;

      return {
        id: product.id,
        name: product.name,
        discountRate: getBasicDiscountRate(cartItem),
      };
    })
    .filter(discount => discount !== null);

  const discountRate = 0;

  const savedAmount = 0;

  return { discountedProducts, isBulkDiscount, isTuesday, discountRate, savedAmount };
}
