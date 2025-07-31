import type { Product } from '../type';
import { getStockMessages } from '../libs/getStockMessage';

interface StockStatusBoxProps {
  productList: Product[];
}

export const StockStatusBox = ({ productList }: StockStatusBoxProps) => {
  return <div className="text-xs text-red-500 mt-3 whitespace-pre-line">{getStockMessages(productList)}</div>;
};
