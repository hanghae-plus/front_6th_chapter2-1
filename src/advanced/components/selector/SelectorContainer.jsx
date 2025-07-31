import { useState } from "react";
import { ProductOption } from "./ProductOption";

export const SelectorContainer = ({
  cartItems,
  addToCart,
  productList,
  isLowStock,
  setLastSelectedItem,
  bottom = null,
} = {}) => {
  const [selected, setSelected] = useState(productList[0]);

  // TODO: QA 해봐야함
  const onClick = () => {
    if (!selected || selected.quantity === 0) {
      return;
    }

    const isAlreadyInCart = cartItems.some((item) => item.id === selected.id);
    if (isAlreadyInCart && selected.quantity < 1) {
      alert("재고가 부족합니다.");
      return;
    }

    addToCart(selected);
    setLastSelectedItem(selected.id);
  };

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
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

      <button
        onClick={onClick}
        id="add-to-cart"
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
      >
        Add to Cart
      </button>

      {bottom}
    </div>
  );
};
