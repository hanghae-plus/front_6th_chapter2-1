export const ProductSelectItem = (product) => {
  // 품절 상품
  if (product.quantity === 0) {
    return `
      <option value="${product.id}" disabled class="text-gray-400">
        ${product.name} - ${product.price}원 (품절)
      </option>
    `;
  }
  // ⚡ 번개 세일 + 💝 추천 할인
  if (product.onSale && product.suggestSale) {
    return `
      <option value="${product.id}" class="text-purple-600 font-bold">
        ⚡💝 ${product.name} - ${product.originalPrice}원 → ${product.price}원 (25% SUPER SALE!)
      </option>
    `;
  }
  // ⚡ 번개 세일
  if (product.onSale) {
    return `
      <option value="${product.id}" class="text-red-500 font-bold">
        ⚡ ${product.name} - ${product.originalPrice}원 → ${product.price}원 (20% SALE!)
      </option>
    `;
  }
  // 💝 추천 할인
  if (product.suggestSale) {
    return `
      <option value="${product.id}" class="text-blue-500 font-bold">
        💝 ${product.name} - ${product.originalPrice}원 → ${product.price}원 (5% 추천할인!)
      </option>
    `;
  }
  // 기본 상품
  return `
    <option value="${product.id}">
      ${product.name} - ${product.price}원
    </option>
		`;
};
