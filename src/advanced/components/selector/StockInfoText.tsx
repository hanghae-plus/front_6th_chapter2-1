interface Props {
  children: React.ReactNode;
}

export const StockInfoText = ({ children }: Props) => {
  return (
    <div
      id="stock-status"
      className="text-xs text-red-500 mt-3 whitespace-pre-line"
    >
      {children}
    </div>
  );
};
