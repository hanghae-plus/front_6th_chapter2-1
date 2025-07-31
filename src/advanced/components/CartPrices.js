// ==========================================
// 장바구니 가격 컴포넌트
// ==========================================

import {
  getDiscountedProductName,
  getDiscountedPriceHTML,
} from '../main.advanced.js';

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

 * - DOM 조작만 처리
 * - 비즈니스 로직 배제
 *
 * @param {Array} products - 상품 목록
 *
 * @sideEffects
 * - 장바구니 아이템들의 가격 표시 DOM 수정
 * - 상품명 텍스트 수정
 */
export function updateCartPricesUI(products) {
  const cartDisplay = document.getElementById('cart-display');
  const cartItems = cartDisplay?.children;

  if (!cartItems) {
    return;
  }

  Array.from(cartItems).forEach(cartItem => {
    const product = products.find(p => p.id === cartItem.id);
    if (product) {
      const priceDiv = cartItem.querySelector('.text-lg');
      const nameDiv = cartItem.querySelector('h3');

      priceDiv.innerHTML = getDiscountedPriceHTML(product);
      nameDiv.textContent = getDiscountedProductName(product);
    }
  });
}
