import { CartItem } from "./CartItem";

export const CartItemBox = ({
  onClick,
  onClickRemove,
  increaseCartItemQuantity,
  decreaseCartItemQuantity,
  cartItems = [],
  productList = [],
}) => {
  return (
    <div id="cart-items" onClick={onClick}>
      {cartItems.map((cartItem) => {
        const product = productList.find((x) => x.id === cartItem.id);
        return (
          <CartItem
            key={`cartItem-${cartItem.id}`}
            {...cartItem}
            onSale={product.onSale}
            suggestSale={product.suggestSale}
            price={product.price}
            originalPrice={product.originalPrice}
            onClickRemove={onClickRemove}
            increaseCartItemQuantity={increaseCartItemQuantity}
            decreaseCartItemQuantity={decreaseCartItemQuantity}
          />
        );
      })}
    </div>
  );
};
