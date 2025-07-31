import { getStockInfoMessage } from "../../../basic/entity/stock";

export const StockInfoText = () => {
  return (
    <div
      id="stock-status"
      className="text-xs text-red-500 mt-3 whitespace-pre-line"
    >
      {getStockInfoMessage()}
    </div>
  );
};
