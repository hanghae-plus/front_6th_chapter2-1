// ==========================================
// 리액트 스러운 이벤트 핸들러
// ==========================================

import {
  addToCart,
  changeQuantity,
  removeFromCart,
  selectProduct,
} from '../state/stateManager.js';
import { renderApp } from '../renderer/stateRenderer.js';

/**
 * 앱 상태 관리자
 */
class AppStateManager {
  constructor() {
    this.state = null;
    this.renderCallback = null;
  }

  /**
   * 앱 초기화
   *
   * @param {Function} renderCallback - 렌더링 콜백 함수
   */
  init(renderCallback) {
    this.renderCallback = renderCallback;
    this.state = this.createInitialState();
    this.render();
  }

  /**
   * 초기 상태 생성
   *
   * @returns {Object} 초기 상태
   */
  createInitialState() {
    return {
      products: [
        { id: 'p1', name: '버그 없애는 키보드', val: 30000, quantity: 10 },
        { id: 'p2', name: '생산성 폭발 마우스', val: 30000, quantity: 10 },
        { id: 'p3', name: '거북목 탈출 모니터암', val: 30000, quantity: 10 },
        { id: 'p4', name: '에러 방지 노트북 파우치', val: 30000, quantity: 10 },
        {
          id: 'p5',
          name: '코딩할 때 듣는 Lo-Fi 스피커',
          val: 30000,
          quantity: 10,
        },
      ],
      cartItems: [],
      lastSelected: null,
    };
  }

  /**
   * 상태 업데이트 및 렌더링
   *
   * @param {Function} stateUpdater - 상태 업데이트 함수
   */
  setState(stateUpdater) {
    try {
      const newState = stateUpdater(this.state);
      this.state = newState;
      this.render();
    } catch (error) {
      console.error('상태 업데이트 오류:', error);
      alert(error.message);
    }
  }

  /**
   * 렌더링 실행
   */
  render() {
    if (this.renderCallback) {
      this.renderCallback(this.state);
    }
  }

  /**
   * 장바구니 추가 핸들러
   *
   * @param {string} productId - 상품 ID
   */
  handleAddToCart(productId) {
    this.setState(state => addToCart(state, productId));
  }

  /**
   * 수량 변경 핸들러
   *
   * @param {string} productId - 상품 ID
   * @param {string} action - 'increase' | 'decrease'
   */
  handleQuantityChange(productId, action) {
    this.setState(state => changeQuantity(state, productId, action));
  }

  /**
   * 장바구니에서 제거 핸들러
   *
   * @param {string} productId - 상품 ID
   */
  handleRemoveFromCart(productId) {
    this.setState(state => removeFromCart(state, productId));
  }

  /**
   * 상품 선택 핸들러
   *
   * @param {string} productId - 상품 ID
   */
  handleProductSelect(productId) {
    this.setState(state => selectProduct(state, productId));
  }
}

// 전역 앱 상태 관리자 인스턴스
export const appStateManager = new AppStateManager();

/**
 * 이벤트 위임을 통한 이벤트 핸들러 설정
 *
 * @param {HTMLElement} container - 이벤트를 위임할 컨테이너
 */
export function setupEventDelegation(container) {
  // 장바구니 추가 버튼
  container.addEventListener('click', event => {
    const addButton = event.target.closest('#add-to-cart');
    if (addButton) {
      const selectElement = document.getElementById('product-select');
      const selectedProductId = selectElement.value;
      if (selectedProductId) {
        appStateManager.handleAddToCart(selectedProductId);
      }
    }
  });

  // 수량 변경 버튼
  container.addEventListener('click', event => {
    const quantityBtn = event.target.closest('.quantity-btn');
    if (quantityBtn) {
      const { productId } = quantityBtn.dataset;
      const { action } = quantityBtn.dataset;

      if (productId && action) {
        appStateManager.handleQuantityChange(productId, action);
      }
    }
  });

  // 상품 제거 버튼
  container.addEventListener('click', event => {
    const removeBtn = event.target.closest('.remove-btn');
    if (removeBtn) {
      const { productId } = removeBtn.dataset;
      if (productId) {
        appStateManager.handleRemoveFromCart(productId);
      }
    }
  });

  // 상품 선택
  container.addEventListener('change', event => {
    const selectElement = event.target.closest('#product-select');
    if (selectElement) {
      const selectedProductId = selectElement.value;
      if (selectedProductId) {
        appStateManager.handleProductSelect(selectedProductId);
      }
    }
  });
}

/**
 * 앱 초기화 함수
 *
 * @param {HTMLElement} container - 앱 컨테이너
 */
export function initializeApp(container) {
  // 렌더링 콜백 설정
  appStateManager.init(state => {
    renderApp(state);
  });

  // 이벤트 위임 설정
  setupEventDelegation(container);
}
