import React, { memo } from "react";
import type { CartItem, Product } from "../../types";

interface CartItemSummaryProps {
  cartItem: CartItem;
  product: Product;
}

const CartItemSummary: React.FC<CartItemSummaryProps> = ({ cartItem, product }) => {
  const itemTotal = product.val * cartItem.quantity;

  return (
    <div className="flex justify-between text-xs tracking-wide text-gray-400">
      <span>
        {product.name} x {cartItem.quantity}
      </span>
      <span>₩{itemTotal.toLocaleString()}</span>
    </div>
  );
};

export default memo(CartItemSummary);
