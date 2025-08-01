import { CartItem, Product } from "../model/types";
import { isTuesday } from "../utils/day";

interface Props {
  cartItems: CartItem[];
  productList: Product[];
  itemDiscounts: {
    name: string;
    discount: number;
  }[];
  totalItemCount: number;
  totalOriginalPrice: number;
  totalDiscountedPrice: number;
}

export const SummaryDetails = ({
  cartItems,
  productList,
  itemDiscounts,
  totalItemCount,
  totalOriginalPrice,
  totalDiscountedPrice,
}: Props) => {
  if (totalOriginalPrice <= 0) {
    return <div id="summary-details" className="space-y-3"></div>;
  }

  return (
    <div id="summary-details" className="space-y-3">
      {cartItems.map((cartItem) => {
        const currentItem = productList.find((x) => x.id === cartItem.id);

        if (currentItem == null) {
          return null;
        }

        const selectedQuantity = cartItem.selectedQuantity;
        const itemTotal = currentItem.price * selectedQuantity;

        return (
          <div
            className="flex justify-between text-xs tracking-wide text-gray-400"
            key={`cartItem-${cartItem.id}`}
          >
            <span>
              {currentItem.name} x {selectedQuantity}
            </span>
            <span>₩{itemTotal.toLocaleString()}</span>
          </div>
        );
      })}

      <div className="border-t border-white/10 my-3"></div>
      <div className="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩{totalOriginalPrice.toLocaleString()}</span>
      </div>

      {totalItemCount >= 30 ? (
        <div className="flex justify-between text-sm tracking-wide text-green-400">
          <span className="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span className="text-xs">-25%</span>
        </div>
      ) : itemDiscounts.length > 0 ? (
        itemDiscounts.map((itemDiscount) => (
          <div
            className="flex justify-between text-sm tracking-wide text-green-400"
            key={`itemDiscount-${itemDiscount.name}`}
          >
            <span className="text-xs">${itemDiscount.name} (10개↑)</span>
            <span className="text-xs">-${itemDiscount.discount}%</span>
          </div>
        ))
      ) : null}
      {isTuesday() && totalDiscountedPrice > 0 ? (
        <div className="flex justify-between text-sm tracking-wide text-purple-400">
          <span className="text-xs">🌟 화요일 추가 할인</span>
          <span className="text-xs">-10%</span>
        </div>
      ) : null}
      <div className="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    </div>
  );
};
