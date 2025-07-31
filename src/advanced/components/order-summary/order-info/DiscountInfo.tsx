import { useCartState } from '../../../contexts/CartContext';
import { getCartSummary } from '../../../reducer';

export const DiscountInfo = () => {
  const state = useCartState();
  const { savedAmount, totalDiscountRate } = getCartSummary(state);

  if (savedAmount <= 0) return '';

  return (
    <div id='discount-info' className='mb-4'>
      <div className='bg-green-500/20 rounded-lg p-3'>
        <div className='flex justify-between items-center mb-1'>
          <span className='text-xs uppercase tracking-wide text-green-400'>총 할인율</span>
          <span className='text-sm font-medium text-green-400'>
            {(totalDiscountRate * 100).toFixed(1)}%
          </span>
        </div>
        <div className='text-2xs text-gray-300'>₩{Math.round(savedAmount)} 할인되었습니다</div>
      </div>
    </div>
  );
};
