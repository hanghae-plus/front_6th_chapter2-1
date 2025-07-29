/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {number} value
 * @property {number} originalValue
 * @property {number} quantity
 * @property {boolean} onSale
 * @property {boolean} suggestSale
 */

/**
 * @description 상품 재고 총합 계산
 * @param {Product[]} products - 상품 목록
 * @returns {number} 총 재고 수량
 */
export const getTotalStock = (products) => {
  return products.reduce((acc, product) => acc + product.quantity, 0);
};

/**
 * @description 상품 판매 상태에 따라 판매 문구 반환
 * @param {Product} product - 상품
 * @returns {string} 상품판매 정보 텍스트 (이름 - 가격 - 할인정보)
 */
export const getSalesInfoText = (product) => {
  const status = getSaleStatus(product);

  switch (status) {
    case 'SUPER':
      return `⚡💝${product.name} - ${product.originalValue}원 → ${product.value}원 (25% SUPER SALE!)`;
    case 'SALE':
      return `⚡${product.name} - ${product.originalValue}원 → ${product.value}원 (20% SALE!)`;
    case 'SUGGEST':
      return `💝${product.name} - ${product.originalValue}원 → ${product.value}원 (5% 추천할인!)`;
    case 'OUT_OF_STOCK':
      return `${product.name} - ${product.value}원 (품절)`;
    case 'NORMAL':
    default:
      return `${product.name} - ${product.value}원`;
  }
};

/**
 * @todo `getSalesInfoText` 함수와 분기 로직 중복되므로 개선 고려
 * @description 상품 판매 상태에 따라 `<option>` 요소에 적용할 CSS 반환
 * @param {Product} product - 상품
 * @returns {string} tailwind CSS 클래스명
 */
export const getProductOptionStyle = (product) => {
  // 번개세일 && 추천할인
  if (product.onSale && product.suggestSale) {
    return 'text-purple-600 font-bold';
  }
  // 번개세일
  if (product.onSale) {
    return 'text-red-500 font-bold';
  }
  // 추천할인
  if (product.suggestSale) {
    return 'text-blue-500 font-bold';
  }
  // 품절
  if (product.quantity === 0) {
    return 'text-gray-400';
  }

  return '';
};

/**
 * @description 상품의 재고 유무 반환
 * @param {Product} product - 상품
 * @returns {boolean} 상품 재고 유무
 */
export const isOutOfStock = (product) => {
  return product.quantity === 0;
};

/**
 * @description 상품 판매 상태 반환
 * @param {Product} product - 상품
 * @returns {'OUT_OF_STOCK' | 'SUPER' | 'SALE' | 'SUGGEST' | 'NORMAL'} 상품판매 상태
 */
export const getSaleStatus = (product) => {
  // 품절
  if (product.quantity === 0) {
    return 'OUT_OF_STOCK';
  }
  // 번개세일 && 추천할인
  if (product.onSale && product.suggestSale) {
    return 'SUPER';
  }
  // 번개세일
  if (product.onSale) {
    return 'SALE';
  }
  // 추천할인
  if (product.suggestSale) {
    return 'SUGGEST';
  }

  return 'NORMAL';
};
