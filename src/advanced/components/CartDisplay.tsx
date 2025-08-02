import { useMemo, useCallback } from "react";
import type { CartItem, Product } from "../types";
import { DISCOUNT_THRESHOLDS, QUANTITY_CHANGE } from "../constants";

type CartItemProps = {
  item: CartItem;
  products: Product[];
  onQuantityChange: (productId: string, change: number) => void;
  onRemove: (productId: string) => void;
};

type CartDisplayProps = {
  items: CartItem[];
  products: Product[];
  onQuantityChange: (productId: string, change: number) => void;
  onRemove: (productId: string) => void;
};

const PriceDisplayComponent = ({
  color = "blue",
  originalPrice,
  price,
}: {
  color: string;
  originalPrice: number;
  price: number;
}) => {
  return (
    <>
      <span className="line-through text-gray-400">
        ₩{originalPrice.toLocaleString()}
      </span>{" "}
      <span className={`text-${color}`}>₩{price.toLocaleString()}</span>
    </>
  );
};

function CartItemComponent({
  item,
  products,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  const filteredItem = products.filter(
    (product) => product.id === item.product.id
  )[0];
  const { isOnLightningSale, isSuggestedSale, originalPrice, price, id, name } =
    filteredItem;
  const { quantity } = item;

  const priceDisplay = () => {
    if (isOnLightningSale && isSuggestedSale) {
      const color = "purple-600";
      return (
        <PriceDisplayComponent
          originalPrice={originalPrice}
          price={price}
          color={color}
        />
      );
    } else if (isOnLightningSale) {
      const color = "red-500";
      return (
        <PriceDisplayComponent
          originalPrice={originalPrice}
          price={price}
          color={color}
        />
      );
    } else if (isSuggestedSale) {
      const color = "blue-500";
      return (
        <PriceDisplayComponent
          originalPrice={originalPrice}
          price={price}
          color={color}
        />
      );
    } else {
      return `₩${price.toLocaleString()}`;
    }
  };

  const nameDisplay = useMemo(() => {
    const saleIcon =
      isOnLightningSale && isSuggestedSale
        ? "⚡💝"
        : isOnLightningSale
        ? "⚡"
        : isSuggestedSale
        ? "💝"
        : "";
    return saleIcon + name;
  }, [isOnLightningSale, isSuggestedSale, name]);

  const shouldBoldPrice = quantity >= DISCOUNT_THRESHOLDS.INDIVIDUAL_DISCOUNT;

  const handleDecrease = useCallback(() => {
    onQuantityChange(id, QUANTITY_CHANGE.DECREASE);
  }, [onQuantityChange, id]);

  const handleIncrease = useCallback(() => {
    onQuantityChange(id, QUANTITY_CHANGE.INCREASE);
  }, [onQuantityChange, id]);

  const handleRemove = useCallback(() => {
    onRemove(id);
  }, [onRemove, id]);

  return (
    <div className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0">
      <div className="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>

      <div>
        <h3 className="text-base font-normal mb-1 tracking-tight">
          {nameDisplay}
        </h3>
        <p className="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p className="text-xs text-black mb-3">{priceDisplay()}</p>

        <div className="flex items-center gap-4">
          <button
            onClick={handleDecrease}
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
          >
            {`−`}
          </button>
          <span className="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">
            {quantity}
          </span>
          <button
            onClick={handleIncrease}
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
          >
            {`+`}
          </button>
        </div>
      </div>

      <div className="text-right">
        <div
          className={`text-lg mb-2 tracking-tight tabular-nums ${
            shouldBoldPrice ? "font-bold" : ""
          }`}
        >
          {priceDisplay()}
        </div>
        <button
          onClick={handleRemove}
          className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export function CartDisplay({
  items,
  products,
  onQuantityChange,
  onRemove,
}: CartDisplayProps) {
  if (items.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        장바구니가 비어있습니다.
      </div>
    );
  }

  return (
    <div>
      {items.map((item) => (
        <CartItemComponent
          key={item.id}
          item={item}
          products={products}
          onQuantityChange={onQuantityChange}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
