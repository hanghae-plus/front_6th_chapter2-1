import { ELEMENT_IDS } from '@/basic/shared/constants/elementIds.js';

interface CartTotalProps {
  amount: number;
  discountRate: number;
  point: number;
}

/**
 * CartTotal React Component
 */
const CartTotal = ({ amount, discountRate, point }: CartTotalProps) => {
  const formattedAmount = Math.round(amount).toLocaleString();
  const discountPercentage =
    discountRate > 0 ? (discountRate * 100).toFixed(1) : null;

  return (
    <div className='pt-5 border-t border-white/10'>
      <div className='flex justify-between items-baseline'>
        <span className='text-sm uppercase tracking-wider'>Total</span>
        <div className='text-2xl tracking-tight'>
          ₩{formattedAmount}
          {discountPercentage && (
            <span className='text-green-500 ml-2 text-sm'>
              ({discountPercentage}% 할인 적용)
            </span>
          )}
        </div>
      </div>
      <div
        id={ELEMENT_IDS.LOYALTY_POINTS}
        className='text-xs text-blue-400 mt-2 text-right'
      >
        적립 포인트: {point}p
      </div>
    </div>
  );
};

export default CartTotal;
