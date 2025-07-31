export class EventHandlers {
  constructor(context) {
    this.context = context;
    this.initializeHandlers();
  }

  initializeHandlers() {
    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.handleCartClick = this.handleCartClick.bind(this);
    this.handleManualToggle = this.handleManualToggle.bind(this);
    this.handleManualOverlayClick = this.handleManualOverlayClick.bind(this);
  }

  setupEventListeners() {
    const { addBtn, cartDisplay, manualToggle, manualOverlay } = this.context;
    addBtn.addEventListener('click', this.handleAddToCart);
    cartDisplay.addEventListener('click', this.handleCartClick);
    manualToggle.addEventListener('click', this.handleManualToggle);
    manualOverlay.addEventListener('click', this.handleManualOverlayClick);
  }

  handleAddToCart() {
    const { sel, productList, cartDisplay, handleCalculateCartStuff, setLastSel } = this.context;
    const selItem = sel.value;
    let hasItem = false;
    for (let idx = 0; idx < productList.length; idx++) {
      if (productList[idx].id === selItem) {
        hasItem = true;
        break;
      }
    }
    if (!selItem || !hasItem) {
      return;
    }
    let itemToAdd = null;
    for (let j = 0; j < productList.length; j++) {
      if (productList[j].id === selItem) {
        itemToAdd = productList[j];
        break;
      }
    }
    if (itemToAdd && itemToAdd.q > 0) {
      const item = document.getElementById(itemToAdd['id']);
      if (item) {
        const qtyElem = item.querySelector('.quantity-number');
        const newQty = parseInt(qtyElem['textContent']) + 1;
        if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
          qtyElem.textContent = newQty;
          itemToAdd['q']--;
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
        cartDisplay.appendChild(newItem);
        itemToAdd.q--;
      }

      handleCalculateCartStuff();
      setLastSel(selItem);
    }
  }

  handleCartClick(event) {
    const { productList, handleCalculateCartStuff, handleUpdateSelectOptions } = this.context;

    const tgt = event.target;
    if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
      const prodId = tgt.dataset.productId;
      const itemElem = document.getElementById(prodId);
      let prod = null;
      for (let prdIdx = 0; prdIdx < productList.length; prdIdx++) {
        if (productList[prdIdx].id === prodId) {
          prod = productList[prdIdx];
          break;
        }
      }
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
      handleUpdateSelectOptions();
    }
  }

  handleManualToggle() {
    const { manualOverlay, manualColumn } = this.context;
    manualOverlay.classList.toggle('hidden');
    manualColumn.classList.toggle('translate-x-full');
  }

  handleManualOverlayClick() {
    const { manualOverlay, manualColumn } = this.context;
    manualOverlay.classList.add('hidden');
    manualColumn.classList.add('translate-x-full');
  }
}
