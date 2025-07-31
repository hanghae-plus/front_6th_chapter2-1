import { useState } from "react";
import { ProductOption } from "./ProductOption";

export const ProductSelector = ({ productList, isLowStock }) => {
  const [selected, setSelected] = useState(productList[0]);

  return (
    <select
      id="product-select"
      className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
      style={{
        borderColor: isLowStock ? "orange" : "",
      }}
      value={selected.id}
      onChange={(e) => {
        const newSelected = productList.find(
          (item) => item.id === e.target.value
        );

        setSelected(newSelected);
      }}
    >
      {productList.map(ProductOption)}
    </select>
  );
};
