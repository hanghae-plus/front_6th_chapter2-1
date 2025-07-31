interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderSummaryDetailsProps {
  cartItems?: CartItem[];
}

/**
 * OrderSummaryDetails React Component
 */
const OrderSummaryDetails = ({ cartItems = [] }: OrderSummaryDetailsProps) => {
  if (!cartItems.length) {
    return (
      <div className='text-center text-sm text-gray-400 py-8'>Empty Cart</div>
    );
  }

  return (
    <div className='space-y-3'>
      {cartItems.map(item => (
        <div key={item.id} className='flex justify-between text-sm'>
          <span className='text-gray-200'>
            {item.name} × {item.quantity}
          </span>
          <span className='text-white'>
            ₩{(item.price * item.quantity).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default OrderSummaryDetails;
