import { getProductStatus } from "../utils/product.util";

export default function CartItem(cartItem) {
  const { quantity, ...product } = cartItem;
  const { id, name } = product;

  const productStatus = getProductStatus(product);

  const ICON = {
    superSale: "⚡💝",
    lightningSale: "⚡",
    suggestionSale: "💝",
    normal: "",
  };

  // 이 로직은 상품이 할인 중(onSale) 또는 제안 할인(suggestSale) 상태인지 확인하여, // 할인
  // 전 가격(originalVal)을 취소선(line-through)과 함께 보여주고, // 실제 판매가(val)는 할인
  // 종류에 따라 다른 색상(보라, 빨강, 파랑)으로 표시합니다. // 만약 할인 중이 아니라면, 그냥
  // 현재 가격만 보여줍니다.
  return /* HTML */ `<div
    id=${id}
    class="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0"
  >
    <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
      <div
        class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"
      ></div>
    </div>
    <div>
      <h3 class="text-base font-normal mb-1 tracking-tight">${ICON[productStatus]}${name}</h3>
      <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
      <p class="text-xs text-black mb-3">
        ${cartItem.onSale || cartItem.suggestSale
          ? '<span class="line-through text-gray-400">₩' +
            cartItem.originalVal.toLocaleString() +
            '</span> <span class="' +
            (cartItem.onSale && cartItem.suggestSale
              ? "text-purple-600"
              : cartItem.onSale
                ? "text-red-500"
                : "text-blue-500") +
            '">₩' +
            cartItem.val.toLocaleString() +
            "</span>"
          : "₩" + cartItem.val.toLocaleString()}
      </p>
      <div class="flex items-center gap-4">
        <button
          class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
          data-product-id="${cartItem.id}"
          data-change="-1"
        >
          −
        </button>
        <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums"
          >${quantity}</span
        >
        <button
          class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
          data-product-id="${cartItem.id}"
          data-change="1"
        >
          +
        </button>
      </div>
    </div>
    <div class="text-right">
      <div class="text-lg mb-2 tracking-tight tabular-nums">
        ${cartItem.onSale || cartItem.suggestSale
          ? '<span class="line-through text-gray-400">₩' +
            cartItem.originalVal.toLocaleString() +
            '</span> <span class="' +
            (cartItem.onSale && cartItem.suggestSale
              ? "text-purple-600"
              : cartItem.onSale
                ? "text-red-500"
                : "text-blue-500") +
            '">₩' +
            cartItem.val.toLocaleString() +
            "</span>"
          : "₩" + cartItem.val.toLocaleString()}
      </div>
      <a
        class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
        data-product-id="${cartItem.id}"
        >Remove</a
      >
    </div>
  </div>`;
}
