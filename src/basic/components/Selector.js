export function Selector() {
  const wrap = document.createElement('div');
  wrap.className = 'mb-6 pb-6 border-b border-gray-200';

  const sel = document.createElement('select');
  sel.id = 'product-select';
  sel.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';

  const btn = document.createElement('button');
  btn.id = 'add-to-cart';
  btn.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800';
  btn.textContent = 'Add to Cart';

  const stockDiv = document.createElement('div');
  stockDiv.id = 'stock-status';
  stockDiv.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';

  wrap.append(sel, btn, stockDiv);
  return { wrap, sel, btn, stockDiv };
}
