import AddToCartForm from './AddToCartForm';
import CartItem from './CartItem';
import { useCart } from '../../hooks/useCart';

export default function CartDisplay() {
  const { state } = useCart();

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
