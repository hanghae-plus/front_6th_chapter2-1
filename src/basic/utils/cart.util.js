import { PRODUCT_STATUS } from '../data/product.data';
import { getProductStatus } from './product.util';

/**
 * 장바구니 아이템들의 총 가격을 계산하는 함수
 * @param {Array} cartItems - 장바구니 아이템 목록
 * @returns {number} 장바구니 아이템들의 총 가격
 */
export function getCartTotalPrice(cartItems) {
  return cartItems.reduce((acc, item) => acc + item.val * item.quantity, 0);
}

/**
 * 장바구니 아이템들의 총 개수를 계산하는 함수
 * @param {Array} cartItems - 장바구니 아이템 목록
 * @returns {number} 장바구니 아이템들의 총 개수
 */
export function getCartTotalCount(cartItems) {
  return cartItems.reduce((acc, item) => acc + item.quantity, 0);
}

export function getProductStatusIcon(product) {
  const icons = {
    [PRODUCT_STATUS.SUPER_SALE]: '⚡💝',
    [PRODUCT_STATUS.LIGHTNING_SALE]: '⚡',
    [PRODUCT_STATUS.SUGGESTION_SALE]: '💝',
    [PRODUCT_STATUS.OUT_OF_STOCK]: '',
    [PRODUCT_STATUS.NORMAL]: '',
  };

  const status = getProductStatus(product);

  return icons[status];
}

export function parseQuantityFromElement(element) {
  if (!element) return 0;
  return parseInt(element.textContent) || 0;
}
