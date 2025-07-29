/**
 * DOM 조작을 위한 유틸리티 함수들
 */

/**
 * 장바구니 아이템의 현재 수량을 가져옵니다.
 * @param {HTMLElement} cartItemElement - 장바구니 아이템 요소
 * @returns {number} 현재 수량
 */
export function getCartItemQuantity(cartItemElement) {
  const quantityElement = cartItemElement.querySelector(".quantity-number");
  return quantityElement ? parseInt(quantityElement.textContent) : 0;
}

/**
 * 장바구니 아이템의 수량을 설정합니다.
 * @param {HTMLElement} cartItemElement - 장바구니 아이템 요소
 * @param {number} quantity - 설정할 수량
 */
export function setCartItemQuantity(cartItemElement, quantity) {
  const quantityElement = cartItemElement.querySelector(".quantity-number");
  if (quantityElement) {
    quantityElement.textContent = quantity;
  }
}

/**
 * 요소의 텍스트에서 숫자를 추출합니다.
 * @param {string} text - 텍스트
 * @param {number} defaultValue - 기본값
 * @returns {number} 추출된 숫자
 */
export function extractNumberFromText(text, defaultValue = 0) {
  const match = text.match(/\d+/);
  return match ? parseInt(match[0]) : defaultValue;
}
