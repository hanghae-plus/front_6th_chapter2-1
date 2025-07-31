// CartItem.js
// 상품 객체와 수량을 받아 카트 아이템 DOM 엘리먼트를 반환하는 컴포넌트

export function createCartItemElement(product, quantity = 1) {
  const newItem = document.createElement('div');
  newItem.id = product.id;
  newItem.className =
    'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';
  let priceHtml = '';
  if (product.onSale || product.suggestSale) {
    priceHtml = `<span class="line-through text-gray-400">${product.price}원</span> <span class="${product.onSale && product.suggestSale ? 'text-purple-600' : product.onSale ? 'text-red-500' : 'text-blue-500'}">${product.discountPrice}원</span>`;
  } else {
    priceHtml = product.discountPrice + '원';
  }
  const namePrefix =
    product.onSale && product.suggestSale ? '⚡💝' : product.onSale ? '⚡' : product.suggestSale ? '💝' : '';
  newItem.innerHTML =
    '<div class="w-20 h-20 bg-gradient-black relative overflow-hidden">' +
    '  <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>' +
    '</div>' +
    '<div>' +
    `  <h3 class="text-base font-normal mb-1 tracking-tight">${namePrefix}${product.name}</h3>` +
    '  <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>' +
    `  <p class="text-xs text-black mb-3">${priceHtml}</p>` +
    '  <div class="flex items-center gap-4">' +
    `    <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="-1">−</button>` +
    `    <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">${quantity}</span>` +
    `    <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="1">+</button>` +
    '  </div>' +
    '</div>' +
    '<div class="text-right">' +
    `  <div class="text-lg mb-2 tracking-tight tabular-nums">${priceHtml}</div>` +
    `  <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${product.id}">Remove</a>` +
    '</div>';
  return newItem;
}
