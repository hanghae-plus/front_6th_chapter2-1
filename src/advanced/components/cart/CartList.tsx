import { ReactElement } from 'react';

import CartListItem from '@/advanced/components/cart/CartListItem';
import { useCartStore } from '@/advanced/store';

export default function CartList(): ReactElement {
  const { cartItems } = useCartStore();

  return (
    <div id="cart-items">
      {cartItems.map(item => (
        <CartListItem key={item.id} item={item} />
      ))}
    </div>
  );
}
