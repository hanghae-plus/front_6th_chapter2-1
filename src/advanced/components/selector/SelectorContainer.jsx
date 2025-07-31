import { AddButton } from "./AddButton";
import { ProductSelector } from "./ProductSelector";

export const SelectorContainer = ({ isLowStock, bottom = null } = {}) => {
  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <ProductSelector isLowStock={isLowStock} />
      <AddButton />
      {bottom}
    </div>
  );
};
