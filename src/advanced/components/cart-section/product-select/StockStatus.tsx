import { useCartState } from '../../../contexts/CartContext';
import { getLowStockProducts } from '../../../contexts/getters';

export const StockStatus = () => {
  const state = useCartState();
  const lowStockProducts = getLowStockProducts(state);

  const stockMessages = lowStockProducts.map((p) =>
    p.quantity > 0 ? `${p.name}: 재고 부족 (${p.quantity}개 남음)` : `${p.name}: 품절`,
  );
  return (
    <div id='stock-status' className='text-xs text-red-500 mt-3 whitespace-pre-line'>
      {stockMessages.join('\n')}
    </div>
  );
};
