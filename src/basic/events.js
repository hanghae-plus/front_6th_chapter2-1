import { state } from './state.js';

export function setupEventListeners(app) {
  const { addBtn, cartDisp, onUpdateSelectOptions, handleCalculateCartStuff } =
    app;

  addBtn.addEventListener('click', function () {
    const selItem = sel.value;
    const hasItem = state.products.some((p) => p.id === selItem);

    if (!selItem || !hasItem) {
      return;
    }

    const itemToAdd = state.products.find((p) => p.id === selItem);

    if (itemToAdd && itemToAdd.q > 0) {
      const itemInCart = document.getElementById(itemToAdd.id);
      if (itemInCart) {
        const qtyElem = itemInCart.querySelector('.quantity-number');
        const newQty = parseInt(qtyElem.textContent) + 1;
        if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
          qtyElem.textContent = newQty;
          itemToAdd.q--;
        } else {
          alert('재고가 부족합니다.');
        }
      } else {
        const newItem = document.createElement('div');
        newItem.id = itemToAdd.id;
        newItem.className =
          'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';
        newItem.innerHTML = `
          <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
            <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
          </div>
          <div>
            <h3 class="text-base font-normal mb-1 tracking-tight">${itemToAdd.onSale && itemToAdd.suggestSale ? '⚡💝' : itemToAdd.onSale ? '⚡' : itemToAdd.suggestSale ? '💝' : ''}${itemToAdd.name}</h3>
            <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
            <p class="text-xs text-black mb-3">${itemToAdd.onSale || itemToAdd.suggestSale ? '<span class="line-through text-gray-400">₩' + itemToAdd.originalVal.toLocaleString() + '</span> <span class="' + (itemToAdd.onSale && itemToAdd.suggestSale ? 'text-purple-600' : itemToAdd.onSale ? 'text-red-500' : 'text-blue-500') + '">₩' + itemToAdd.val.toLocaleString() + '</span>' : '₩' + itemToAdd.val.toLocaleString()}</p>
            <div class="flex items-center gap-4">
              <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="-1">−</button>
              <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
              <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="1">+</button>
            </div>
          </div>
          <div class="text-right">
            <div class="text-lg mb-2 tracking-tight tabular-nums">${itemToAdd.onSale || itemToAdd.suggestSale ? '<span class="line-through text-gray-400">₩' + itemToAdd.originalVal.toLocaleString() + '</span> <span class="' + (itemToAdd.onSale && itemToAdd.suggestSale ? 'text-purple-600' : itemToAdd.onSale ? 'text-red-500' : 'text-blue-500') + '">₩' + itemToAdd.val.toLocaleString() + '</span>' : '₩' + itemToAdd.val.toLocaleString()}</div>
            <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${itemToAdd.id}">Remove</a>
          </div>
        `;
        cartDisp.appendChild(newItem);
        itemToAdd.q--;
      }
      handleCalculateCartStuff();
      state.lastSelected = selItem;
    }
  });

  cartDisp.addEventListener('click', function (event) {
    const tgt = event.target;
    if (
      tgt.classList.contains('quantity-change') ||
      tgt.classList.contains('remove-item')
    ) {
      const prodId = tgt.dataset.productId;
      const itemElem = document.getElementById(prodId);
      const prod = state.products.find((p) => p.id === prodId);

      if (tgt.classList.contains('quantity-change')) {
        const qtyChange = parseInt(tgt.dataset.change);
        const qtyElem = itemElem.querySelector('.quantity-number');
        const currentQty = parseInt(qtyElem.textContent);
        const newQty = currentQty + qtyChange;

        if (newQty > 0 && newQty <= prod.q + currentQty) {
          qtyElem.textContent = newQty;
          prod.q -= qtyChange;
        } else if (newQty <= 0) {
          prod.q += currentQty;
          itemElem.remove();
        } else {
          alert('재고가 부족합니다.');
        }
      } else if (tgt.classList.contains('remove-item')) {
        const qtyElem = itemElem.querySelector('.quantity-number');
        const remQty = parseInt(qtyElem.textContent);
        prod.q += remQty;
        itemElem.remove();
      }

      handleCalculateCartStuff();
      onUpdateSelectOptions();
    }
  });
}
