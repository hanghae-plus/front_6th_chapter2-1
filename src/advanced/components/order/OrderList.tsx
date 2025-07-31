type Props = {
  cartItems: {
    id: string;
    name: string;
    quantity: number;
    discountPrice: number;
  }[];
};

const OrderList = ({ cartItems }: Props) => {
  return (
    <>
      {cartItems.map(({ name, quantity, discountPrice, id }) => (
        <div className="flex justify-between text-xs tracking-wide text-gray-400" key={`orderitem-${id}`}>
          <span>
            {name} x {quantity}
          </span>
          <span>₩{(quantity * discountPrice).toLocaleString()}</span>
        </div>
      ))}
    </>
  );
};

export default OrderList;
