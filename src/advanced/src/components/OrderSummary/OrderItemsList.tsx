interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderItemsListProps {
  items: CartItem[];
  originalAmount: number;
}

export default function OrderItemsList({ items, originalAmount }: OrderItemsListProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex justify-between text-xs tracking-wide text-gray-400"
        >
          <span>
            {item.name} x {item.quantity}
          </span>
          <span>₩{(item.price * item.quantity).toLocaleString()}</span>
        </div>
      ))}

      <div className="border-t border-white/10 my-3"></div>
      <div className="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩{originalAmount.toLocaleString()}</span>
      </div>

      <div className="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    </div>
  );
}