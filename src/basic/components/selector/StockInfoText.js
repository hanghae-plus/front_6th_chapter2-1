export const StockInfoText = () => {
  const stockInfoText = document.createElement("div");
  stockInfoText.id = "stock-status";
  stockInfoText.className = "text-xs text-red-500 mt-3 whitespace-pre-line";
  return stockInfoText;
};
