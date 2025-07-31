// 상품 셀렉트 옵션 갱신 함수
import { UI_TEXTS } from './constants.js';
import { QUANTITY_THRESHOLDS } from './constants.js';
import { createElement } from './dom.js';

function getOptionText(item) {
  switch (true) {
    case item.quantity === 0:
      return `${item.name} - ${item.discountPrice}원 (${UI_TEXTS.SOLD_OUT})${item.onSale ? ' ⚡SALE' : ''}${item.suggestSale ? ' 💝추천' : ''}`;
    case item.onSale && item.suggestSale:
      return `⚡💝${item.name} - ${item.price}원 → ${item.discountPrice}원 (25% SUPER SALE!)`;
    case item.onSale:
      return `⚡${item.name} - ${item.price}원 → ${item.discountPrice}원 (20% SALE!)`;
    case item.suggestSale:
      return `💝${item.name} - ${item.price}원 → ${item.discountPrice}원 (5% 추천할인!)`;
    default:
      return `${item.name} - ${item.discountPrice}원${item.onSale ? ' ⚡SALE' : ''}${item.suggestSale ? ' 💝추천' : ''}`;
  }
}

function getOptionClass(item) {
  switch (true) {
    case item.quantity === 0:
      return 'text-gray-400';
    case item.onSale && item.suggestSale:
      return 'text-purple-600 font-bold';
    case item.onSale:
      return 'text-red-500 font-bold';
    case item.suggestSale:
      return 'text-blue-500 font-bold';
    default:
      return '';
  }
}

export function updateSelectOptions(sel, products) {
  sel.innerHTML = '';
  let totalStock = 0;
  products.forEach((item) => {
    totalStock += item.quantity;
    const opt = createElement('option');
    opt.value = item.id;
    opt.textContent = getOptionText(item);
    opt.className = getOptionClass(item);
    if (item.quantity === 0) opt.disabled = true;
    sel.appendChild(opt);
  });
  sel.style.borderColor = totalStock < QUANTITY_THRESHOLDS.BULK_PURCHASE ? 'orange' : '';
}
