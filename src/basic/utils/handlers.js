// utils/handlers.js
import { productList } from './stores.js';

// main.js에서 전달받을 변수들을 위한 참조 저장
let cartDisp = null;
let handleCalculateCartStuff = null;
let onUpdateSelectOptions = null;

// 초기화 함수 - main.js에서 호출
export const initializeHandlers = (cartElement, calculateFn, updateOptionsFn) => {
  cartDisp = cartElement;
  handleCalculateCartStuff = calculateFn;
  onUpdateSelectOptions = updateOptionsFn;
  // lastSel은 객체로 전달받아서 참조 유지
};

export const handleAddToCart = () => {
  const selectedId = document.getElementById('product-select').value;
  const itemToAdd = productList.find((item) => item.id === selectedId);

  if (!selectedId || !itemToAdd) return;
  if (itemToAdd.quantity <= 0) return;

  const item = document.getElementById(itemToAdd.id);

  if (item) {
    const qtyElem = item.querySelector('.quantity-number');
    const newQty = parseInt(qtyElem.textContent) + 1;

    if (newQty <= itemToAdd.quantity + parseInt(qtyElem.textContent)) {
      qtyElem.textContent = newQty;
      itemToAdd.quantity--;
    } else {
      alert('재고가 부족합니다.');
    }
  } else {
    const newItem = document.createElement('div');
    newItem.id = itemToAdd.id;
    newItem.className =
      'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';

    const saleIcon =
      itemToAdd.onSale && itemToAdd.suggestSale
        ? '⚡💝'
        : itemToAdd.onSale
          ? '⚡'
          : itemToAdd.suggestSale
            ? '💝'
            : '';

    const getPriceHTML = () => {
      if (itemToAdd.onSale || itemToAdd.suggestSale) {
        const original = `₩${itemToAdd.originalPrice.toLocaleString()}`;
        const discounted = `₩${itemToAdd.discountedPrice.toLocaleString()}`;
        const color =
          itemToAdd.onSale && itemToAdd.suggestSale
            ? 'text-purple-600'
            : itemToAdd.onSale
              ? 'text-red-500'
              : 'text-blue-500';
        return `<span class="line-through text-gray-400">${original}</span> <span class="${color}">${discounted}</span>`;
      }
      return `₩${itemToAdd.discountedPrice.toLocaleString()}`;
    };

    newItem.innerHTML = `
      <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>
      <div>
        <h3 class="text-base font-normal mb-1 tracking-tight">${saleIcon}${itemToAdd.name}</h3>
        <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p class="text-xs text-black mb-3">${getPriceHTML()}</p>
        <div class="flex items-center gap-4">
          <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="-1">−</button>
          <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
          <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="1">+</button>
        </div>
      </div>
      <div class="text-right">
        <div class="text-lg mb-2 tracking-tight tabular-nums">${getPriceHTML()}</div>
        <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${itemToAdd.id}">Remove</a>
      </div>
    `;

    cartDisp.appendChild(newItem);
    itemToAdd.quantity--;
  }

  handleCalculateCartStuff();
};

export const handleCartDispClick = (event) => {
  const tgt = event.target;
  if (!tgt.classList.contains('quantity-change') && !tgt.classList.contains('remove-item')) return;

  const prodId = tgt.dataset.productId;
  const itemElem = document.getElementById(prodId);
  const prod = productList.find((p) => p.id === prodId);
  if (!prod || !itemElem) return;

  if (tgt.classList.contains('quantity-change')) {
    const qtyChange = parseInt(tgt.dataset.change);
    const qtyElem = itemElem.querySelector('.quantity-number');
    const currentQty = parseInt(qtyElem.textContent);
    const newQty = currentQty + qtyChange;

    if (newQty > 0 && newQty <= prod.quantity + currentQty) {
      qtyElem.textContent = newQty;
      prod.quantity -= qtyChange;
    } else if (newQty <= 0) {
      prod.quantity += currentQty;
      itemElem.remove();
    } else {
      alert('재고가 부족합니다.');
    }
  } else if (tgt.classList.contains('remove-item')) {
    const qtyElem = itemElem.querySelector('.quantity-number');
    const remQty = parseInt(qtyElem.textContent);
    prod.quantity += remQty;
    itemElem.remove();
  }

  handleCalculateCartStuff();
  onUpdateSelectOptions();
};
