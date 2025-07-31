import { useCartWithProduct } from '@/hooks/useCartWithProducts';

import ShoppingCartItem from './ShoppingCartItem';

const ShoppingCart = () => {
  const { cartItems: items } = useCartWithProduct();

  return (
    <div id="cart-items">
      {items.map((item) => (
        <ShoppingCartItem product={item} key={`shoppingcartitem-${item.id}`} />
      ))}
    </div>
  );
};

export default ShoppingCart;
