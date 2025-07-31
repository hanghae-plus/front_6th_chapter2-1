// 상품 셀렉트 옵션 갱신 함수
import { formatPrice } from '../utils/format.js';
import { UI_TEXTS } from './constants.js';
import { QUANTITY_THRESHOLDS } from './constants.js';
import { createElement } from './dom.js';

function getOptionText(item) {
  switch (true) {
    case item.quantity === 0:
      return `${item.name} - ${formatPrice(item.discountPrice)} (${UI_TEXTS.SOLD_OUT})${item.onSale ? ' ⚡SALE' : ''}${item.suggestSale ? ' 💝추천' : ''}`;
    case item.onSale && item.suggestSale:
      return `⚡💝${item.name} - ${formatPrice(item.price)} → ${formatPrice(item.discountPrice)} (25% SUPER SALE!)`;
    case item.onSale:
      return `⚡${item.name} - ${formatPrice(item.price)} → ${formatPrice(item.discountPrice)} (20% SALE!)`;
    case item.suggestSale:
      return `💝${item.name} - ${formatPrice(item.price)} → ${formatPrice(item.discountPrice)} (5% 추천할인!)`;
    default:
      return `${item.name} - ${formatPrice(item.discountPrice)}${item.onSale ? ' ⚡SALE' : ''}${item.suggestSale ? ' 💝추천' : ''}`;
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
