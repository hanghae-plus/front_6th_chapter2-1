// DOM 조작을 위한 유틸리티 함수들

// 장바구니 아이템의 현재 수량을 가져옵니다.
export function getCartItemQuantity(cartItemElement) {
  const quantityElement = cartItemElement.querySelector(".quantity-number");
  return quantityElement ? parseInt(quantityElement.textContent) : 0;
}

// 요소의 텍스트에서 숫자를 추출합니다.
export function extractNumberFromText(text, defaultValue = 0) {
  const match = text.match(/\d+/);
  return match ? parseInt(match[0]) : defaultValue;
}
