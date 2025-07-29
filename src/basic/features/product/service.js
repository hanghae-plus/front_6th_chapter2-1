/**
 * @description 상품 재고 총합 계산
 * @param {{
 *  id: string;
 *  name: string;
 *  value: number;
 *  originalValue: number;
 *  quantity: number;
 *  onSale: boolean;
 *  suggestSale: boolean;
 * }[]} products - 상품 목록
 * @returns {number} 총 재고 수량
 */
export const getTotalStock = (products) => {
  return products.reduce((acc, product) => acc + product.quantity, 0);
};

/**
 * @todo `할인상태`와 `재고상태`가 함께 있음 → 분리 고려
 * @description 상품 판매 상태에 따라 판매 문구 반환
 * @param {{
 *  id: string;
 *  name: string;
 *  value: number;
 *  originalValue: number;
 *  quantity: number;
 *  onSale: boolean;
 *  suggestSale: boolean;
 * }} product - 상품
 * @returns {string} 상품판매 정보 텍스트 (이름 - 가격 - 할인정보)
 */
export const getSalesInfoText = (product) => {
  // 번개세일 && 추천할인
  if (product.onSale && product.suggestSale) {
    return `⚡💝${product.name} - ${product.originalValue}원 → ${product.value}원 (25% SUPER SALE!)`;
  }
  // 번개세일
  if (product.onSale) {
    return `⚡${product.name} - ${product.originalValue}원 → ${product.value}원 (20% SALE!)`;
  }
  // 추천할인
  if (product.suggestSale) {
    return `💝${product.name} - ${product.originalValue}원 → ${product.value}원 (5% 추천할인!)`;
  }
  // 품절
  if (product.quantity === 0) {
    return `${product.name} - ${product.value}원 (품절)`;
  }

  return `${product.name} - ${product.value}원`;
};

/**
 * @todo `getSalesInfoText` 함수와 분기 로직 중복되므로 개선 고려
 * @description 상품 판매 상태에 따라 `<option>` 요소에 적용할 CSS 반환
 * @param {{
 *  id: string;
 *  name: string;
 *  value: number;
 *  originalValue: number;
 *  quantity: number;
 *  onSale: boolean;
 *  suggestSale: boolean;
 * }} product - 상품
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
