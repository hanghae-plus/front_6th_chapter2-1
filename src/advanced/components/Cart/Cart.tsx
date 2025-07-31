import React, { memo } from "react";
import { CSS_CLASSES } from "../../constants";
import { useCart } from "../../hooks/useCart";
import CartItem from "./CartItem";

const Cart: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div id="cart-items" data-testid="cart-items" className={CSS_CLASSES.CART_ITEMS}>
        <p className="py-8 text-center text-gray-500">장바구니가 비어있습니다.</p>
      </div>
    );
  }

  return (
    <div id="cart-items" data-testid="cart-items" className={CSS_CLASSES.CART_ITEMS}>
      {cartItems.map((item, index) => (
        <CartItem
          key={item.id}
          item={item}
          onQuantityChange={updateQuantity}
          onRemove={removeFromCart}
          isFirst={index === 0}
          isLast={index === cartItems.length - 1}
        />
      ))}
    </div>
  );
};

export default memo(Cart);
