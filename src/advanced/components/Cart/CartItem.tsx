import React, { memo, useCallback } from "react";
import type { CartItem as CartItemType } from "../../types";

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  isFirst: boolean;
  isLast: boolean;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onQuantityChange,
  onRemove,
  isFirst,
  isLast,
}) => {
  const handleQuantityChange = useCallback(
    (change: number) => {
      const newQuantity = item.quantity + change;
      onQuantityChange(item.id, newQuantity);
    },
    [item.quantity, item.id, onQuantityChange],
  );

  const handleRemove = useCallback(() => {
    onRemove(item.id);
  }, [item.id, onRemove]);

  const getItemClassName = () => {
    // main.original.js와 동일한 클래스명
    let className = "grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100";
    if (isFirst) className += " first:pt-0";
    if (isLast) className += " last:border-b-0 last:pb-0";
    return className;
  };

  return (
    <div id={item.id} className={getItemClassName()}>
      {/* 상품 이미지 - main.original.js와 동일한 구조 */}
      <div className="bg-gradient-black relative h-20 w-20 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white/10"></div>
      </div>

      {/* 상품 정보 - main.original.js와 동일한 구조 */}
      <div>
        <h3 className="mb-1 text-base font-normal tracking-tight">
          {item.onSale && item.suggestSale
            ? "⚡💝"
            : item.onSale
              ? "⚡"
              : item.suggestSale
                ? "💝"
                : ""}
          {item.name}
        </h3>
        <p className="mb-0.5 text-xs tracking-wide text-gray-500">PRODUCT</p>
        <p className="mb-3 text-xs text-black">
          {item.onSale || item.suggestSale ? (
            <>
              <span className="text-gray-400 line-through">
                ₩{item.originalPrice.toLocaleString()}
              </span>{" "}
              <span
                className={
                  item.onSale && item.suggestSale
                    ? "text-purple-600"
                    : item.onSale
                      ? "text-red-500"
                      : "text-blue-500"
                }
              >
                ₩{item.price.toLocaleString()}
              </span>
            </>
          ) : (
            `₩${item.price.toLocaleString()}`
          )}
        </p>
        <div className="flex items-center gap-4">
          <button
            className="quantity-change flex h-6 w-6 items-center justify-center border border-black bg-white text-sm transition-all hover:bg-black hover:text-white"
            data-product-id={item.id}
            data-change="-1"
            onClick={() => handleQuantityChange(-1)}
          >
            −
          </button>
          <span className="quantity-number min-w-[20px] text-center text-sm font-normal tabular-nums">
            {item.quantity}
          </span>
          <button
            className="quantity-change flex h-6 w-6 items-center justify-center border border-black bg-white text-sm transition-all hover:bg-black hover:text-white"
            data-product-id={item.id}
            data-change="1"
            onClick={() => handleQuantityChange(1)}
          >
            +
          </button>
        </div>
      </div>

      {/* 오른쪽 영역 - main.original.js와 동일한 구조 */}
      <div className="text-right">
        <div className="mb-2 text-lg tabular-nums tracking-tight">
          {item.onSale || item.suggestSale ? (
            <>
              <span className="text-gray-400 line-through">
                ₩{item.originalPrice.toLocaleString()}
              </span>{" "}
              <span
                className={
                  item.onSale && item.suggestSale
                    ? "text-purple-600"
                    : item.onSale
                      ? "text-red-500"
                      : "text-blue-500"
                }
              >
                ₩{item.price.toLocaleString()}
              </span>
            </>
          ) : (
            `₩${item.price.toLocaleString()}`
          )}
        </div>
        <button
          className="remove-item text-2xs cursor-pointer border-b border-transparent uppercase tracking-wider text-gray-500 transition-colors hover:border-black hover:text-black"
          data-product-id={item.id}
          onClick={handleRemove}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default memo(CartItem);
