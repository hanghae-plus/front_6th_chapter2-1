import { AddButton } from "./AddButton";
import { ProductSelector } from "./ProductSelector";
import { StockInfoText } from "./StockInfoText";

export const SelectorContainer = () => {
  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <ProductSelector />
      <AddButton />
      <StockInfoText />
    </div>
  );
};
