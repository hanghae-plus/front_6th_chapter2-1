/**
 * 재고 관련 유틸 함수들
 * 재고 검증 및 관리 로직
 */

import { productState } from '@/basic/features/product/store/productStore.js';
import { findProductById } from '@/basic/features/product/utils/productUtils.js';
import { setTextContent } from '@/basic/shared/core/domUtils.js';

export const stockValidators = {
  /**
   * 재고 부족 여부 확인
   * @param {number} currentQuantity - 현재 수량
   * @param {number} newQuantity - 새 수량
   * @param {number} availableStock - 사용 가능한 재고
   * @returns {boolean} 재고 부족 여부
   */
  isInsufficientStock: (currentQuantity, newQuantity, availableStock) => {
    return newQuantity > currentQuantity + availableStock;
  },

  /**
   * 품절 여부 확인
   * @param {number} stock - 재고 수량
   * @returns {boolean} 품절 여부
   */
  isOutOfStock: stock => stock <= 0,

  /**
   * 수량 증가 가능 여부 확인
   * @param {number} change - 변경 수량
   * @param {number} availableStock - 사용 가능한 재고
   * @returns {boolean} 증가 가능 여부
   */
  canIncreaseQuantity: (change, availableStock) => {
    return change <= 0 || availableStock >= change;
  },

  /**
   * 사용 가능한 재고가 있는지 확인
   * @param {string} productId - 상품 ID
   * @param {number} price - 상품 가격 (사용하지 않음)
   * @returns {boolean} 재고 사용 가능 여부
   */
  hasAvailableStock: (productId, price) => {
    const product = findProductById(productId, productState.products);
    return product && product.q > 0;
  },
};

// 수량 관리 함수들
export const quantityManagers = {
  /**
   * 수량 요소에서 현재 수량 추출
   * @param {HTMLElement} quantityElement - 수량 요소
   * @returns {number} 현재 수량
   */
  getCurrentQuantity: quantityElement => {
    return parseInt(quantityElement.textContent, 10);
  },

  /**
   * 수량 요소 업데이트
   * @param {HTMLElement} quantityElement - 수량 요소
   * @param {number} newQuantity - 새 수량
   */
  updateQuantityDisplay: (quantityElement, newQuantity) => {
    setTextContent(quantityElement, newQuantity);
  },

  /**
   * 새 수량 계산
   * @param {number} currentQuantity - 현재 수량
   * @param {number} change - 변경 수량
   * @returns {number} 새 수량
   */
  calculateNewQuantity: (currentQuantity, change) => {
    return currentQuantity + change;
  },

  /**
   * 아이템 수량 업데이트 (DOM 요소)
   * @param {HTMLElement} itemElement - 아이템 요소
   * @param {number} change - 수량 변경값
   */
  updateItemQuantity: (itemElement, change) => {
    const quantitySpan = itemElement.querySelector('.quantity-number');
    if (quantitySpan) {
      const currentQuantity = parseInt(quantitySpan.textContent || '0');
      const newQuantity = Math.max(0, currentQuantity + change);
      quantitySpan.textContent = newQuantity;

      // 수량이 0이 되면 아이템 제거
      if (newQuantity === 0) {
        itemElement.remove();
      }
    }
  },
};

// 재고 관리 함수들
export const stockManagers = {
  /**
   * 재고 감소
   * @param {object} product - 상품 정보
   * @param {number} amount - 감소할 수량
   */
  decreaseStock: (product, amount = 1) => {
    product.q -= amount;
  },

  /**
   * 재고 증가
   * @param {object} product - 상품 정보
   * @param {number} amount - 증가할 수량
   */
  increaseStock: (product, amount) => {
    product.q += amount;
  },

  /**
   * 재고 업데이트 (상품 ID로)
   * @param {string} productId - 상품 ID
   * @param {number} amount - 변경할 수량 (음수면 감소, 양수면 증가)
   */
  updateStock: (productId, amount) => {
    const product = findProductById(productId, productState.products);
    if (product) {
      product.q = Math.max(0, product.q + amount);
    }
  },
};
