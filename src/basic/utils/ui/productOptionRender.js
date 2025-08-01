import { productSelect } from '../../main.basic';
import { getTotalStock } from '../productUtils';
import { productList } from '../stores';
export function onUpdateSelectOptions() {
  productSelect.innerHTML = '';
  const totalStock = getTotalStock();
  const optionElements = productList.map(createProductOption);
  appendOptionsToSelect(optionElements);
  updateSelectBorderColor(totalStock);
}

function createProductOption(item) {
  const opt = document.createElement('option');
  opt.value = item.id;

  const discountText = (item.onSale ? ' ⚡SALE' : '') + (item.suggestSale ? ' 💝추천' : '');

  if (item.quantity === 0) {
    opt.textContent = `${item.name} - ${item.discountedPrice}원 (품절)` + discountText;
    opt.disabled = true;
    opt.className = 'text-gray-400';
  } else if (item.onSale && item.suggestSale) {
    opt.textContent = `⚡💝${item.name} - ${item.originalPrice}원 → ${item.discountedPrice}원 (25% SUPER SALE!)`;
    opt.className = 'text-purple-600 font-bold';
  } else if (item.onSale) {
    opt.textContent = `⚡${item.name} - ${item.originalPrice}원 → ${item.discountedPrice}원 (20% SALE!)`;
    opt.className = 'text-red-500 font-bold';
  } else if (item.suggestSale) {
    opt.textContent = `💝${item.name} - ${item.originalPrice}원 → ${item.discountedPrice}원 (5% 추천할인!)`;
    opt.className = 'text-blue-500 font-bold';
  } else {
    opt.textContent = `${item.name} - ${item.discountedPrice}원` + discountText;
  }

  return opt;
}

function appendOptionsToSelect(optionElements) {
  optionElements.forEach((opt) => productSelect.appendChild(opt));
}

// 12. 셀렉트 박스의 테두리 색상 업데이트
function updateSelectBorderColor(totalStock) {
  productSelect.style.borderColor = totalStock < 50 ? 'orange' : '';
}
