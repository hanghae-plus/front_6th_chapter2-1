export function createProductOptions(
  selectElement,
  productList,
  stockThresholds
) {
  if (!selectElement) return;

  selectElement.innerHTML = '';

  let totalStock = 0;
  for (let idx = 0; idx < productList.length; idx++) {
    totalStock += productList[idx].q;
  }

  for (let i = 0; i < productList.length; i++) {
    const product = productList[i];
    const opt = document.createElement('option');
    opt.value = product.id;

    let discountText = '';
    if (product.onSale) discountText += ' ⚡SALE';
    if (product.suggestSale) discountText += ' 💝추천';

    if (product.q === 0) {
      opt.textContent = `${product.name} - ${product.val}원 (품절)${discountText}`;
      opt.disabled = true;
      opt.className = 'text-gray-400';
    } else {
      if (product.onSale && product.suggestSale) {
        opt.textContent = `⚡💝${product.name} - ${product.originalVal}원 → ${product.val}원 (25% SUPER SALE!)`;
        opt.className = 'text-purple-600 font-bold';
      } else if (product.onSale) {
        opt.textContent = `⚡${product.name} - ${product.originalVal}원 → ${product.val}원 (20% SALE!)`;
        opt.className = 'text-red-500 font-bold';
      } else if (product.suggestSale) {
        opt.textContent = `💝${product.name} - ${product.originalVal}원 → ${product.val}원 (5% 추천할인!)`;
        opt.className = 'text-blue-500 font-bold';
      } else {
        opt.textContent = `${product.name} - ${product.val}원${discountText}`;
      }
    }

    selectElement.appendChild(opt);
  }

  if (totalStock < stockThresholds.WARNING) {
    selectElement.style.borderColor = 'orange';
  } else {
    selectElement.style.borderColor = '';
  }
}
