export const createProductOption = (product) => {
  const productOption = document.createElement('option');
  // 옵션의 value = 상품의 id
  productOption.value = product.id;
  let discountText = '';

  if (product.flashSale) discountText += ' ⚡SALE';
  if (product.suggestSale) discountText += ' 💝추천';
  // 품절 상품
  if (product.quantity === 0) {
    productOption.textContent = product.name + ' - ' + product.changedPrice + '원 (품절)' + discountText;
    productOption.disabled = true;
    productOption.className = 'text-gray-400';
  } else {
    if (product.flashSale && product.suggestSale) {
      // 세일 추천 상품
      productOption.textContent =
        '⚡💝' + product.name + ' - ' + product.originalPrice + '원 → ' + product.changedPrice + '원 (25% SUPER SALE!)';
      productOption.className = 'text-purple-600 font-bold';
    } else if (product.flashSale) {
      // 세일 상품
      productOption.textContent =
        '⚡' + product.name + ' - ' + product.originalPrice + '원 → ' + product.changedPrice + '원 (20% SALE!)';
      productOption.className = 'text-red-500 font-bold';
    } else if (product.suggestSale) {
      // 추천 상품
      productOption.textContent =
        '💝' + product.name + ' - ' + product.originalPrice + '원 → ' + product.changedPrice + '원 (5% 추천할인!)';
      productOption.className = 'text-blue-500 font-bold';
    } else {
      // 일반 상품
      productOption.textContent = product.name + ' - ' + product.changedPrice + '원' + discountText;
    }
  }

  return productOption;
};
