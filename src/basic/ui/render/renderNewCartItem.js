/**
 * 새로운 장바구니 아이템 렌더링 함수
 * @param {Object} product - 상품 정보
 * @param {number} quantity - 수량
 * @returns {string} 렌더링된 HTML
 */
export const renderNewCartItem = (product, quantity = 1) => {
  // 가격 렌더링
  const priceString =
    product.onSale || product.suggestSale
      ? /* HTML */ `<span class="line-through text-gray-400"
            >₩${product.originalVal.toLocaleString()}</span
          >
          <span
            class="${product.onSale && product.suggestSale
              ? "text-purple-600"
              : product.onSale
                ? "text-red-500"
                : "text-blue-500"}"
            >₩${product.val.toLocaleString()}</span
          >`
      : /* HTML */ `₩${product.val.toLocaleString()}`;

  // 할인 접두사 렌더링
  const salePrefix =
    product.onSale && product.suggestSale
      ? "⚡💝"
      : product.onSale
        ? "⚡"
        : product.suggestSale
          ? "💝"
          : "";

  return /* HTML */ `
    <div
      id="${product.id}"
      class="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0"
    >
      <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div
          class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"
        ></div>
      </div>
      <div>
        <h3 class="text-base font-normal mb-1 tracking-tight">
          ${salePrefix}${product.name}
        </h3>
        <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p class="text-xs text-black mb-3">${priceString}</p>
        <div class="flex items-center gap-4">
          <button
            class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
            data-product-id="${product.id}"
            data-change="-1"
          >
            -
          </button>
          <span
            class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums"
            >${quantity}</span
          >
          <button
            class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
            data-product-id="${product.id}"
            data-change="1"
          >
            +
          </button>
        </div>
      </div>
      <div class="text-right">
        <div class="text-lg mb-2 tracking-tight tabular-nums">
          ${priceString}
        </div>
        <a
          class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
          data-product-id="${product.id}"
          >Remove</a
        >
      </div>
    </div>
  `;
};
