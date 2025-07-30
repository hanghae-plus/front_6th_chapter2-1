import React from "react";
import { Cart as CartItemType } from "../types";
import { useCart } from "../context/CartContext";

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  const handleQuantityChange = (change: number) => {
    updateQuantity(product.id, change);
  };

  const handleRemove = () => {
    removeFromCart(product.id);
  };

  const getProductDisplayName = (): string => {
    if (product.onSale && product.suggestSale) {
      return `⚡💝${product.name}`;
    } else if (product.onSale) {
      return `⚡${product.name}`;
    } else if (product.suggestSale) {
      return `💝${product.name}`;
    }
    return product.name;
  };

  const getPriceDisplay = (): React.ReactNode => {
    if (product.onSale || product.suggestSale) {
      return (
        <>
          <span className="line-through text-gray-400">₩{product.originalVal.toLocaleString()}</span>{" "}
          <span className={product.onSale && product.suggestSale ? "text-purple-600" : product.onSale ? "text-red-500" : "text-blue-500"}>₩{product.val.toLocaleString()}</span>
        </>
      );
    }
    return `₩${product.val.toLocaleString()}`;
  };

  return (
    <div className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0">
      <div className="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>

      <div>
        <h3 className="text-base font-normal mb-1 tracking-tight">{getProductDisplayName()}</h3>
        <p className="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p className="text-xs text-black mb-3">{getPriceDisplay()}</p>

        <div className="flex items-center gap-4">
          <button
            onClick={() => handleQuantityChange(-1)}
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
          >
            −
          </button>
          <span className="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(1)}
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
          >
            +
          </button>
        </div>
      </div>

      <div className="text-right">
        <div className="text-lg mb-2 tracking-tight tabular-nums">{getPriceDisplay()}</div>
        <button
          onClick={handleRemove}
          className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
        >
          Remove
        </button>
      </div>
    </div>
  );
};
