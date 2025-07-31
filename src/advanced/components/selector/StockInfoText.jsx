export const StockInfoText = ({ children }) => {
  return (
    <div
      id="stock-status"
      className="text-xs text-red-500 mt-3 whitespace-pre-line"
    >
      {children}
    </div>
  );
};
