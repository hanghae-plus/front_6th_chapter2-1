import { useCart } from 'cart/context';
import { getItemDiscount, isTuesday } from 'cart/utils';

export function useOrderSummary() {
  const { cartItems, cartTotal } = useCart();

  const subtotal = cartItems.reduce((sum, { product, quantity }) => {
    return sum + product.val * quantity;
  }, 0);

  const totalQuantity = cartItems.reduce(
    (sum, { quantity }) => sum + quantity,
    0
  );

  const isCurrentlyTuesday = isTuesday();

  const itemDiscounts = cartItems
    .filter(({ quantity }) => quantity >= 10)
    .map(({ product, quantity }) => {
      const discountResult = getItemDiscount(product, quantity);
      return {
        name: product.name,
        discount: Math.round(discountResult.itemDiscount * 100),
      };
    });

  // 할인 표시 조건
  const showBulkDiscount = totalQuantity >= 30;
  const showIndividualDiscounts = itemDiscounts.length > 0;
  const showTuesdayDiscount = isCurrentlyTuesday && cartTotal > 0;

  return {
    subtotal,
    totalQuantity,
    isCurrentlyTuesday,
    itemDiscounts,
    showBulkDiscount,
    showIndividualDiscounts,
    showTuesdayDiscount,
  };
}
