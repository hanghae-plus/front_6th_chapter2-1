/**
 * 장바구니 UI 서비스
 * UI 업데이트 관련 로직
 */

import { setStyle } from '../../../shared/core/domUtils.js';

/**
 * 할인 가능 아이템 하이라이트 (선언적)
 * @param {Array} cartItems - 카트 아이템들
 * @param {Array} products - 상품 목록
 * @param {object} constants - 비즈니스 상수
 */
export const highlightDiscountableItems = (cartItems, products, constants) => {
  cartItems.forEach(cartItem => {
    const product = products.find(p => p.id === cartItem.id);
    if (!product) return;

    const quantityElement = cartItem.querySelector('.quantity-number');
    const quantity = parseInt(quantityElement?.textContent || '0');
    const priceElements = cartItem.querySelectorAll('.text-lg, .text-xs');

    priceElements.forEach(elem => {
      if (elem.classList.contains('text-lg')) {
        const fontWeight =
          quantity >= constants.DISCOUNT.ITEM_DISCOUNT_MIN_QUANTITY
            ? 'bold'
            : 'normal';
        setStyle(elem, 'fontWeight', fontWeight);
      }
    });
  });
};
