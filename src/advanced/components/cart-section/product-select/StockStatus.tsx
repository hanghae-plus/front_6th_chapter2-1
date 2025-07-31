import { useCartState } from '../../../contexts/CartContext';
import { getCartSummary } from '../../../reducer';

export const StockStatus = () => {
  const state = useCartState();
  const { stockMessages } = getCartSummary(state);

  return (
    <div id='stock-status' className='text-xs text-red-500 mt-3 whitespace-pre-line'>
      {stockMessages}
    </div>
  );
};
