export const createProductOption = ({ item }) => {
  const productOption = document.createElement('option');
  // 옵션의 value = 상품의 id
  productOption.value = item.id;
  let discountText = '';

  if (item.onSale) discountText += ' ⚡SALE';
  if (item.suggestSale) discountText += ' 💝추천';
  // 품절 상품
  if (item.quantity === 0) {
    productOption.textContent = item.name + ' - ' + item.changedPrice + '원 (품절)' + discountText;
    productOption.disabled = true;
    productOption.className = 'text-gray-400';
  } else {
    if (item.onSale && item.suggestSale) {
      // 세일 추천 상품
      productOption.textContent =
        '⚡💝' + item.name + ' - ' + item.originalPrice + '원 → ' + item.changedPrice + '원 (25% SUPER SALE!)';
      productOption.className = 'text-purple-600 font-bold';
    } else if (item.onSale) {
      // 세일 상품
      productOption.textContent =
        '⚡' + item.name + ' - ' + item.originalPrice + '원 → ' + item.changedPrice + '원 (20% SALE!)';
      productOption.className = 'text-red-500 font-bold';
    } else if (item.suggestSale) {
      // 추천 상품
      productOption.textContent =
        '💝' + item.name + ' - ' + item.originalPrice + '원 → ' + item.changedPrice + '원 (5% 추천할인!)';
      productOption.className = 'text-blue-500 font-bold';
    } else {
      // 일반 상품
      productOption.textContent = item.name + ' - ' + item.changedPrice + '원' + discountText;
    }
  }

  return productOption;
};
