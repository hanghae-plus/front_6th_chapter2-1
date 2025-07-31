/**
 * 카트 아이템의 가격과 이름을 렌더링하는 함수
 * @param {Object} product - 상품 정보
 * @returns {Object} 렌더링된 HTML과 텍스트
 */
export const renderCartItemPrice = (product) => {
  const { name, val, originalVal, onSale, suggestSale } = product;

  let priceHTML = "";
  let displayName = name;

  // 할인 상태에 따른 가격 렌더링
  if (onSale && suggestSale) {
    priceHTML = /* HTML */ `
      <span class="line-through text-gray-400"
        >₩${originalVal.toLocaleString()}</span
      >
      <span class="text-purple-600">₩${val.toLocaleString()}</span>
    `;
    displayName = "⚡💝" + name;
    return { priceHTML, displayName };
  }

  // 번개할인 상태에 따른 가격 렌더링
  if (onSale) {
    priceHTML = /* HTML */ `
      <span class="line-through text-gray-400"
        >₩${originalVal.toLocaleString()}</span
      >
      <span class="text-red-500">₩${val.toLocaleString()}</span>
    `;
    displayName = "⚡" + name;
    return { priceHTML, displayName };
  }

  // 추천할인 상태에 따른 가격 렌더링
  if (suggestSale) {
    priceHTML = /* HTML */ `
      <span class="line-through text-gray-400"
        >₩${originalVal.toLocaleString()}</span
      >
      <span class="text-blue-500">₩${val.toLocaleString()}</span>
    `;
    displayName = "💝" + name;
    return { priceHTML, displayName };
  }

  // 할인 상태가 아닌 경우 가격 렌더링
  priceHTML = /* HTML */ `₩${val.toLocaleString()}`;
  displayName = name;

  return {
    priceHTML,
    displayName,
  };
};
