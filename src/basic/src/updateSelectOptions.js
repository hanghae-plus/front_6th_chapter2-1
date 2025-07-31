// doRenderBonusPoints 였던것
export function onUpdateSelectOptions({ productList, selectedOption }) {
  let totalStock;
  let discountText;
  selectedOption.innerHTML = '';
  totalStock = 0;
  for (let idx = 0; idx < productList.length; idx++) {
    const _p = productList[idx];
    totalStock = totalStock + _p.q;
  }
  for (let i = 0; i < productList.length; i++) {
    (function () {
      const item = productList[i];
      const opt = document.createElement('option');
      opt.value = item.id;
      discountText = '';
      if (item.onSale) discountText += ' ⚡SALE';
      if (item.suggestSale) discountText += ' 💝추천';
      if (item.q === 0) {
        opt.textContent = item.name + ' - ' + item.val + '원 (품절)' + discountText;
        opt.disabled = true;
        opt.className = 'text-gray-400';
      } else {
        if (item.onSale && item.suggestSale) {
          opt.textContent = '⚡💝' + item.name + ' - ' + item.originalVal + '원 → ' + item.val + '원 (25% SUPER SALE!)';
          opt.className = 'text-purple-600 font-bold';
        } else if (item.onSale) {
          opt.textContent = '⚡' + item.name + ' - ' + item.originalVal + '원 → ' + item.val + '원 (20% SALE!)';
          opt.className = 'text-red-500 font-bold';
        } else if (item.suggestSale) {
          opt.textContent = '💝' + item.name + ' - ' + item.originalVal + '원 → ' + item.val + '원 (5% 추천할인!)';
          opt.className = 'text-blue-500 font-bold';
        } else {
          opt.textContent = item.name + ' - ' + item.val + '원' + discountText;
        }
      }
      selectedOption.appendChild(opt);
    })();
  }
  if (totalStock < 50) {
    selectedOption.style.borderColor = 'orange';
  } else {
    selectedOption.style.borderColor = '';
  }
}
