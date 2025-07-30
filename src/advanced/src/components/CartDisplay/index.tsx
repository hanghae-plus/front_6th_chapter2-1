import { useContext } from 'react';
import AddToCartForm from './AddToCartForm';
import CartItem from './CartItem';
import { CartContext } from '../../contexts/cart/CartContext';

export default function CartDisplay() {
  const cart = useContext(CartContext);
  if (!cart) return;

  const { state } = cart;

  return (
    <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
      <AddToCartForm />
      <div id="cart-items">
        {state.items.map((item) => (
          <CartItem
            key={item.id}
            id={item.id}
            name={item.name}
            originalPrice={item.originalPrice}
            price={item.price}
            quantity={item.quantity}
            saleIcon={item.saleIcon}
          />
        ))}
      </div>
    </div>
  );
}
