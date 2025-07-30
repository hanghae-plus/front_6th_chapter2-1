// ==========================================
// React 스타일 이벤트 핸들러 및 상태 관리
// ==========================================

import { useAppState } from '../hooks/useAppState.js';

/**
 * React 스타일 이벤트 핸들러 생성기
 * 
 * @param {Object} appState - useAppState에서 반환된 상태 관리 객체
 * @returns {Object} 이벤트 핸들러들
 */
export function createEventHandlers(appState) {
  const { actions } = appState;

  return {
    // 상품 선택 핸들러
    onProductSelect: (productId) => {
      actions.setLastSelected(productId);
    },

    // 장바구니 추가 핸들러
    onAddToCart: (productId) => {
      const state = appState.getState();
      const product = state.products.find(p => p.id === productId);
      
      if (!product || product.quantity <= 0) {
        alert('재고가 부족합니다.');
        return;
      }

      // 상품 재고 감소
      actions.updateProduct(productId, { 
        quantity: product.quantity - 1 
      });

      // 장바구니 업데이트 (실제 로직은 추후 구현)
      actions.updateCart(cart => ({
        ...cart,
        itemCount: cart.itemCount + 1,
        totalAmount: cart.totalAmount + product.val
      }));
    },

    // 수량 변경 핸들러
    onQuantityChange: (productId, newQuantity) => {
      const state = appState.getState();
      const product = state.products.find(p => p.id === productId);
      
      if (!product) return;

      const quantityDiff = newQuantity - (product.currentCartQuantity || 0);
      
      if (product.quantity < quantityDiff) {
        alert('재고가 부족합니다.');
        return;
      }

      actions.updateProduct(productId, {
        quantity: product.quantity - quantityDiff,
        currentCartQuantity: newQuantity
      });
    },

    // 장바구니에서 제거 핸들러
    onRemoveFromCart: (productId) => {
      const state = appState.getState();
      const product = state.products.find(p => p.id === productId);
      
      if (!product) return;

      // 재고 복원
      actions.updateProduct(productId, {
        quantity: product.quantity + (product.currentCartQuantity || 0),
        currentCartQuantity: 0
      });

      // 장바구니에서 제거
      actions.updateCart(cart => ({
        ...cart,
        itemCount: Math.max(0, cart.itemCount - (product.currentCartQuantity || 0)),
        totalAmount: Math.max(0, cart.totalAmount - (product.val * (product.currentCartQuantity || 0)))
      }));
    }
  };
}

/**
 * React 스타일 이벤트 위임 시스템
 * 
 * @param {HTMLElement} container - 이벤트를 위임할 컨테이너
 * @param {Object} handlers - 이벤트 핸들러들
 */
export function setupEventDelegation(container, handlers) {
  const {
    onProductSelect,
    onAddToCart,
    onQuantityChange,
    onRemoveFromCart
  } = handlers;

  // 이벤트 위임을 통한 효율적인 이벤트 처리
  container.addEventListener('click', (event) => {
    // 장바구니 추가 버튼
    if (event.target.matches('#add-to-cart') || event.target.closest('#add-to-cart')) {
      event.preventDefault();
      const selectElement = document.getElementById('product-select');
      const selectedProductId = selectElement?.value;
      
      if (selectedProductId && onAddToCart) {
        onAddToCart(selectedProductId);
      }
      return;
    }

    // 수량 변경 버튼
    const quantityBtn = event.target.closest('[data-action][data-product-id]');
    if (quantityBtn && onQuantityChange) {
      event.preventDefault();
      const productId = quantityBtn.dataset.productId;
      const action = quantityBtn.dataset.action;
      
      if (productId && action) {
        const currentQty = parseInt(quantityBtn.parentElement.querySelector('.quantity-number')?.textContent || '0');
        const newQty = action === 'increase' ? currentQty + 1 : Math.max(0, currentQty - 1);
        onQuantityChange(productId, newQty);
      }
      return;
    }

    // 제거 버튼
    const removeBtn = event.target.closest('[data-remove][data-product-id]');
    if (removeBtn && onRemoveFromCart) {
      event.preventDefault();
      const productId = removeBtn.dataset.productId;
      if (productId) {
        onRemoveFromCart(productId);
      }
      return;
    }
  });

  // 상품 선택 변경
  container.addEventListener('change', (event) => {
    if (event.target.matches('#product-select') && onProductSelect) {
      const selectedProductId = event.target.value;
      if (selectedProductId) {
        onProductSelect(selectedProductId);
      }
    }
  });
}

/**
 * React 스타일 앱 초기화
 * 
 * @param {HTMLElement} container - 앱 컨테이너
 * @param {Function} renderFunction - 렌더링 함수
 */
export function initializeReactLikeApp(container, renderFunction) {
  // 상태 관리 생성
  const appState = useAppState();
  
  // 이벤트 핸들러 생성
  const handlers = createEventHandlers(appState);
  
  // 렌더링 콜백 등록
  const unsubscribe = appState.subscribe((newState) => {
    if (renderFunction) {
      renderFunction(newState, handlers);
    }
  });

  // 이벤트 위임 설정
  setupEventDelegation(container, handlers);

  // 초기 렌더링
  const initialState = appState.getState();
  if (renderFunction) {
    renderFunction(initialState, handlers);
  }

  // 정리 함수 반환 (React의 useEffect cleanup과 유사)
  return () => {
    unsubscribe();
  };
}
