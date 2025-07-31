import { SelectorContainer } from "./selector/SelectorContainer";
import { CartItemBox } from "./CartItemBox";
import { StockInfoText } from "./selector/StockInfoText";

export const LeftColumn = ({ children }) => {
  return (
    <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
      {children}
    </div>
  );
};
