// ==========================================
// 🎯 장바구니 가격 컴포넌트
// ==========================================

import {
  getDiscountedProductName,
  getDiscountedPriceHTML,
} from '../main.basic.js';

/**
 * 🤖 [AI-REFACTORED] 장바구니 가격 UI 업데이트 (SRP 적용)
 *
 * @description 번개세일이나 추천할인이 적용된 상품들의 장바구니 내 가격과 이름을 업데이트
 *
 * 업데이트 내용:
 * - 상품명에 할인 아이콘 추가 (⚡번개세일, 💝추천할인, ⚡💝동시할인)
 * - 가격 표시를 원가 취소선 + 할인가로 변경
 * - 할인 상태에 따른 색상 변경 (빨강/파랑/보라)
 *
 * 🎯 SRP 적용:
 * - 단일 책임: 장바구니 가격 UI 업데이트만 담당
 * - DOM 조작만 처리
 * - 비즈니스 로직 배제
 *
 * @sideEffects
 * - 장바구니 아이템들의 가격 표시 DOM 수정
 * - 상품명 텍스트 수정
 */
export function updateCartPricesUI() {
  const cartDisplay = document.getElementById('cart-display');
  const cartItems = cartDisplay?.children;

  if (!cartItems) {
    return;
  }

  // 🎯 for문 → Array.from() + forEach() 메서드로 현대화
  Array.from(cartItems).forEach(cartItem => {
    const product = findProductById(cartItem.id);
    if (product) {
      const priceDiv = cartItem.querySelector('.text-lg');
      const nameDiv = cartItem.querySelector('h3');

      // 🎯 DRY 적용: 중복 제거된 유틸리티 사용
      priceDiv.innerHTML = getDiscountedPriceHTML(product);
      nameDiv.textContent = getDiscountedProductName(product);
    }
  });
}

/**
 * ID로 상품 찾기 (유틸리티 함수)
 *
 * @param {string} productId - 찾을 상품의 ID
 * @returns {Object|null} 찾은 상품 객체 또는 null
 */
const findProductById = productId => {
  // 전역 appState에 접근하기 위해 window 객체 사용
  const appState = window.appState || {};
  return appState.products?.find(product => product.id === productId) || null;
};
