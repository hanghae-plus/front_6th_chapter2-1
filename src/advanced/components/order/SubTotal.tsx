type Props = { subTotal: number };

const SubTotal = ({ subTotal }: Props) => {
  return (
    <>
      <div className="border-t border-white/10 my-3"></div>
      <div className="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩{subTotal.toLocaleString()}</span>
      </div>
    </>
  );
};

export default SubTotal;
