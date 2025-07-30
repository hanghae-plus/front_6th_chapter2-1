import React from "react";
import { useCart } from "../context/CartContext";
import { CartItem } from "./CartItem";

export const CartDisplay: React.FC = () => {
  const { state } = useCart();
  const { cartItems } = state;

  if (cartItems.length === 0) {
    return <div className="text-center py-8 text-gray-500">장바구니가 비어있습니다.</div>;
  }

  return (
    <div>
      {cartItems.map(item => (
        <CartItem key={item.id} item={item} />
      ))}
    </div>
  );
};
