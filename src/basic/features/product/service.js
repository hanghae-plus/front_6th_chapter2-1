/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {number} value
 * @property {number} originalValue
 * @property {number} quantity
 * @property {boolean} onSale
 * @property {boolean} suggestSale
 * @property {string} type
 */

/**
 * @typedef {'SUPER' | 'SALE' | 'SUGGEST' | 'NO_SALE'} SaleStatus
 */

/**
 * @description 상품 재고 총합 계산
 *
 * @param {Product[]} products - 상품 목록
 * @returns {number} 총 재고 수량
 */
export const getTotalStock = (products) => {
  return products.reduce((acc, product) => acc + product.quantity, 0);
};

/**
 * @description 상품의 재고 유무 반환
 *
 * @param {Product} product - 상품
 * @returns {boolean} 상품 재고 유무
 */
export const isOutOfStock = (product) => {
  return product.quantity === 0;
};

/**
 * @description 상품 재고 정보 반환
 *
 * @param {Product} product - 상품
 * @returns {string} 상품 재고 정보
 */
export const getStockInfo = (product) => {
  if (product.quantity < 1) {
    return `${product.name}: 품절`;
  }

  if (product.quantity < 5) {
    return `${product.name}: 재고 부족 (${product.quantity}개 남음)`;
  }

  return '';
};

/**
 * @description 상품 할인 상태 반환
 *
 * @param {Product} product - 상품
 * @returns {SaleStatus} 상품 할인 상태
 */
export const getDiscountStatus = (product) => {
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

  return 'NO_SALE';
};

/**
 * @description 상품 할인율
 *
 * @param {Product} product - 상품
 * @return {number} 상품 할인율
 */
export const getDiscountRate = (product) => {
  const rules = {
    keyboard: 0.1,
    mouse: 0.15,
    monitorArm: 0.2,
    pouch: 0.05,
    speaker: 0.25,
  };

  return rules[product.type] ?? 0;
};

/**
 * @description 상품 판매 상태에 따라 판매 문구 반환
 *
 * @param {Product} product - 상품
 * @returns {string} 상품판매 정보 텍스트 (이름 - 가격 - 할인정보)
 */
export const getSalesInfoText = (product) => {
  if (isOutOfStock(product)) {
    return `${product.name} - ${product.value}원 (품절)`;
  }

  const status = getDiscountStatus(product);

  switch (status) {
    case 'SUPER':
      return `⚡💝${product.name} - ${product.originalValue}원 → ${product.value}원 (25% SUPER SALE!)`;
    case 'SALE':
      return `⚡${product.name} - ${product.originalValue}원 → ${product.value}원 (20% SALE!)`;
    case 'SUGGEST':
      return `💝${product.name} - ${product.originalValue}원 → ${product.value}원 (5% 추천할인!)`;
    case 'NO_SALE':
    default:
      return `${product.name} - ${product.value}원`;
  }
};

/**
 * @description 상품 판매 상태에 따라 `<option>` 요소에 적용할 CSS 반환
 *
 * @param {Product} product - 상품
 * @returns {string} tailwind CSS 클래스명
 */
export const getProductOptionStyle = (product) => {
  if (isOutOfStock(product)) {
    return 'text-gray-400';
  }

  const status = getDiscountStatus(product);

  switch (status) {
    case 'SUPER':
      return 'text-purple-600 font-bold';
    case 'SALE':
      return 'text-red-500 font-bold';
    case 'SUGGEST':
      return 'text-blue-500 font-bold';
    case 'NO_SALE':
    default:
      return '';
  }
};
