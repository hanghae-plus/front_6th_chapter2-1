/**
 *
 * @param {{{
 *  id: string;
 *  name: string;
 *  value: number;
 *  originalVal: number;
 *  quantity: number;
 *  onSale: boolean;
 *  suggestSale: boolean;
 *  }}} product
 * @returns
 */
const Option = ({ product }) => {
  const $option = document.createElement('option');

  $option.value = product.id;

  let discountText = '';

  if (product.onSale) discountText += ' ⚡SALE';
  if (product.suggestSale) discountText += ' 💝추천';

  if (product.quantity === 0) {
    $option.className = 'text-gray-400';
    $option.disabled = true;
    $option.textContent = `${product.name} - ${product.value}원 (품절)${discountText}`;
    return $option;
  }

  if (product.onSale && product.suggestSale) {
    $option.className = 'text-purple-600 font-bold';
    $option.textContent = `⚡💝${product.name} - ${product.originalVal}원 → ${product.value}원 (25% SUPER SALE!)`;
    return $option;
  }

  if (product.onSale) {
    $option.className = 'text-red-500 font-bold';
    $option.textContent = `⚡${product.name} - ${product.originalVal}원 → ${product.value}원 (20% SALE!)`;
    return $option;
  }

  if (product.suggestSale) {
    $option.className = 'text-blue-500 font-bold';
    $option.textContent = `💝${product.name} - ${product.originalVal}원 → ${product.value}원 (5% 추천할인!)`;
    return $option;
  }

  $option.textContent = `${product.name} - ${product.value}원${discountText}`;
  return $option;
};

export default Option;
