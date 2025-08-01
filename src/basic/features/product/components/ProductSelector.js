/**
 * 상품 옵션 HTML 구조 생성
 * @param {Object} item - 상품 데이터
 * @returns {HTMLElement} option 요소
 */
export function ProductOption(item) {
  const opt = document.createElement('option');
  opt.value = item.id;

  let discountText = '';
  if (item.isOnSale) discountText += ' ⚡SALE';
  if (item.isSuggestedSale) discountText += ' 💝추천';

  // Guard clause: 품절 상품
  if (item.stock === 0) {
    opt.textContent =
      item.name + ' - ' + item.price + '원 (품절)' + discountText;
    opt.disabled = true;
    opt.className = 'text-gray-400';
    return opt;
  }

  // 번개세일 + 추천할인
  if (item.isOnSale && item.isSuggestedSale) {
    opt.textContent =
      '⚡💝' +
      item.name +
      ' - ' +
      item.originalPrice +
      '원 → ' +
      item.price +
      '원' +
      discountText;
    opt.className = 'text-red-600 font-bold';
    return opt;
  }

  // 번개세일만
  if (item.isOnSale) {
    opt.textContent =
      '⚡' +
      item.name +
      ' - ' +
      item.originalPrice +
      '원 → ' +
      item.price +
      '원' +
      discountText;
    opt.className = 'text-red-600 font-bold';
    return opt;
  }

  // 추천할인만
  if (item.isSuggestedSale) {
    opt.textContent =
      '💝' +
      item.name +
      ' - ' +
      item.originalPrice +
      '원 → ' +
      item.price +
      '원' +
      discountText;
    opt.className = 'text-blue-600 font-bold';
    return opt;
  }

  // 일반 상품
  opt.textContent = item.name + ' - ' + item.price + '원' + discountText;
  return opt;
}
