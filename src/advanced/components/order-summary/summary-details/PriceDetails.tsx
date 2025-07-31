import { useCartState } from '../../../contexts/CartContext';
import { getDiscountResult, getSubtotal } from '../../../reducer';

export const PriceDetails = () => {
  const state = useCartState();
  const subtotal = getSubtotal(state);
  const { discounts } = getDiscountResult(state);

  return (
    <>
      <div className='flex justify-between text-sm tracking-wide'>
        <span>Subtotal</span>
        <span>₩{subtotal}</span>
      </div>
      {discounts.map((discount) => (
        <div className='flex justify-between text-sm tracking-wide text-green-400'>
          <span className='text-xs'>{discount.reason}</span>
          <span className='text-xs'>-{discount.amount}</span>
        </div>
      ))}
    </>
  );
};
