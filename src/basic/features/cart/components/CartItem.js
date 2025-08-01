/**
 * 개별 장바구니 아이템 HTML 구조 생성
 * @param {Object} item - 장바구니 아이템 데이터 {id, quantity}
 * @param {Object} product - 상품 데이터
 * @returns {string} HTML 문자열
 */
export function CartItem(item, product) {
  if (!product) return '';

  // 할인 아이콘 결정
  const discountIcon =
    product.isOnSale && product.isSuggestedSale
      ? '⚡💝'
      : product.isOnSale
        ? '⚡'
        : product.isSuggestedSale
          ? '💝'
          : '';

  // 가격 표시 결정
  const priceDisplay =
    product.isOnSale || product.isSuggestedSale
      ? `<span class="line-through text-gray-400">₩${product.originalPrice.toLocaleString()}</span> <span class="${product.isOnSale && product.isSuggestedSale ? 'text-purple-600' : product.isOnSale ? 'text-red-500' : 'text-blue-500'}">₩${product.price.toLocaleString()}</span>`
      : `₩${product.price.toLocaleString()}`;

  return `
    <div id="${product.id}" class="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0">
      <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>
      <div>
        <h3 class="text-base font-normal mb-1 tracking-tight">${discountIcon}${product.name}</h3>
        <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p class="text-xs text-black mb-3">${priceDisplay}</p>
        <div class="flex items-center gap-4">
          <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="-1">−</button>
          <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">${item.quantity}</span>
          <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="1">+</button>
        </div>
      </div>
      <div class="text-right">
        <div class="text-lg mb-2 tracking-tight tabular-nums">${priceDisplay}</div>
        <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${product.id}">Remove</a>
      </div>
    </div>
  `;
}
