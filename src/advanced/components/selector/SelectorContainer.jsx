import { AddButton } from "./AddButton";
import { ProductSelector } from "./ProductSelector";

export const SelectorContainer = ({ bottom = null } = {}) => {
  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <ProductSelector />
      <AddButton />
      {bottom}
    </div>
  );
};
