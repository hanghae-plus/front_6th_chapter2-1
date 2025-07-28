/**
 * @fileoverview CartEventHandler 인터페이스
 * 장바구니 컴포넌트와 main.basic.js 간의 이벤트 처리를 담당
 *
 * 컴포넌트에서 발생하는 이벤트를 main.basic.js의 비즈니스 로직과 연결하는
 * 인터페이스 역할을 수행
 */

/**
 * @typedef {Object} CartEventCallbacks
 * @property {function} onQuantityChange - 수량 변경 시 호출되는 콜백
 * @property {function} onRemoveItem - 아이템 제거 시 호출되는 콜백
 * @property {function} onAddToCart - 장바구니 추가 시 호출되는 콜백
 * @property {function} onCartUpdate - 장바구니 업데이트 시 호출되는 콜백
 */

/**
 * @typedef {Object} QuantityChangeEvent
 * @property {string} productId - 상품 ID
 * @property {number} currentQuantity - 현재 수량
 * @property {number} changeAmount - 변경량 (+1, -1)
 * @property {number} newQuantity - 새로운 수량
 * @property {HTMLElement} target - 이벤트가 발생한 DOM 요소
 */

/**
 * @typedef {Object} RemoveItemEvent
 * @property {string} productId - 제거할 상품 ID
 * @property {number} currentQuantity - 현재 수량
 * @property {HTMLElement} target - 이벤트가 발생한 DOM 요소
 */

/**
 * 장바구니 이벤트 핸들러 클래스
 * 이벤트 위임 패턴을 사용하여 동적으로 생성되는 장바구니 아이템들의 이벤트를 처리
 */
export class CartEventHandler {
  /**
   * 장바구니 컨테이너에 이벤트 리스너를 설정
   * @param {HTMLElement} cartContainer - 장바구니 컨테이너 DOM 요소
   * @param {CartEventCallbacks} callbacks - 이벤트 콜백 함수들
   */
  static setupEventListeners(cartContainer, callbacks) {
    if (!cartContainer) {
      throw new Error(
        'CartEventHandler.setupEventListeners: cartContainer는 필수입니다.'
      );
    }

    if (!callbacks) {
      throw new Error(
        'CartEventHandler.setupEventListeners: callbacks는 필수입니다.'
      );
    }

    // 기존 이벤트 리스너 제거 (중복 방지)
    CartEventHandler.removeEventListeners(cartContainer);

    // 이벤트 위임을 사용한 클릭 이벤트 처리
    const clickHandler = event => {
      CartEventHandler.handleClickEvent(event, callbacks);
    };

    cartContainer.addEventListener('click', clickHandler);

    // 이벤트 리스너 정리를 위해 컨테이너에 참조 저장
    cartContainer._cartClickHandler = clickHandler;
  }

  /**
   * 장바구니 컨테이너에서 이벤트 리스너를 제거
   * @param {HTMLElement} cartContainer - 장바구니 컨테이너 DOM 요소
   */
  static removeEventListeners(cartContainer) {
    if (cartContainer && cartContainer._cartClickHandler) {
      cartContainer.removeEventListener(
        'click',
        cartContainer._cartClickHandler
      );
      delete cartContainer._cartClickHandler;
    }
  }

  /**
   * 클릭 이벤트를 처리하여 적절한 액션을 수행
   * @param {Event} event - 클릭 이벤트 객체
   * @param {CartEventCallbacks} callbacks - 이벤트 콜백 함수들
   */
  static handleClickEvent(event, callbacks) {
    const target = event.target;

    // 수량 변경 버튼 클릭 처리
    if (target.classList.contains('quantity-change')) {
      event.preventDefault();
      CartEventHandler.handleQuantityChange(target, callbacks.onQuantityChange);
      return;
    }

    // 제거 버튼 클릭 처리
    if (target.classList.contains('remove-item')) {
      event.preventDefault();
      CartEventHandler.handleRemoveItem(target, callbacks.onRemoveItem);
      return;
    }
  }

  /**
   * 수량 변경 이벤트를 처리
   * @param {HTMLElement} target - 클릭된 버튼 요소
   * @param {function} onQuantityChange - 수량 변경 콜백 함수
   */
  static handleQuantityChange(target, onQuantityChange) {
    if (!onQuantityChange || typeof onQuantityChange !== 'function') {
      console.warn(
        'CartEventHandler: onQuantityChange 콜백이 제공되지 않았습니다.'
      );
      return;
    }

    const productId = target.dataset.productId;
    const changeAmount = parseInt(target.dataset.change);

    if (!productId || isNaN(changeAmount)) {
      console.error('CartEventHandler: 유효하지 않은 수량 변경 데이터입니다.', {
        productId,
        changeAmount
      });
      return;
    }

    // 현재 수량 찾기
    const itemElement = document.getElementById(productId);
    if (!itemElement) {
      console.error(
        'CartEventHandler: 상품 요소를 찾을 수 없습니다.',
        productId
      );
      return;
    }

    const quantityElement = itemElement.querySelector('.quantity-number');
    if (!quantityElement) {
      console.error(
        'CartEventHandler: 수량 요소를 찾을 수 없습니다.',
        productId
      );
      return;
    }

    const currentQuantity = parseInt(quantityElement.textContent);
    const newQuantity = currentQuantity + changeAmount;

    // 수량 변경 이벤트 데이터 생성
    const quantityChangeEvent = {
      productId,
      currentQuantity,
      changeAmount,
      newQuantity,
      target
    };

    // 콜백 호출
    onQuantityChange(quantityChangeEvent);
  }

  /**
   * 아이템 제거 이벤트를 처리
   * @param {HTMLElement} target - 클릭된 제거 버튼 요소
   * @param {function} onRemoveItem - 아이템 제거 콜백 함수
   */
  static handleRemoveItem(target, onRemoveItem) {
    if (!onRemoveItem || typeof onRemoveItem !== 'function') {
      console.warn(
        'CartEventHandler: onRemoveItem 콜백이 제공되지 않았습니다.'
      );
      return;
    }

    const productId = target.dataset.productId;

    if (!productId) {
      console.error('CartEventHandler: 유효하지 않은 제거 데이터입니다.', {
        productId
      });
      return;
    }

    // 현재 수량 찾기
    const itemElement = document.getElementById(productId);
    if (!itemElement) {
      console.error(
        'CartEventHandler: 상품 요소를 찾을 수 없습니다.',
        productId
      );
      return;
    }

    const quantityElement = itemElement.querySelector('.quantity-number');
    const currentQuantity = quantityElement
      ? parseInt(quantityElement.textContent)
      : 0;

    // 제거 이벤트 데이터 생성
    const removeItemEvent = {
      productId,
      currentQuantity,
      target
    };

    // 콜백 호출
    onRemoveItem(removeItemEvent);
  }

  /**
   * 장바구니 DOM 업데이트 후 이벤트 리스너 재설정
   * @param {HTMLElement} cartContainer - 장바구니 컨테이너 DOM 요소
   * @param {CartEventCallbacks} callbacks - 이벤트 콜백 함수들
   */
  static refreshEventListeners(cartContainer, callbacks) {
    CartEventHandler.setupEventListeners(cartContainer, callbacks);
  }

  /**
   * 특정 상품의 수량을 DOM에서 직접 업데이트
   * @param {string} productId - 상품 ID
   * @param {number} newQuantity - 새로운 수량
   * @returns {boolean} 업데이트 성공 여부
   */
  static updateQuantityInDOM(productId, newQuantity) {
    const itemElement = document.getElementById(productId);
    if (!itemElement) {
      return false;
    }

    const quantityElement = itemElement.querySelector('.quantity-number');
    if (!quantityElement) {
      return false;
    }

    quantityElement.textContent = newQuantity.toString();
    return true;
  }

  /**
   * 특정 상품을 DOM에서 제거
   * @param {string} productId - 제거할 상품 ID
   * @returns {boolean} 제거 성공 여부
   */
  static removeItemFromDOM(productId) {
    const itemElement = document.getElementById(productId);
    if (!itemElement) {
      return false;
    }

    itemElement.remove();
    return true;
  }

  /**
   * 수량 변경 버튼의 활성화/비활성화 상태 업데이트
   * @param {string} productId - 상품 ID
   * @param {Object} options - 버튼 상태 옵션
   * @param {boolean} options.canDecrease - 감소 버튼 활성화 여부
   * @param {boolean} options.canIncrease - 증가 버튼 활성화 여부
   */
  static updateButtonStates(productId, options) {
    const itemElement = document.getElementById(productId);
    if (!itemElement) {
      return;
    }

    const decreaseBtn = itemElement.querySelector('[data-change="-1"]');
    const increaseBtn = itemElement.querySelector('[data-change="1"]');

    if (decreaseBtn) {
      decreaseBtn.disabled = !options.canDecrease;
      if (options.canDecrease) {
        decreaseBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      } else {
        decreaseBtn.classList.add('opacity-50', 'cursor-not-allowed');
      }
    }

    if (increaseBtn) {
      increaseBtn.disabled = !options.canIncrease;
      if (options.canIncrease) {
        increaseBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      } else {
        increaseBtn.classList.add('opacity-50', 'cursor-not-allowed');
      }
    }
  }

  /**
   * main.basic.js와 호환되는 콜백 함수 팩토리
   * @param {Array} productList - 상품 목록
   * @param {function} calculateCartStuff - 장바구니 계산 함수
   * @param {function} updateSelectOptions - 선택 옵션 업데이트 함수
   * @returns {CartEventCallbacks} main.basic.js 호환 콜백 객체
   */
  static createMainBasicCompatibleCallbacks(
    productList,
    calculateCartStuff,
    updateSelectOptions
  ) {
    return {
      onQuantityChange: event => {
        const { productId, newQuantity } = event;

        // 상품 정보 찾기
        const product = productList.find(p => p.id === productId);
        if (!product) return;

        // 수량 유효성 검사
        if (newQuantity <= 0) {
          // 아이템 제거
          product.q += event.currentQuantity;
          CartEventHandler.removeItemFromDOM(productId);
        } else if (newQuantity <= product.q + event.currentQuantity) {
          // 수량 업데이트
          product.q -= event.changeAmount;
          CartEventHandler.updateQuantityInDOM(productId, newQuantity);
        } else {
          // 재고 부족 알림
          alert('재고가 부족합니다.');
          return;
        }

        // 장바구니 재계산 및 UI 업데이트
        calculateCartStuff();
        updateSelectOptions();
      },

      onRemoveItem: event => {
        const { productId, currentQuantity } = event;

        // 상품 정보 찾기
        const product = productList.find(p => p.id === productId);
        if (product) {
          product.q += currentQuantity;
        }

        // DOM에서 제거
        CartEventHandler.removeItemFromDOM(productId);

        // 장바구니 재계산 및 UI 업데이트
        calculateCartStuff();
        updateSelectOptions();
      }
    };
  }
}
