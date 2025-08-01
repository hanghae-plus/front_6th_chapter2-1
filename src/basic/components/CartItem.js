export function CartItem(item, state) {
  const p = state.productList.find((x) => x.id === item.id);
  const d = document.createElement('div');
  d.id = item.id;
  d.className =
    'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';
  d.innerHTML = `
<div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
  <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
</div>
<div>
  <h3 class="text-base font-normal mb-1 tracking-tight">${p.name}</h3>
  <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
  <p class="text-xs text-black mb-3">${p.onSale || p.suggest ? `<span class="line-through text-gray-400">₩${p.originalPrice.toLocaleString()}</span> <span class="${'text-red-500'}">₩${p.price.toLocaleString()}</span>` : `₩${p.price.toLocaleString()}`}</p>
  <div class="flex items-center gap-4">
    <button class="quantity-change w-6 h-6 border border-black bg-white text-sm" data-id="${p.id}" data-change="-1">−</button>
    <span class="quantity-number text-sm min-w-[20px] text-center">${item.qty}</span>
    <button class="quantity-change w-6 h-6 border border-black bg-white text-sm" data-id="${p.id}" data-change="1">+</button>
  </div>
</div>
<div class="text-right">
  <div class="text-lg mb-2">${p.onSale || p.suggest ? `<span class="line-through text-gray-400">₩${(p.originalPrice * item.qty).toLocaleString()}</span> <span class="text-red-500">₩${(p.price * item.qty).toLocaleString()}</span>` : `₩${(p.price * item.qty).toLocaleString()}`}</div>
  <a class="remove-item text-2xs text-gray-500 uppercase" data-id="${p.id}">Remove</a>
</div>`;
  return d;
}
