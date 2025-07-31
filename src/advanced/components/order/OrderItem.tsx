import { CartItem, Product } from '../../types';

interface OrderItemProps {
  cartItem: CartItem;
  product: Product;
}

const OrderItem = ({ cartItem, product }: OrderItemProps) => {
  return (
    <div className="flex justify-between text-xs tracking-wide text-gray-400">
      <span>
        {product.name} x {cartItem.quantity}
      </span>
      <span>₩{(product.price * cartItem.quantity).toLocaleString()}</span>
    </div>
  );
};

export default OrderItem;
