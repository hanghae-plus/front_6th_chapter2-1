import { SelectorContainer } from "./selector/SelectorContainer";
import { CartItemBox } from "./CartItemBox";

export const LeftColumn = () => {
  return (
    <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
      <SelectorContainer />
      <CartItemBox />
    </div>
  );
};
