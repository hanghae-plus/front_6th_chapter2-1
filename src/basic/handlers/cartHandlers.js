// ==========================================
// 장바구니 이벤트 핸들러 🎯
// ==========================================

import {
  addProductToCart,
  removeItem,
  changeCartItemQuantity,
} from '../services/cartService.js';

// ==========================================
// 이벤트 핸들러 함수들
// ==========================================

/**
 * 장바구니 클릭 이벤트 핸들러 (수량 변경, 삭제)
 * @param {Event} e - 클릭 이벤트
 * @param {Function} handleCalculateCartStuff - 총액 계산 함수
 * @param {Function} updateProductOptions - 상품 옵션 업데이트 함수
 */
export function handleCartClick(
  e,
  handleCalculateCartStuff,
  updateProductOptions
) {
  // Remove 버튼 처리
  if (e.target.classList.contains('remove-item')) {
    const productId = e.target.dataset.productId;
    removeItem(productId, handleCalculateCartStuff);
  }

  // 수량 변경 버튼 처리
  if (e.target.classList.contains('quantity-change')) {
    const productId = e.target.dataset.productId;
    const change = parseInt(e.target.dataset.change);
    changeCartItemQuantity(
      productId,
      change,
      handleCalculateCartStuff,
      updateProductOptions
    );
  }
}

/**
 * 상품 추가 버튼 클릭 핸들러
 * @param {HTMLSelectElement} productSelect - 상품 선택 요소
 * @param {HTMLElement} cartDisplay - 장바구니 컨테이너
 * @param {Function} handleCalculateCartStuff - 총액 계산 함수
 * @returns {string|null} - 추가된 상품 ID 또는 null
 */
export function handleAddButtonClick(
  productSelect,
  cartDisplay,
  handleCalculateCartStuff
) {
  const selectedProductId = productSelect.value;

  // cartService 사용하여 상품 추가
  const addedProductId = addProductToCart(
    selectedProductId,
    cartDisplay,
    handleCalculateCartStuff
  );

  return addedProductId;
}

/**
 * 장바구니 이벤트 리스너 등록
 * @param {HTMLElement} cartDisplay - 장바구니 컨테이너
 * @param {HTMLButtonElement} addButton - 추가 버튼
 * @param {HTMLSelectElement} productSelect - 상품 선택 요소
 * @param {Function} handleCalculateCartStuff - 총액 계산 함수
 * @param {Function} updateProductOptions - 상품 옵션 업데이트 함수
 * @param {Object} globalState - 전역 상태 (lastSelectedProduct)
 */
export function setupCartEventListeners(
  cartDisplay,
  addButton,
  productSelect,
  handleCalculateCartStuff,
  updateProductOptions,
  globalState
) {
  // 장바구니 클릭 이벤트 등록
  cartDisplay.addEventListener('click', (e) => {
    handleCartClick(e, handleCalculateCartStuff, updateProductOptions);
  });

  // 상품 추가 버튼 이벤트 등록
  addButton.addEventListener('click', () => {
    const addedProductId = handleAddButtonClick(
      productSelect,
      cartDisplay,
      handleCalculateCartStuff
    );

    if (addedProductId) {
      globalState.lastSelectedProduct = addedProductId;
    }
  });
}
