/**
 * @fileoverview CartDisplay 컨테이너 컴포넌트
 * 전체 장바구니 디스플레이를 렌더링하는 순수 함수 기반 컴포넌트
 *
 * 여러 CartItem을 조합하여 전체 장바구니 UI를 구성하고
 * 빈 장바구니 상태를 처리하는 컨테이너 역할
 */

import { CartItem } from './CartItem.js';

/**
 * @typedef {Object} CartDisplayOptions
 * @property {string} [emptyMessage='장바구니가 비어있습니다'] - 빈 장바구니 메시지
 * @property {string} [className] - 추가 CSS 클래스
 * @property {boolean} [showDiscounts=true] - 할인 정보 표시 여부
 * @property {boolean} [allowQuantityChange=true] - 수량 변경 허용 여부
 * @property {function} [onQuantityChange] - 수량 변경 이벤트 핸들러
 * @property {function} [onRemove] - 제거 이벤트 핸들러
 */

/**
 * @typedef {Object} CartItemData
 * @property {Product} product - 상품 정보
 * @property {number} quantity - 수량
 * @property {Object} [discounts] - 할인 정보
 * @property {number} subtotal - 소계
 * @property {number} stock - 현재 재고
 */

/**
 * 전체 장바구니 디스플레이 컨테이너 컴포넌트
 * 여러 CartItem을 조합하고 빈 상태를 관리하는 순수 함수 기반 클래스
 */
export class CartDisplay {
  /**
   * 전체 장바구니를 렌더링
   * @param {Array<CartItemData>} cartItems - 장바구니 아이템 배열
   * @param {CartDisplayOptions} [options={}] - 렌더링 옵션
   * @returns {string} 완성된 장바구니 디스플레이 HTML 문자열
   */
  static render(cartItems, options = {}) {
    // 기본 옵션 설정
    const {
      emptyMessage = '장바구니가 비어있습니다',
      className = '',
      showDiscounts = true,
      allowQuantityChange = true,
      onQuantityChange,
      onRemove
    } = options;

    // 데이터 유효성 검사
    if (!Array.isArray(cartItems)) {
      throw new Error('CartDisplay.render: cartItems는 배열이어야 합니다.');
    }

    // 빈 장바구니 처리
    if (cartItems.length === 0) {
      return CartDisplay.generateEmptyState(emptyMessage, className);
    }

    // 각 아이템을 CartItem으로 렌더링
    const itemsHTML = cartItems
      .map(item => {
        return CartItem.render(item, {
          showDiscounts,
          allowQuantityChange,
          onQuantityChange,
          onRemove
        });
      })
      .join('');

    // 컨테이너로 감싸서 반환
    return CartDisplay.generateContainer(itemsHTML, className);
  }

  /**
   * 빈 장바구니 상태를 생성
   * @param {string} [message='장바구니가 비어있습니다'] - 빈 장바구니 메시지
   * @param {string} [className=''] - 추가 CSS 클래스
   * @returns {string} 빈 장바구니 HTML
   */
  static generateEmptyState(
    message = '장바구니가 비어있습니다',
    className = ''
  ) {
    const containerClasses = [
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'py-12',
      'text-center',
      className
    ]
      .filter(Boolean)
      .join(' ');

    return `
      <div class="${containerClasses}">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5-5M7 13l-2.5 5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">장바구니가 비어있습니다</h3>
        <p class="text-sm text-gray-500 mb-6">${message}</p>
        <div class="text-xs text-gray-400">
          상품을 선택하여 장바구니에 추가해보세요
        </div>
      </div>
    `;
  }

  /**
   * 장바구니 아이템들을 컨테이너로 감싸기
   * @param {string} itemsHTML - 아이템들의 HTML 문자열
   * @param {string} [className=''] - 추가 CSS 클래스
   * @returns {string} 컨테이너로 감싸진 HTML
   */
  static generateContainer(itemsHTML, className = '') {
    const containerClasses = ['cart-display-container', className]
      .filter(Boolean)
      .join(' ');

    return `
      <div class="${containerClasses}">
        ${itemsHTML}
      </div>
    `;
  }

  /**
   * DOM에서 장바구니 데이터를 추출하여 CartDisplay 형식으로 변환
   * @param {HTMLElement} cartContainer - 장바구니 컨테이너 DOM 요소
   * @param {Array} productList - 상품 목록
   * @returns {Array<CartItemData>} CartDisplay용 데이터 배열
   */
  static extractCartItemsFromDOM(cartContainer, productList) {
    if (!cartContainer || !cartContainer.children) {
      return [];
    }

    const cartItems = [];
    const domItems = cartContainer.children;

    for (let i = 0; i < domItems.length; i++) {
      const domItem = domItems[i];
      const productId = domItem.id;

      // 상품 정보 찾기
      const product = productList.find(p => p.id === productId);
      if (!product) continue;

      // 수량 추출
      const quantityElement = domItem.querySelector('.quantity-number');
      const quantity = quantityElement
        ? parseInt(quantityElement.textContent)
        : 1;

      // CartItemData 형식으로 변환
      cartItems.push({
        product: product,
        quantity: quantity,
        discounts: {},
        subtotal: product.val * quantity,
        stock: product.q
      });
    }

    return cartItems;
  }

  /**
   * 장바구니 아이템 수와 총 수량을 계산
   * @param {Array<CartItemData>} cartItems - 장바구니 아이템 배열
   * @returns {Object} 아이템 수와 총 수량 정보
   */
  static calculateCartSummary(cartItems) {
    if (!Array.isArray(cartItems)) {
      return { itemCount: 0, totalQuantity: 0 };
    }

    const itemCount = cartItems.length;
    const totalQuantity = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );

    return {
      itemCount,
      totalQuantity
    };
  }

  /**
   * 장바구니 아이템들을 상품 ID로 그룹화
   * @param {Array<CartItemData>} cartItems - 장바구니 아이템 배열
   * @returns {Object} 상품 ID별로 그룹화된 객체
   */
  static groupItemsByProductId(cartItems) {
    if (!Array.isArray(cartItems)) {
      return {};
    }

    return cartItems.reduce((groups, item) => {
      const productId = item.product.id;
      if (!groups[productId]) {
        groups[productId] = [];
      }
      groups[productId].push(item);
      return groups;
    }, {});
  }

  /**
   * 장바구니에서 특정 상품 아이템 찾기
   * @param {Array<CartItemData>} cartItems - 장바구니 아이템 배열
   * @param {string} productId - 찾을 상품 ID
   * @returns {CartItemData|null} 찾은 아이템 또는 null
   */
  static findItemByProductId(cartItems, productId) {
    if (!Array.isArray(cartItems)) {
      return null;
    }

    return cartItems.find(item => item.product.id === productId) || null;
  }

  /**
   * 장바구니 아이템 배열에서 특정 상품 제거
   * @param {Array<CartItemData>} cartItems - 장바구니 아이템 배열
   * @param {string} productId - 제거할 상품 ID
   * @returns {Array<CartItemData>} 제거된 후의 아이템 배열
   */
  static removeItemByProductId(cartItems, productId) {
    if (!Array.isArray(cartItems)) {
      return [];
    }

    return cartItems.filter(item => item.product.id !== productId);
  }

  /**
   * 장바구니 아이템의 수량 업데이트
   * @param {Array<CartItemData>} cartItems - 장바구니 아이템 배열
   * @param {string} productId - 업데이트할 상품 ID
   * @param {number} newQuantity - 새로운 수량
   * @returns {Array<CartItemData>} 업데이트된 아이템 배열
   */
  static updateItemQuantity(cartItems, productId, newQuantity) {
    if (!Array.isArray(cartItems)) {
      return [];
    }

    if (newQuantity <= 0) {
      return CartDisplay.removeItemByProductId(cartItems, productId);
    }

    return cartItems.map(item => {
      if (item.product.id === productId) {
        return {
          ...item,
          quantity: newQuantity,
          subtotal: item.product.val * newQuantity
        };
      }
      return item;
    });
  }
}
