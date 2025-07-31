import { prodList } from "../../data";

export const getStockInfoMessage = () => {
  return prodList.reduce((acc, item) => {
    if (item.quantity < 5) {
      if (item.quantity > 0) {
        acc += `${item.name}: 재고 부족 (${item.quantity}개 남음)\n`;
      } else {
        acc += `${item.name}: 품절\n`;
      }
    }
    return acc;
  }, "");
};

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
