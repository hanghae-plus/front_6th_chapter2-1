import { ItemDetails } from './ItemDetails';
import { PriceDetails } from './PriceDetails';
import { useCartState } from '../../../contexts/CartContext';
import { getTotalQuantity } from '../../../contexts/getters';

export const SummaryDetails = () => {
  const state = useCartState();
  const totalQuantity = getTotalQuantity(state);

  if (totalQuantity === 0) return '';

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
