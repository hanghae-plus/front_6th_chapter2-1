// ================================================
// 이벤트 바인딩 관리
// ================================================

import { handleAddToCart, handleCartClick } from './cart.js';
import { handleManualToggle, handleManualOverlayClick, handleProductSelectChange } from './ui.js';

/**
 * 모든 이벤트 리스너를 바인딩하는 함수
 * @param {Object} context - 컨텍스트 객체
 */
export function bindEventListeners(context) {
  const { addBtn, cartDisp, manualToggle, manualOverlay, sel } = context;

  // 장바구니 관련 이벤트
  addBtn.addEventListener('click', (event) => handleAddToCart(event, context));
  cartDisp.addEventListener('click', (event) => handleCartClick(event, context));

  // UI 관련 이벤트
  manualToggle.addEventListener('click', (event) => handleManualToggle(event, context));
  manualOverlay.addEventListener('click', (event) => handleManualOverlayClick(event, context));
  sel.addEventListener('change', (event) => handleProductSelectChange(event, context));
}

/**
 * 이벤트 리스너를 제거하는 함수
 * @param {Object} context - 컨텍스트 객체
 */
export function unbindEventListeners(context) {
  const { addBtn, cartDisp, manualToggle, manualOverlay, sel } = context;

  // 모든 이벤트 리스너 제거
  addBtn.removeEventListener('click', (event) => handleAddToCart(event, context));
  cartDisp.removeEventListener('click', (event) => handleCartClick(event, context));
  manualToggle.removeEventListener('click', (event) => handleManualToggle(event, context));
  manualOverlay.removeEventListener('click', (event) => handleManualOverlayClick(event, context));
  sel.removeEventListener('change', (event) => handleProductSelectChange(event, context));
}
