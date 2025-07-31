type Props = {
  name: string;
  quantity: number;
  itemTotal: number;
};

const OrderList = ({ name, quantity, itemTotal }: Props) => {
  return (
    <div className="flex justify-between text-xs tracking-wide text-gray-400">
      <span>
        {name} x {quantity}
      </span>
      <span>₩{itemTotal.toLocaleString()}</span>
    </div>
  );
};

export default OrderList;
