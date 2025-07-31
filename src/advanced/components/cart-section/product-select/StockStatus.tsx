import { useCartState } from '../../../contexts/CartContext';
import { getStockMessages } from '../../../reducer';

export const StockStatus = () => {
  const state = useCartState();
  const stockMessages = getStockMessages(state);

  return (
    <div id='stock-status' className='text-xs text-red-500 mt-3 whitespace-pre-line'>
      {stockMessages}
    </div>
  );
};
