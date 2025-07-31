import { state } from './state.js';
import { onUpdateSelectOptions } from './view.js';

export function setupEventListeners(app) {
  const {
    addBtn,
    cartDisp,
    productSelect,
    handleCalculateCartStuff,
  } = app;

  addBtn.addEventListener('click', function () {
    var selItem = productSelect.value;
    var hasItem = false;
    for (var idx = 0; idx < state.products.length; idx++) {
      if (state.products[idx].id === selItem) {
        hasItem = true;
        break;
      }
    }
    if (!selItem || !hasItem) {
      return;
    }
    var itemToAdd = null;
    for (var j = 0; j < state.products.length; j++) {
      if (state.products[j].id === selItem) {
        itemToAdd = state.products[j];
        break;
      }
    }
    if (itemToAdd && itemToAdd.q > 0) {
      var item = document.getElementById(itemToAdd['id']);
      if (item) {
        var qtyElem = item.querySelector('.quantity-number');
        var newQty = parseInt(qtyElem['textContent']) + 1;
        if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
          qtyElem.textContent = newQty;
          itemToAdd['q']--;
        } else {
          alert('재고가 부족합니다.');
        }
      } else {
        var newItem = document.createElement('div');
        newItem.id = itemToAdd.id;
        newItem.className =
          'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';
        newItem.innerHTML = `
          <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
            <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
          </div>
          <div>
            <h3 class="text-base font-normal mb-1 tracking-tight">${
              itemToAdd.onSale && itemToAdd.suggestSale
                ? '⚡💝'
                : itemToAdd.onSale
                ? '⚡'
                : itemToAdd.suggestSale
                ? '💝'
                : ''
            }${itemToAdd.name}</h3>
            <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
            <p class="text-xs text-black mb-3">${
              itemToAdd.onSale || itemToAdd.suggestSale
                ? '<span class="line-through text-gray-400">₩' +
                  itemToAdd.originalVal.toLocaleString() +
                  '</span> <span class="' +
                  (itemToAdd.onSale && itemToAdd.suggestSale
                    ? 'text-purple-600'
                    : itemToAdd.onSale
                    ? 'text-red-500'
                    : 'text-blue-500') +
                  '">₩' +
                  itemToAdd.val.toLocaleString() +
                  '</span>'
                : '₩' + itemToAdd.val.toLocaleString()
            }</p>
            <div class="flex items-center gap-4">
              <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${
                itemToAdd.id
              }" data-change="-1">−</button>
              <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
              <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${
                itemToAdd.id
              }" data-change="1">+</button>
            </div>
          </div>
          <div class="text-right">
            <div class="text-lg mb-2 tracking-tight tabular-nums">${
              itemToAdd.onSale || itemToAdd.suggestSale
                ? '<span class="line-through text-gray-400">₩' +
                  itemToAdd.originalVal.toLocaleString() +
                  '</span> <span class="' +
                  (itemToAdd.onSale && itemToAdd.suggestSale
                    ? 'text-purple-600'
                    : itemToAdd.onSale
                    ? 'text-red-500'
                    : 'text-blue-500') +
                  '">₩' +
                  itemToAdd.val.toLocaleString() +
                  '</span>'
                : '₩' + itemToAdd.val.toLocaleString()
            }</div>
            <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${
              itemToAdd.id
            }">Remove</a>
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
    var tgt = event.target;
    if (
      tgt.classList.contains('quantity-change') ||
      tgt.classList.contains('remove-item')
    ) {
      var prodId = tgt.dataset.productId;
      var itemElem = document.getElementById(prodId);
      var prod = null;
      for (var prdIdx = 0; prdIdx < state.products.length; prdIdx++) {
        if (state.products[prdIdx].id === prodId) {
          prod = state.products[prdIdx];
          break;
        }
      }
      if (tgt.classList.contains('quantity-change')) {
        var qtyChange = parseInt(tgt.dataset.change);
        var qtyElem = itemElem.querySelector('.quantity-number');
        var currentQty = parseInt(qtyElem.textContent);
        var newQty = currentQty + qtyChange;
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
        var qtyElem = itemElem.querySelector('.quantity-number');
        var remQty = parseInt(qtyElem.textContent);
        prod.q += remQty;
        itemElem.remove();
      }
      if (prod && prod.q < 5) {
      }
      handleCalculateCartStuff();
      onUpdateSelectOptions(productSelect, state.products);
    }
  });
}