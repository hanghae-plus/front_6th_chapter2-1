import { useMemo } from 'react';

import { DISCOUNT_RATE_TUESDAY } from '@/advanced/data/discount.data';
import useDiscount from '@/advanced/hooks/useDiscount';
import { useCartStore, useProductStore } from '@/advanced/store';
import { OrderItem } from '@/advanced/types/cart.type';
import { getBasicDiscountRate, getDiscountedPrice } from '@/advanced/utils/discount.util';

export default function useOrderSummary() {
  const { cartItems } = useCartStore();
  const { products } = useProductStore();
  const { basicDiscountedProducts, isTuesday } = useDiscount();

  const originalTotalPrice = cartItems.reduce((acc, item) => {
    const product = products.find(product => product.id === item.id);

    if (!product) return acc;

    return acc + product.originalPrice * item.quantity;
  }, 0);

  const subTotal = cartItems.reduce((acc, item) => {
    const product = products.find(product => product.id === item.id);

    if (!product) return acc;

    return acc + product.price * item.quantity;
  }, 0);

  const totalPrice = getDiscountedPrice(
    cartItems.reduce((acc, item) => {
      const product = products.find(product => product.id === item.id);

      if (!product) return acc;

      const isBasicDiscounted = basicDiscountedProducts.includes(product.id);
      const basicDiscountRate = getBasicDiscountRate(product.id);

      const price = isBasicDiscounted
        ? getDiscountedPrice(product.price, basicDiscountRate)
        : product.price;

      return acc + price * item.quantity;
    }, 0),
    isTuesday ? DISCOUNT_RATE_TUESDAY : 0
  );

  const totalDiscountRate = subTotal > 0 ? (subTotal - totalPrice) / subTotal : 0;

  const totalSavedAmount = originalTotalPrice - totalPrice;

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

  return {
    subTotal,
    orderList,
    originalTotalPrice,
    totalPrice,
    totalDiscountRate,
    totalSavedAmount,
  };
}
