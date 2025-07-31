import { useProductStore } from '../../store';
import { getLowStockProducts, generateStockWarningMessage } from '../../utils/stock';

export const StockInfo = () => {
  const products = useProductStore((state) => state.products);
  const lowStockProducts = getLowStockProducts(products);
  const warningMessage = generateStockWarningMessage(lowStockProducts);

  if (!warningMessage) return null;

  return (
    <div id="stock-status" className="text-xs text-red-500 mt-3 whitespace-pre-line">
      {warningMessage}
    </div>
  );
}; 