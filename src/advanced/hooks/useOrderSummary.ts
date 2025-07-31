import { useMemo } from 'react';

import { useCartStore, useProductStore } from '@/advanced/store';
import { OrderItem } from '@/advanced/types/cart.type';

export default function useOrderSummary() {
  const { cartItems } = useCartStore();
  const { products } = useProductStore();

  const subTotal = cartItems.reduce((acc, item) => {
    const product = products.find(product => product.id === item.id);
    if (!product) return acc;
    return acc + product.price * item.quantity;
  }, 0);

  const orderList: OrderItem[] = useMemo(
    () =>
      cartItems
        .map(cartItem => {
          const product = products.find(product => product.id === cartItem.id);

          if (!product) return null;

          return {
            id: product.id,
            name: product.name,
            quantity: cartItem.quantity,
            totalPrice: product.price * cartItem.quantity,
          };
        })
        .filter(item => item !== null),
    [cartItems]
  );

  return { subTotal, orderList };
}
