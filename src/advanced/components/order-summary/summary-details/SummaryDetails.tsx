import { ItemDetails } from './ItemDetails';
import { PriceDetails } from './PriceDetails';
import { useCartState } from '../../../contexts/CartContext';
import { getCartSummary } from '../../../reducer';

export const SummaryDetails = () => {
  const state = useCartState();
  const summary = getCartSummary(state);

  if (summary.totalQuantity === 0) return '';

  return (
    <>
      <ItemDetails />
      <div className='border-t border-white/10 my-3'></div>
      <PriceDetails />
      <div className='flex justify-between text-sm tracking-wide text-gray-400'>
        <span>Shipping</span>
        <span>Free</span>
      </div>
    </>
  );
};
