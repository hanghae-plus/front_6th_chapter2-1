import { CartItem as CartItemType, Product } from "../model/types";
import { CartItem } from "./CartItem";

interface Props {
  onClickRemove: (item: Pick<CartItemType, "id" | "selectedQuantity">) => void;
  increaseCartItemQuantity: (item: Pick<CartItemType, "id">) => void;
  decreaseCartItemQuantity: (item: Pick<CartItemType, "id">) => void;
  cartItems: CartItemType[];
  productList: Product[];
}

export const CartItemBox = ({
  onClickRemove,
  increaseCartItemQuantity,
  decreaseCartItemQuantity,
  cartItems = [],
  productList = [],
}: Props) => {
  return (
    <div id="cart-items">
      {cartItems.map((cartItem) => {
        const product = productList.find((x) => x.id === cartItem.id);

        if (product == null) {
          return null;
        }

        return (
          <CartItem
            key={`cartItem-${cartItem.id}`}
            {...cartItem}
            name={product.name}
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
