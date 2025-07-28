export function createCartDisplay() {
  const cartDisplay = document.createElement('div');
  cartDisplay.id = 'cart-items';
  return cartDisplay;
}

export function createCartItem(product, quantity) {
  const itemContainer = document.createElement('div');
  itemContainer.className =
    'flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0';

  const itemInfo = document.createElement('div');
  itemInfo.className = 'flex-1';

  const itemName = document.createElement('div');
  itemName.className = 'text-lg font-medium';
  itemName.textContent = product.name;

  const itemPrice = document.createElement('div');
  itemPrice.className = 'text-sm text-gray-600';
  itemPrice.textContent = `₩${product.val.toLocaleString()}`;

  itemInfo.appendChild(itemName);
  itemInfo.appendChild(itemPrice);

  const quantityContainer = document.createElement('div');
  quantityContainer.className = 'flex items-center gap-2';

  const decreaseBtn = document.createElement('button');
  decreaseBtn.className =
    'w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors';
  decreaseBtn.innerHTML = '<span class="text-sm">-</span>';

  const quantityNumber = document.createElement('span');
  quantityNumber.className =
    'quantity-number text-lg font-medium w-8 text-center';
  quantityNumber.textContent = quantity;

  const increaseBtn = document.createElement('button');
  increaseBtn.className =
    'w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors';
  increaseBtn.innerHTML = '<span class="text-sm">+</span>';

  quantityContainer.appendChild(decreaseBtn);
  quantityContainer.appendChild(quantityNumber);
  quantityContainer.appendChild(increaseBtn);

  itemContainer.appendChild(itemInfo);
  itemContainer.appendChild(quantityContainer);

  return itemContainer;
}

export function createCartItemElement(product) {
  const newItem = document.createElement('div');
  newItem.id = product.id;
  newItem.className =
    'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';

  const saleIcon =
    product.onSale && product.suggestSale
      ? '⚡💝'
      : product.onSale
        ? '⚡'
        : product.suggestSale
          ? '💝'
          : '';

  const priceClass =
    product.onSale && product.suggestSale
      ? 'text-purple-600'
      : product.onSale
        ? 'text-red-500'
        : product.suggestSale
          ? 'text-blue-500'
          : '';

  const priceDisplay =
    product.onSale || product.suggestSale
      ? `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="${priceClass}">₩${product.val.toLocaleString()}</span>`
      : `₩${product.val.toLocaleString()}`;

  newItem.innerHTML = `
    <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
      <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
    </div>
    <div>
      <h3 class="text-base font-normal mb-1 tracking-tight">${saleIcon}${product.name}</h3>
      <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
      <p class="text-xs text-black mb-3">${priceDisplay}</p>
      <div class="flex items-center gap-4">
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="-1">−</button>
        <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="1">+</button>
      </div>
    </div>
    <div class="text-right">
      <div class="text-lg mb-2 tracking-tight tabular-nums">${priceDisplay}</div>
      <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${product.id}">Remove</a>
    </div>
  `;

  return newItem;
}

export function setupCartEventListeners(
  cartDisp,
  {
    findProductById,
    getQuantityFromElement,
    handleCalculateCartStuff,
    onUpdateSelectOptions,
  }
) {
  cartDisp.addEventListener('click', function (event) {
    const tgt = event.target;
    if (
      tgt.classList.contains('quantity-change') ||
      tgt.classList.contains('remove-item')
    ) {
      const prodId = tgt.dataset.productId;
      const itemElem = document.getElementById(prodId);
      const prod = findProductById(prodId);

      if (tgt.classList.contains('quantity-change')) {
        const qtyChange = parseInt(tgt.dataset.change);
        const qtyElem = itemElem.querySelector('.quantity-number');
        const currentQty = getQuantityFromElement(qtyElem);
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
        const remQty = getQuantityFromElement(qtyElem);
        prod.q += remQty;
        itemElem.remove();
      }

      handleCalculateCartStuff();
      onUpdateSelectOptions();
    }
  });
}
