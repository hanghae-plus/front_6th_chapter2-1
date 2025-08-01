import { useState } from "react";
import { ProductOption } from "./ProductOption";
import { Product } from "../../model/types";

interface Props {
  productList: Product[];
  isLowStock: boolean;
}

export const ProductSelector = ({ productList, isLowStock }: Props) => {
  const [selected, setSelected] = useState<Product>(productList[0]);

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

        if (newSelected != null) {
          setSelected(newSelected);
        }
      }}
    >
      {productList.map(ProductOption)}
    </select>
  );
};
