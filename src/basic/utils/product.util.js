// TODO : enum 타입 사용하기
import { PRODUCT_STATUS } from '../data/product.data';

export const getProductStatus = product => {
  if (product.q === 0) return PRODUCT_STATUS.OUT_OF_STOCK;
  if (product.onSale && product.suggestSale) return PRODUCT_STATUS.SUPER_SALE;
  if (product.onSale) return PRODUCT_STATUS.LIGHTNING_SALE;
  if (product.suggestSale) return PRODUCT_STATUS.SUGGESTION_SALE;
  return PRODUCT_STATUS.NORMAL;
};

export const createProductText = (product, status) => {
  const formatters = {
    [PRODUCT_STATUS.OUT_OF_STOCK]: () => `${product.name} - ${product.val}원 (품절)`,
    [PRODUCT_STATUS.SUPER_SALE]: () =>
      `⚡💝${product.name} - ${product.originalVal}원 → ${product.val}원 (${getSuperSaleRate()}% SUPER SALE!)`,
    [PRODUCT_STATUS.LIGHTNING_SALE]: () =>
      `⚡${product.name} - ${product.originalVal}원 → ${product.val}원 (${DISCOUNT_RATE_LIGHTNING}% SALE!)`,
    [PRODUCT_STATUS.SUGGESTION_SALE]: () =>
      `💝${product.name} - ${product.originalVal}원 → ${product.val}원 (${DISCOUNT_RATE_SUGGESTION}% 추천할인!)`,
    [PRODUCT_STATUS.NORMAL]: () => `${product.name} - ${product.val}원`,
  };

  return formatters[status]();
};

export const getProductStyle = status => {
  const styles = {
    [PRODUCT_STATUS.OUT_OF_STOCK]: 'text-gray-400',
    [PRODUCT_STATUS.SUPER_SALE]: 'text-purple-600 font-bold',
    [PRODUCT_STATUS.LIGHTNING_SALE]: 'text-red-500 font-bold',
    [PRODUCT_STATUS.SUGGESTION_SALE]: 'text-blue-500 font-bold',
    [PRODUCT_STATUS.NORMAL]: '',
  };

  return styles[status];
};

/**
 * 상품 ID로 상품 정보를 찾는 함수
 * @param {string} productId - 상품 ID
 * @param {Array} productList - 상품 목록
 * @returns {Object|null} 상품 정보 또는 null
 */
export function findProductById(productId, productList) {
  return productList.find(product => product.id === productId) || null;
}
